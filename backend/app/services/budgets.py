"""Month-specific category budgets with integer-paisa comparisons."""
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.models import Budget, Transaction
from app.services.finance import month_bounds


def list_budgets(db: Session, user_id: int, month: str) -> list[dict]:
    start, next_start = month_bounds(month)
    spent = dict(db.execute(select(Transaction.category, func.sum(Transaction.amount_paisa))
        .where(Transaction.user_id == user_id, Transaction.type == 'expense',
               Transaction.date >= start, Transaction.date < next_start)
        .group_by(Transaction.category)).all())
    limits = db.scalars(select(Budget).where(Budget.user_id == user_id, Budget.month == month)
                        .order_by(Budget.category)).all()
    result = []
    for budget in limits:
        actual = spent.get(budget.category, 0)
        limit = budget.limit_paisa
        result.append({"id": budget.id, "month": budget.month, "category": budget.category,
                       "limit_paisa": limit, "spent_paisa": actual, "remaining_paisa": limit - actual,
                       "utilization_percent": round(actual * 100 / limit, 2) if limit else None,
                       "status": 'no_budget' if not limit else ('over_budget' if actual > limit else 'within_budget')})
    return result


def upsert_budget(db: Session, user_id: int, month: str, category: str, limit: int) -> dict:
    budget = db.scalar(select(Budget).where(Budget.user_id == user_id, Budget.month == month,
                                            Budget.category == category))
    if budget is None:
        budget = Budget(user_id=user_id, month=month, category=category, limit_paisa=limit)
        db.add(budget)
    else:
        budget.limit_paisa = limit
    db.commit()
    db.refresh(budget)
    return next(row for row in list_budgets(db, user_id, month) if row['id'] == budget.id)
