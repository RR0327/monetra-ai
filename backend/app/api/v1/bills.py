"""Bill routes under /api/v1; synthetic record management only."""
from typing import Literal
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models import User
from app.schemas.bills import BillCreate, BillListOut, BillOut
from app.services.bills import create_bill, list_bills, mark_paid

router = APIRouter(prefix='/bills', tags=['bills'])

@router.post('', response_model=BillOut, status_code=201)
def post_bill(payload: BillCreate, db: Session = Depends(get_db),
              user: User = Depends(get_current_user)):
    return create_bill(db, user.id, payload.title, payload.due_date, payload.amount_paisa)

@router.get('', response_model=BillListOut)
def get_bills(status: Literal['pending', 'paid'] | None = Query(default=None), db: Session = Depends(get_db),
              user: User = Depends(get_current_user)):
    return list_bills(db, user.id, status)

@router.patch('/{bill_id}/paid', response_model=BillOut)
def patch_bill_paid(bill_id: int, db: Session = Depends(get_db),
                    user: User = Depends(get_current_user)):
    bill = mark_paid(db, user.id, bill_id)
    if bill is None:
        raise HTTPException(status_code=404, detail='Bill not found')
    return bill
