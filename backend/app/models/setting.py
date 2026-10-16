from sqlalchemy import CheckConstraint, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class Setting(Base):
    __tablename__ = "settings"
    __table_args__ = (CheckConstraint("currency = 'BDT'", name="currency_bdt_only"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="BDT")
    opening_balance_paisa: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    monthly_income_target_paisa: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
