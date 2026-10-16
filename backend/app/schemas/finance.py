"""Validated request/response contracts for finance and budgets."""
from typing import Annotated, Literal
from pydantic import BaseModel, Field, StringConstraints

Month = Annotated[str, StringConstraints(pattern=r"^\d{4}-(0[1-9]|1[0-2])$")]
Category = Annotated[str, StringConstraints(min_length=1, max_length=60, strip_whitespace=True)]

class SummaryOut(BaseModel):
    month: Month
    currency: Literal['BDT']
    opening_balance_paisa: int
    income_paisa: int
    expenses_paisa: int
    balance_paisa: int
    unpaid_bills_paisa: int
    spendable_paisa: int
    category_expenses_paisa: dict[str, int]

class BudgetInput(BaseModel):
    month: Month
    category: Category
    limit_paisa: int = Field(ge=0, le=9_000_000_000_000_000)

class BudgetOut(BaseModel):
    id: int
    month: Month
    category: str
    limit_paisa: int
    spent_paisa: int
    remaining_paisa: int
    utilization_percent: float | None
    status: Literal['no_budget', 'within_budget', 'over_budget']
