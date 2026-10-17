"""Intent routing and trusted read-only financial context; Gemini never computes balances."""
import re
from datetime import date
from decimal import Decimal, InvalidOperation
from sqlalchemy.orm import Session
from app.services.finance import summary_for_month
from app.services.budgets import list_budgets
from app.services.prediction import forecast_for_month
from app.services.simulator import simulate_purchase
from app.services.bills import list_bills

INTENT_PATTERNS = {
    'purchase': r'\b(buy|purchase|afford|spend on|what.if|simulate|shopping)\b',
    'bills': r'\b(bill|bills|due|payment|pending|obligation)\b',
    'budget': r'\b(budgets?|budgeting|limit|allocation|overbudget)\b',
    'forecast': r'\b(forecast|predict|prediction|risk|month.end|projection|shortfall|future)\b',
    'summary': r'\b(balance|income|expenses|expense|spent|spending|summary|savings|cash)\b',
}

def classify_intent(question: str) -> str:
    text = question.casefold()
    for intent, pattern in INTENT_PATTERNS.items():
        if re.search(pattern, text):
            return intent
    return 'general'


def extract_purchase_amount(question: str) -> int | None:
    """Only explicit BDT-qualified figures; reject ambiguous bare numbers."""
    patterns = [r'(?:bdt|৳|tk\.?)[ \t]*([0-9][0-9,]*(?:\.[0-9]{1,2})?)',
                r'([0-9][0-9,]*(?:\.[0-9]{1,2})?)[ \t]*(?:bdt|taka|tk\.?|৳)\b']
    found = []
    for pattern in patterns:
        for match in re.finditer(pattern, question, flags=re.IGNORECASE):
            try:
                number = Decimal(match.group(1).replace(',', ''))
                amount = number * 100
                if number > 0 and amount == amount.to_integral_value() and amount <= 9_000_000_000_000_000:
                    found.append(int(amount))
            except (InvalidOperation, ValueError):
                continue
    return found[0] if len(set(found)) == 1 and found else None


def build_financial_context(db: Session, user_id: int, month: str, intent: str,
                            purchase_amount_paisa: int | None = None) -> dict:
    """No writes, no individual descriptions, and no direct personal details."""
    summary = summary_for_month(db, user_id, month)
    context = {'month': month, 'currency': 'BDT', 'summary': {
        key: summary[key] for key in ('opening_balance_paisa','income_paisa','expenses_paisa',
        'balance_paisa','unpaid_bills_paisa','spendable_paisa')
    }}
    if intent in ('summary', 'general'):
        context['category_expenses_paisa'] = summary['category_expenses_paisa']
    if intent == 'budget':
        context['budgets'] = [{key: b[key] for key in ('category','limit_paisa','spent_paisa','remaining_paisa','status')}
                              for b in list_budgets(db, user_id, month)]
    if intent in ('forecast','purchase'):
        forecast = forecast_for_month(db, user_id, month)
        context['forecast'] = {key: forecast[key] for key in (
            'status','confidence','cutoff_date','recorded_expenses_paisa',
            'projected_month_end_expenses_paisa','estimated_remaining_expenses_paisa',
            'unpaid_bills_paisa','risk_level','warning')}
    if intent == 'purchase' and purchase_amount_paisa is not None:
        simulation = simulate_purchase(db, user_id, month, purchase_amount_paisa, 'Shopping')
        context['simulation'] = {key: simulation[key] for key in (
            'purchase_amount_paisa','category','balance_after_purchase_paisa',
            'spendable_after_bills_paisa','spendable_after_essentials_paisa',
            'risk_level_before','risk_level_after','warning')}
    if intent == 'bills':
        start_year, start_month = map(int, month.split('-'))
        from app.services.finance import month_bounds
        _, month_end = month_bounds(month)
        bills = list_bills(db, user_id)['bills']
        relevant = [bill for bill in bills if bill.due_date < month_end]
        context['bills'] = {'pending_total_paisa': sum(b.amount_paisa for b in relevant if b.status == 'pending'),
                            'pending_count': sum(b.status == 'pending' for b in relevant),
                            'paid_count': sum(b.status == 'paid' for b in relevant)}
    return context
