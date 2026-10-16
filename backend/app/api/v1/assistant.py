"""Read-only grounded financial chat endpoint."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.gemini_config import get_gemini_settings
from app.schemas.assistant import ChatInput, ChatOutput
from app.services.assistant import classify_intent, extract_purchase_amount, build_financial_context
from app.services.gemini_assistant import generate_explanation

router = APIRouter(tags=['assistant'])

@router.post('/assistant/chat', response_model=ChatOutput)
def assistant_chat(payload: ChatInput, db: Session = Depends(get_db)):
    intent = classify_intent(payload.question)
    amount = payload.purchase_amount_paisa
    if intent == 'purchase' and amount is None:
        amount = extract_purchase_amount(payload.question)
    context = build_financial_context(db, payload.month, intent, amount)
    limitations = [
        'Educational prototype using fictional data; not professional financial advice.',
        'Python calculations are authoritative. Gemini explanations are supplementary.',
        'Forecasts are estimates; recorded financial data may not reflect real bank balances.',
    ]
    if intent == 'purchase' and amount is None:
        status = 'needs_amount'
        answer = 'Please enter a purchase amount in BDT to run a read-only simulation.'
    else:
        try:
            settings = get_gemini_settings()
        except ValueError:
            status, answer = 'not_configured', 'Gemini configuration is invalid. Verified calculations remain available below.'
        else:
            status, answer = generate_explanation(settings, payload.question, context)
    return {'month': payload.month, 'intent': intent, 'status': status,
            'answer': answer, 'trusted_fields': context, 'limitations': limitations,
            'source': 'gemini' if status == 'connected' else 'deterministic'}
