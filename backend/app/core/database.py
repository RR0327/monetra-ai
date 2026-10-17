"""SQLite engine and short-lived SQLAlchemy sessions."""
import os
from pathlib import Path
from sqlalchemy import create_engine, event, inspect, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DEFAULT_DB = Path(__file__).resolve().parents[2] / "monetra.db"
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB.as_posix()}")

class Base(DeclarativeBase):
    pass

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)

if DATABASE_URL.startswith("sqlite"):
    @event.listens_for(engine, "connect")
    def enable_foreign_keys(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def initialize_database():
    from app.models import AuthSession, Bill, Budget, Setting, Transaction, User  # noqa: F401
    Base.metadata.create_all(bind=engine)
    # create_all does not add columns to the shipped legacy SQLite database.
    # These nullable columns keep existing installations bootable; new records
    # are always created with an authenticated owner.
    if DATABASE_URL.startswith("sqlite"):
        tables = set(inspect(engine).get_table_names())
        owned_tables = {"transactions", "budgets", "bills", "settings"}
        with engine.begin() as connection:
            for table in owned_tables & tables:
                columns = {column["name"] for column in inspect(engine).get_columns(table)}
                if "user_id" not in columns:
                    connection.execute(text(f"ALTER TABLE {table} ADD COLUMN user_id INTEGER"))
            if "users" in tables:
                columns = {column["name"] for column in inspect(engine).get_columns("users")}
                if "username" not in columns:
                    connection.execute(text("ALTER TABLE users ADD COLUMN username VARCHAR(30)"))
                    connection.execute(text(
                        "UPDATE users SET username = 'user_' || id WHERE username IS NULL"
                    ))
                    connection.execute(text(
                        "CREATE UNIQUE INDEX IF NOT EXISTS ix_users_username ON users (username)"
                    ))
