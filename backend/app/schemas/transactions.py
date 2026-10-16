from datetime import date
from pydantic import BaseModel, ConfigDict, Field

class TransactionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    date: date
    description: str
    type: str
    category: str
    amount_paisa: int

class CategoryUpdate(BaseModel):
    category: str = Field(min_length=1, max_length=60)
