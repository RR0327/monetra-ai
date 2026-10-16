"""Read-only simulation route."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.simulation import PurchaseInput, PurchaseOut
from app.services.simulator import simulate_purchase
from app.services.transactions import ALLOWED_CATEGORIES

router = APIRouter(tags=['simulation'])

@router.post('/simulations/purchase', response_model=PurchaseOut)
def post_purchase(payload: PurchaseInput, db: Session = Depends(get_db)):
    if payload.category not in ALLOWED_CATEGORIES or payload.category == 'Income':
        raise HTTPException(status_code=422, detail='Choose a valid expense category')
    return simulate_purchase(db, payload.month, payload.purchase_amount_paisa, payload.category)
