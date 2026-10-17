"""Transparent calendar-day run-rate forecasts; integer paisa throughout."""
from calendar import monthrange
from datetime import date, timedelta
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.models import Transaction
from app.services.finance import month_bounds, summary_for_month


def forecast_month_end(expenses_paisa: int, elapsed_days: int, days_in_month: int) -> int:
    """Estimate full month spending using half-up rounding for positive paisa."""
    if elapsed_days <= 0:
        return 0
    return (expenses_paisa * days_in_month + elapsed_days // 2) // elapsed_days


def classify_risk(projected_obligations_paisa: int, available_funds_paisa: int) -> str:
    """Prototype bands: <=80% low, <=100% medium, >100% high."""
    if available_funds_paisa <= 0:
        return 'high' if projected_obligations_paisa > 0 else 'unknown'
    if projected_obligations_paisa * 5 <= available_funds_paisa * 4:
        return 'low'
    if projected_obligations_paisa <= available_funds_paisa:
        return 'medium'
    return 'high'


def forecast_for_month(db: Session, user_id: int, month: str, as_of: date | None = None) -> dict:
    today = as_of or date.today()
    start, next_start = month_bounds(month)
    days = monthrange(start.year, start.month)[1]
    cutoff = min(today, next_start - timedelta(days=1))
    elapsed = max(0, (cutoff - start).days + 1)
    # Only expenses recorded through the cutoff are used. Future-dated rows
    # must not leak into a forecast, even if already present in the database.
    spent = 0
    if elapsed:
        spent = db.scalar(select(func.coalesce(func.sum(Transaction.amount_paisa), 0)).where(
            Transaction.user_id == user_id, Transaction.type == 'expense',
            Transaction.date >= start, Transaction.date <= cutoff)) or 0
    estimated = forecast_month_end(spent, elapsed, days)
    complete = elapsed == days
    status = 'not_available' if elapsed == 0 else ('actual' if complete else 'forecast')
    confidence = 'unavailable' if elapsed == 0 else ('actual' if complete else ('low' if elapsed < 7 else 'indicative'))
    # Forecast totals are the entire month's expenses. Avoid adding expenses
    # already recorded a second time when classifying risk.
    summary = summary_for_month(db, user_id, month)
    available = summary['opening_balance_paisa'] + (
        db.scalar(select(func.coalesce(func.sum(Transaction.amount_paisa), 0)).where(
            Transaction.user_id == user_id, Transaction.type == 'income',
            Transaction.date >= start, Transaction.date <= cutoff)) or 0
    )
    # Pending bills are reserved once; paid bills do not count as pending.
    # The summary service reserves currently pending bills through month end.
    unpaid = summary['unpaid_bills_paisa']
    obligations = estimated + unpaid
    risk = 'unknown' if elapsed == 0 else classify_risk(obligations, available)
    return {
        'month': month, 'currency': 'BDT', 'as_of_date': today.isoformat(),
        'cutoff_date': cutoff.isoformat() if elapsed else None,
        'days_in_month': days, 'elapsed_days': elapsed,
        'recorded_expenses_paisa': spent,
        'projected_month_end_expenses_paisa': estimated if elapsed else None,
        'estimated_remaining_expenses_paisa': max(0, estimated - spent) if elapsed else None,
        'available_funds_paisa': available,
        'unpaid_bills_paisa': unpaid,
        'projected_obligations_paisa': obligations if elapsed else None,
        'risk_level': risk, 'confidence': confidence, 'status': status,
        'risk_ratio_percent': round(obligations * 100 / available, 2) if elapsed and available > 0 else None,
        'assumptions': [
            'Daily run-rate = recorded expenses through cutoff / elapsed calendar days.',
            'Projected month-end expenses = daily run-rate × calendar days in month.',
            'Risk compares projected total expenses plus pending bills with opening balance and income received through cutoff.',
            'Planned future income is excluded. Historical bill status is not reconstructed.',
        ],
        'warning': ('Selected month has not begun; no forecast is available.' if elapsed == 0 else
                    'Fewer than 7 elapsed days; prediction is highly uncertain.' if elapsed < 7 else
                    'Projection is an estimate, not a guarantee.' if not complete else
                    'Completed month: recorded expenses are shown, not a prediction.'),
    }
