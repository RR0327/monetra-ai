"""Create/list/settle bills; settlement does not create a transaction."""
from datetime import date
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models import Bill

def create_bill(db: Session, user_id: int, title: str, due_date: date, amount_paisa: int) -> Bill:
    bill = Bill(user_id=user_id, title=title, due_date=due_date, amount_paisa=amount_paisa, status='pending')
    db.add(bill)
    db.commit()
    db.refresh(bill)
    return bill

def list_bills(db: Session, user_id: int, status: str | None = None) -> dict:
    query = select(Bill).order_by(Bill.due_date, Bill.id)
    query = query.where(Bill.user_id == user_id)
    if status:
        query = query.where(Bill.status == status)
    bills = list(db.scalars(query))
    return {'bills': bills, 'pending_total_paisa': sum(b.amount_paisa for b in bills if b.status == 'pending'), 'currency': 'BDT'}

def mark_paid(db: Session, user_id: int, bill_id: int) -> Bill | None:
    bill = db.scalar(select(Bill).where(Bill.id == bill_id, Bill.user_id == user_id))
    if bill is None:
        return None
    if bill.status != 'paid':
        bill.status = 'paid'
        db.commit()
        db.refresh(bill)
    return bill
