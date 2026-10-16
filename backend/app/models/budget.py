from sqlalchemy import CheckConstraint, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Budget(Base):
    __tablename__ = "budgets"
    __table_args__ = (
        CheckConstraint("limit_paisa >= 0", name="nonnegative_budget"),
        UniqueConstraint("month", "category", name="uq_budget_month_category"),
    )
    id: Mapped[int] = mapped_column(primary_key=True)
    month: Mapped[str] = mapped_column(String(7), nullable=False)  # YYYY-MM; validate in API schema
    category: Mapped[str] = mapped_column(String(60), nullable=False)
    limit_paisa: Mapped[int] = mapped_column(Integer, nullable=False)
