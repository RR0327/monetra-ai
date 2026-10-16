"""Transaction import, listing, and user category corrections."""
from datetime import date
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Transaction
from app.schemas.transactions import CategoryUpdate, TransactionOut
from app.services.transactions import ALLOWED_CATEGORIES, MAX_UPLOAD_BYTES, import_csv

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.post("/import")
async def upload_transactions(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Choose a .csv file")
    content = await file.read(MAX_UPLOAD_BYTES + 1)
    await file.close()
    try:
        return import_csv(db, content)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from None

@router.get("", response_model=list[TransactionOut])
def list_transactions(month: str | None = Query(default=None, pattern=r"^\d{4}-(0[1-9]|1[0-2])$"),
                      category: str | None = None, db: Session = Depends(get_db)):
    statement = select(Transaction)
    if month:
        start = date.fromisoformat(f"{month}-01")
        end = date(start.year + 1, 1, 1) if start.month == 12 else date(start.year, start.month + 1, 1)
        statement = statement.where(Transaction.date >= start, Transaction.date < end)
    if category:
        statement = statement.where(Transaction.category == category)
    return db.scalars(statement.order_by(Transaction.date.desc(), Transaction.id.desc()).limit(500)).all()

@router.patch("/{transaction_id}", response_model=TransactionOut)
def update_category(transaction_id: int, payload: CategoryUpdate, db: Session = Depends(get_db)):
    if payload.category not in ALLOWED_CATEGORIES:
        raise HTTPException(status_code=422, detail="Unsupported category")
    transaction = db.get(Transaction, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    transaction.category = payload.category
    db.commit()
    db.refresh(transaction)
    return transaction
