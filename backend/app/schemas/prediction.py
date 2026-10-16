"""API contract for deterministic spending forecast and financial risk."""
from datetime import date
from typing import Literal
from pydantic import BaseModel
from app.schemas.finance import Month

class ForecastOut(BaseModel):
    month: Month
    currency: Literal['BDT']
    as_of_date: date
    cutoff_date: date | None
    days_in_month: int
    elapsed_days: int
    recorded_expenses_paisa: int
    projected_month_end_expenses_paisa: int | None
    estimated_remaining_expenses_paisa: int | None
    available_funds_paisa: int
    unpaid_bills_paisa: int
    projected_obligations_paisa: int | None
    risk_level: Literal['low','medium','high','unknown']
    confidence: Literal['low','indicative','actual','unavailable']
    status: Literal['forecast','actual','not_available']
    risk_ratio_percent: float | None
    assumptions: list[str]
    warning: str
