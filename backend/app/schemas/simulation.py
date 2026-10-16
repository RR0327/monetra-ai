"""Purchase what-if contract: all money in integer paisa."""
from typing import Literal
from pydantic import BaseModel, Field
from app.schemas.finance import Month, Category

class PurchaseInput(BaseModel):
    month: Month
    purchase_amount_paisa: int = Field(gt=0, le=9_000_000_000_000_000)
    category: Category = 'Shopping'

class PurchaseOut(BaseModel):
    month: Month
    currency: Literal['BDT'] = 'BDT'
    purchase_amount_paisa: int
    category: str
    current_balance_paisa: int
    pending_bills_paisa: int
    balance_after_purchase_paisa: int
    spendable_after_bills_paisa: int
    estimated_remaining_essentials_paisa: int | None
    spendable_after_essentials_paisa: int | None
    risk_level_before: Literal['low','medium','high','unknown']
    risk_level_after: Literal['low','medium','high','unknown']
    projected_obligations_after_paisa: int | None
    forecast_status: str
    assumptions: list[str]
    warning: str
