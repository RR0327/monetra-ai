from datetime import date
import pytest
from sqlalchemy import create_engine, inspect
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.core.database import Base
from app.models import Bill, Budget, Setting, Transaction

@pytest.fixture
def engine(tmp_path):
    database = create_engine(f"sqlite:///{tmp_path / 'test.db'}")
    Base.metadata.create_all(database)
    yield database
    database.dispose()

def test_four_tables_exist(engine):
    assert {"transactions", "budgets", "bills", "settings"}.issubset(set(inspect(engine).get_table_names()))

def test_insert_and_persist(engine):
    with Session(engine) as db:
        db.add_all([
            Transaction(date=date(2026,10,1), description="Salary", type="income",category="Income",amount_paisa=3000000,fingerprint="salary-oct"),
            Budget(month="2026-10", category="Food", limit_paisa=500000),
            Bill(title="Internet", due_date=date(2026,10,20),amount_paisa=100000,status="pending"),
            Setting(currency="BDT", opening_balance_paisa=0),
        ])
        db.commit()
    with Session(engine) as db:
        assert db.query(Transaction).count() == 1
        assert db.query(Budget).count() == 1
        assert db.query(Bill).count() == 1
        assert db.query(Setting).count() == 1

def test_duplicate_fingerprint_rejected(engine):
    with Session(engine) as db:
        for index in range(2):
            db.add(Transaction(date=date(2026,10,1),description=f"Salary {index}",type="income",category="Income",amount_paisa=100,fingerprint="same"))
            if index == 0:
                db.commit()
        with pytest.raises(IntegrityError):
            db.commit()
        db.rollback()

def test_nonpositive_amount_rejected(engine):
    with Session(engine) as db:
        db.add(Transaction(date=date(2026,10,1),description="Invalid",type="expense",category="Other",amount_paisa=0,fingerprint="bad"))
        with pytest.raises(IntegrityError):
            db.commit()
        db.rollback()
