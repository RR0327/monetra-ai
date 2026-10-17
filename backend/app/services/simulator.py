"""Read-only purchase simulation. No database writes are performed."""
from sqlalchemy.orm import Session
from app.services.finance import summary_for_month
from app.services.prediction import forecast_for_month, classify_risk

def simulate_purchase(db: Session, user_id: int, month: str, amount: int, category: str) -> dict:
    summary = summary_for_month(db, user_id, month)
    forecast = forecast_for_month(db, user_id, month)
    balance_after = summary['balance_paisa'] - amount
    after_bills = balance_after - summary['unpaid_bills_paisa']
    remaining = forecast['estimated_remaining_expenses_paisa']
    # The forecast is a broad run-rate proxy for future expenses, not a
    # category-specific essentials prediction. Clearly label this limitation.
    after_essentials = after_bills - remaining if remaining is not None else None
    obligations = forecast['projected_obligations_paisa']
    after_obligations = obligations + amount if obligations is not None else None
    risk_after = (classify_risk(after_obligations, forecast['available_funds_paisa'])
                  if after_obligations is not None else 'unknown')
    return {
        'month': month, 'currency': 'BDT', 'purchase_amount_paisa': amount,
        'category': category, 'current_balance_paisa': summary['balance_paisa'],
        'pending_bills_paisa': summary['unpaid_bills_paisa'],
        'balance_after_purchase_paisa': balance_after,
        'spendable_after_bills_paisa': after_bills,
        'estimated_remaining_essentials_paisa': remaining,
        'spendable_after_essentials_paisa': after_essentials,
        'risk_level_before': forecast['risk_level'], 'risk_level_after': risk_after,
        'projected_obligations_after_paisa': after_obligations,
        'forecast_status': forecast['status'],
        'assumptions': [
            'This is a read-only scenario. No transactions or bills are created or changed.',
            'Balances use all recorded transactions, not actual bank connections.',
            'Estimated remaining essentials is a conservative proxy: all forecast remaining expenses, not independently identified essentials.',
            'Pending bills are reserved once; projected full-month expenses already include recorded spending.',
            'Forecast risk compares projected expenses, bills, and the proposed purchase against funds received through the forecast cutoff.',
        ],
        'warning': ('Future month: expense forecast is unavailable, so post-purchase risk is unknown.'
                    if remaining is None else
                    'Projected shortfall after remaining expenses and bills.' if after_essentials < 0 else
                    'Estimate only; unexpected costs can reduce available funds.'),
    }
