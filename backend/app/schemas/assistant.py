"""Grounded AI chat request and response schema."""
from typing import Any, Literal
from pydantic import BaseModel, Field, StringConstraints
from typing import Annotated
from app.schemas.finance import Month

Question = Annotated[str, StringConstraints(strip_whitespace=True, min_length=3, max_length=500)]

class ChatInput(BaseModel):
    question: Question
    month: Month
    # An explicit amount avoids guessing about dates, quantities or phone models.
    purchase_amount_paisa: int | None = Field(default=None, gt=0, le=9_000_000_000_000_000)

class ChatOutput(BaseModel):
    month: Month
    currency: Literal['BDT'] = 'BDT'
    intent: Literal['summary', 'budget', 'forecast', 'purchase', 'bills', 'general']
    status: Literal['connected', 'not_configured', 'quota_exceeded', 'access_denied', 'model_unavailable', 'network_error', 'invalid_request', 'provider_unavailable', 'empty_response', 'unsafe_response', 'needs_amount']
    answer: str
    trusted_fields: dict[str, Any]
    limitations: list[str]
    source: Literal['gemini', 'deterministic']
