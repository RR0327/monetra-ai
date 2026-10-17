"""Read-only simulation route."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.simulation import PurchaseInput, PurchaseOut
from app.services.simulator import simulate_purchase
from app.services.transactions import ALLOWED_CATEGORIES
from app.core.auth import get_current_user
from app.models import User

router = APIRouter(tags=['simulation'])

@router.post('/simulations/purchase', response_model=PurchaseOut)
def post_purchase(payload: PurchaseInput, db: Session = Depends(get_db),
                  user: User = Depends(get_current_user)):
    if payload.category not in ALLOWED_CATEGORIES or payload.category == 'Income':
        raise HTTPException(status_code=422, detail='Choose a valid expense category')
    return simulate_purchase(db, user.id, payload.month, payload.purchase_amount_paisa, payload.category)
