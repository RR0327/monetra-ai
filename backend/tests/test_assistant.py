"""Grounding, response safety, API validation, and read-only regression tests."""
from types import SimpleNamespace
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.core.database import Base, get_db
from app.core.gemini_config import GeminiSettings
from app.models import Transaction, Bill, Setting
from app.services.assistant import classify_intent, extract_purchase_amount
from app.services.gemini_assistant import generate_explanation

@pytest.fixture
def client():
    engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    sessions = sessionmaker(bind=engine)
    def override():
        with sessions() as db:
            yield db
    app.dependency_overrides[get_db] = override
    with sessions() as db:
        db.add(Setting(currency='BDT', opening_balance_paisa=2_000_000))
        db.commit()
    with TestClient(app) as c:
        yield c, sessions
    app.dependency_overrides.clear()
    engine.dispose()

def test_intents_and_explicit_amounts():
    assert classify_intent('What is my forecast risk?') == 'forecast'
    assert classify_intent('How are my budgets?') == 'budget'
    assert classify_intent('Can I buy a phone for 1200 BDT?') == 'purchase'
    assert extract_purchase_amount('Can I buy a phone for 1,200.50 BDT?') == 120050
    assert extract_purchase_amount('Phone 1200 model') is None
    assert extract_purchase_amount('Can I spend 100 BDT or 200 BDT?') is None

def test_chat_malformed_input(client):
    c, _ = client
    for body in [{'month':'2026-10','question':' '},
                 {'month':'2026-13','question':'Show my balance'},
                 {'month':'2026-10','question':'Buy a phone','purchase_amount_paisa':-1},
                 {'month':'2026-10','question':'a'*501}]:
        assert c.post('/api/v1/assistant/chat', json=body).status_code == 422

def test_assistant_no_key_returns_calculations(client):
    c, _ = client
    with patch('app.api.v1.assistant.get_gemini_settings', return_value=GeminiSettings('', 'model')):
        res = c.post('/api/v1/assistant/chat', json={'month':'2026-10','question':'Show my balance'})
    assert res.status_code == 200
    data = res.json()
    assert data['status'] == 'not_configured'
    assert data['source'] == 'deterministic'
    assert data['trusted_fields']['summary']['balance_paisa'] == 2_000_000
    assert data['currency'] == 'BDT'

def test_purchase_is_read_only_and_amount_is_exact(client):
    c, sessions = client
    with sessions() as db:
        before = (db.scalar(select(func.count()).select_from(Transaction)),
                  db.scalar(select(func.count()).select_from(Bill)))
    with patch('app.api.v1.assistant.get_gemini_settings', return_value=GeminiSettings('', 'model')):
        res = c.post('/api/v1/assistant/chat', json={'month':'2026-10','question':'Can I buy a phone for 1200 BDT?'})
        res2 = c.post('/api/v1/assistant/chat', json={'month':'2026-10','question':'Can I afford something?'})
    data = res.json()
    assert data['trusted_fields']['simulation']['purchase_amount_paisa'] == 120000
    assert data['trusted_fields']['simulation']['balance_after_purchase_paisa'] == 1_880_000
    assert res2.json()['status'] == 'needs_amount'
    with sessions() as db:
        after = (db.scalar(select(func.count()).select_from(Transaction)),
                 db.scalar(select(func.count()).select_from(Bill)))
    assert after == before

def test_assistant_budget_forecast_bills_and_unknown(client):
    c, _ = client
    with patch('app.api.v1.assistant.get_gemini_settings', return_value=GeminiSettings('', '')):
        for question, key in [('Budget review','budgets'), ('Forecast risk','forecast'),
                              ('Upcoming bills','bills'), ('hello there','category_expenses_paisa')]:
            result = c.post('/api/v1/assistant/chat',json={'month':'2026-10','question':question})
            assert result.status_code == 200
            assert key in result.json()['trusted_fields']

def test_gemini_safe_reply_and_unsafe_number_rejected():
    class FakeClient:
        def __init__(self, content):
            self.models = self
            self.content = content
        def generate_content(self, **kwargs):
            assert 'verified_financial_context' in kwargs['contents']
            return SimpleNamespace(text=self.content)
        def close(self): pass
    settings = GeminiSettings('fake', 'fake-model')
    context = {'summary': {'balance_paisa': 123456}}
    status, text = generate_explanation(settings, 'Explain my balance', context,
                                         client_factory=lambda _: FakeClient('Your spending deserves attention.'))
    assert status == 'connected'
    assert 'attention' in text
    for unsafe in ['Your balance is 999999 BDT', 'You have one million taka.', 'I transferred money.',
                   'Your investment is guaranteed.']:
        status, _ = generate_explanation(settings, 'Explain', context,client_factory=lambda _, s=unsafe: FakeClient(s))
        assert status == 'unsafe_response'

def test_gemini_provider_error_is_controlled():
    class ResourceExhausted(Exception): pass
    class ErrorClient:
        models = None
        def __init__(self): self.models = self
        def generate_content(self, **kwargs): raise ResourceExhausted('SECRET_KEY_LEAK')
    status, response = generate_explanation(GeminiSettings('test', 'model'), 'Explain', {},
                                         client_factory=lambda _: ErrorClient())
    assert status == 'quota_exceeded'
    assert 'SECRET_KEY_LEAK' not in response
