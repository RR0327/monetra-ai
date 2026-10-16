"""Bill inputs and output for synthetic demo records."""
from datetime import date
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, StringConstraints
from typing import Annotated

class BillCreate(BaseModel):
    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
    due_date: date
    amount_paisa: int = Field(gt=0, le=9_000_000_000_000_000)

class BillOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    due_date: date
    amount_paisa: int
    status: Literal['pending', 'paid']

class BillListOut(BaseModel):
    bills: list[BillOut]
    pending_total_paisa: int
    currency: Literal['BDT'] = 'BDT'
