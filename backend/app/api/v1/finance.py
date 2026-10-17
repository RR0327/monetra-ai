"""Read-only summary and monthly budget API."""
from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.finance import BudgetInput, BudgetOut, Month, SummaryOut
from app.services.finance import summary_for_month
from app.services.budgets import list_budgets, upsert_budget
from app.services.transactions import ALLOWED_CATEGORIES
from app.core.auth import get_current_user
from app.models import User
from fastapi import HTTPException

router = APIRouter(tags=['finance'])

def selected_month(month: Month | None = None) -> str:
    return month or date.today().strftime('%Y-%m')

@router.get('/summary', response_model=SummaryOut)
def summary(month: Month | None = Query(default=None), db: Session = Depends(get_db),
            user: User = Depends(get_current_user)):
    return summary_for_month(db, user.id, selected_month(month))

@router.get('/budgets', response_model=list[BudgetOut])
def get_budgets(month: Month | None = Query(default=None), db: Session = Depends(get_db),
                user: User = Depends(get_current_user)):
    return list_budgets(db, user.id, selected_month(month))

@router.put('/budgets', response_model=BudgetOut)
def put_budget(payload: BudgetInput, db: Session = Depends(get_db),
               user: User = Depends(get_current_user)):
    if payload.category not in ALLOWED_CATEGORIES or payload.category == 'Income':
        raise HTTPException(status_code=422, detail='Choose an expense category')
    return upsert_budget(db, user.id, payload.month, payload.category, payload.limit_paisa)
