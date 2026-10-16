"""Authoritative money calculations: all amounts are integer paisa."""
from datetime import date
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.models import Transaction, Bill, Setting


def month_bounds(month: str) -> tuple[date, date]:
    year, number = map(int, month.split("-"))
    start = date(year, number, 1)
    next_start = date(year + 1, 1, 1) if number == 12 else date(year, number + 1, 1)
    return start, next_start


def calculate_summary(opening_balance: int, income: int, expenses: int, unpaid_bills: int) -> dict:
    balance = opening_balance + income - expenses
    return {"income_paisa": income, "expenses_paisa": expenses, "balance_paisa": balance,
            "unpaid_bills_paisa": unpaid_bills, "spendable_paisa": balance - unpaid_bills}


def summary_for_month(db: Session, month: str) -> dict:
    start, next_start = month_bounds(month)
    opening = db.scalar(select(Setting.opening_balance_paisa).order_by(Setting.id).limit(1)) or 0
    # Previous transactions contribute to balance carried into this month.
    earlier = db.execute(select(Transaction.type, func.coalesce(func.sum(Transaction.amount_paisa), 0))
        .where(Transaction.date < start).group_by(Transaction.type)).all()
    earlier_totals = dict(earlier)
    carried = opening + earlier_totals.get('income', 0) - earlier_totals.get('expense', 0)
    current_rows = db.execute(select(Transaction.type, Transaction.category,
        func.sum(Transaction.amount_paisa)).where(Transaction.date >= start, Transaction.date < next_start)
        .group_by(Transaction.type, Transaction.category)).all()
    income = sum(amount for kind, _, amount in current_rows if kind == 'income')
    expenses = sum(amount for kind, _, amount in current_rows if kind == 'expense')
    categories = {category: amount for kind, category, amount in current_rows if kind == 'expense'}
    # Pending bills are reserved only if due on or before the selected month's end.
    # Historical snapshots are not reconstructed; statuses reflect current DB state.
    unpaid = db.scalar(select(func.coalesce(func.sum(Bill.amount_paisa), 0))
        .where(Bill.status == 'pending', Bill.due_date < next_start)) or 0
    result = calculate_summary(carried, income, expenses, unpaid)
    return {"month": month, "currency": "BDT", "opening_balance_paisa": carried,
            **result, "category_expenses_paisa": dict(sorted(categories.items()))}
