"""Read-only summary and monthly budget API."""
from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.finance import BudgetInput, BudgetOut, Month, SummaryOut
from app.services.finance import summary_for_month
from app.services.budgets import list_budgets, upsert_budget
from app.services.transactions import ALLOWED_CATEGORIES
from fastapi import HTTPException

router = APIRouter(tags=['finance'])

def selected_month(month: Month | None = None) -> str:
    return month or date.today().strftime('%Y-%m')

@router.get('/summary', response_model=SummaryOut)
def summary(month: Month | None = Query(default=None), db: Session = Depends(get_db)):
    return summary_for_month(db, selected_month(month))

@router.get('/budgets', response_model=list[BudgetOut])
def get_budgets(month: Month | None = Query(default=None), db: Session = Depends(get_db)):
    return list_budgets(db, selected_month(month))

@router.put('/budgets', response_model=BudgetOut)
def put_budget(payload: BudgetInput, db: Session = Depends(get_db)):
    if payload.category not in ALLOWED_CATEGORIES or payload.category == 'Income':
        raise HTTPException(status_code=422, detail='Choose an expense category')
    return upsert_budget(db, payload.month, payload.category, payload.limit_paisa)
