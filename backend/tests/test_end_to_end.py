"""Phase 6: three isolated synthetic HTTP journeys; never calls hosted Gemini."""
import io
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, func, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.core.database import Base, get_db
from app.core.gemini_config import GeminiSettings
from app.models import Bill, Setting, Transaction

MONTH = '2026-10'

@pytest.fixture
def env():
    engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    sessions = sessionmaker(bind=engine)
    def override():
        with sessions() as db:
            yield db
    app.dependency_overrides[get_db] = override
    with sessions() as db:
        db.add(Setting(currency='BDT', opening_balance_paisa=1_000_000))
        db.commit()
    try:
        with TestClient(app) as client, patch('app.api.v1.assistant.get_gemini_settings', return_value=GeminiSettings('', 'test-model')):
            yield client, sessions
    finally:
        app.dependency_overrides.clear()
        engine.dispose()

def import_transactions(client, rows):
    data = 'date,description,type,amount,category\n' + rows
    return client.post('/api/v1/transactions/import', files={'file': ('fictional.csv', io.BytesIO(data.encode()), 'text/csv')})

def test_scenario_healthy_budget_and_grounded_questions(env):
    client, _ = env
    rows = '2026-10-01,Salary,income,30000,Income\n2026-10-02,Groceries,expense,1000,Food\n'
    imported = import_transactions(client, rows)
    assert imported.status_code == 200 and imported.json()['imported'] == 2
    assert import_transactions(client, rows).json()['duplicates'] == 2
    budget = client.put('/api/v1/budgets', json={'month':MONTH,'category':'Food','limit_paisa':200000})
    assert budget.status_code == 200
    assert budget.json()['spent_paisa'] == 100000
    summary = client.get(f'/api/v1/summary?month={MONTH}').json()
    assert summary['income_paisa'] == 3000000
    assert summary['expenses_paisa'] == 100000
    assert summary['balance_paisa'] == 3900000
    ai = client.post('/api/v1/assistant/chat',json={'month':MONTH,'question':'How is my budget?'}).json()
    assert ai['source'] == 'deterministic' and ai['status'] == 'not_configured'
    assert ai['trusted_fields']['budgets'][0]['spent_paisa'] == 100000

def test_scenario_shortfall_simulation_and_pending_bill(env):
    client, sessions = env
    rows = '2026-10-01,Salary,income,2000,Income\n2026-10-05,Rent,expense,9000,Rent\n'
    assert import_transactions(client, rows).json()['imported'] == 2
    bill = client.post('/api/v1/bills',json={'title':'Internet','due_date':'2026-10-20','amount_paisa':150000})
    assert bill.status_code == 201
    before_summary = client.get(f'/api/v1/summary?month={MONTH}').json()
    assert before_summary['balance_paisa'] == 300000
    assert before_summary['spendable_paisa'] == 150000
    projection = client.get(f'/api/v1/forecast?month={MONTH}')
    assert projection.status_code == 200 and 'risk_level' in projection.json()
    with sessions() as db:
        before = (db.scalar(select(func.count()).select_from(Transaction)), db.scalar(select(func.count()).select_from(Bill)))
    simulated = client.post('/api/v1/simulations/purchase',json={'month':MONTH,'category':'Shopping','purchase_amount_paisa':200000})
    assert simulated.status_code == 200
    assert simulated.json()['spendable_after_bills_paisa'] == -50000
    chat = client.post('/api/v1/assistant/chat',json={'month':MONTH,'question':'Can I buy something for 2000 BDT?'}).json()
    assert chat['trusted_fields']['simulation']['purchase_amount_paisa'] == 200000
    with sessions() as db:
        after = (db.scalar(select(func.count()).select_from(Transaction)), db.scalar(select(func.count()).select_from(Bill)))
    assert before == after
    assert client.get(f'/api/v1/summary?month={MONTH}').json() == before_summary

def test_scenario_bill_settlement_and_ai_outage(env):
    client, _ = env
    assert import_transactions(client, '2026-10-01,Salary,income,5000,Income\n').json()['imported'] == 1
    created = client.post('/api/v1/bills', json={'title':'Electricity','due_date':'2026-10-22','amount_paisa':100000}).json()
    assert client.get(f'/api/v1/summary?month={MONTH}').json()['unpaid_bills_paisa'] == 100000
    response = client.post('/api/v1/assistant/chat', json={'month':MONTH, 'question':'What is my balance?'}).json()
    assert response['status'] == 'not_configured'
    assert response['trusted_fields']['summary']['balance_paisa'] == 1500000
    assert client.patch(f"/api/v1/bills/{created['id']}/paid").json()['status'] == 'paid'
    assert client.get(f'/api/v1/summary?month={MONTH}').json()['unpaid_bills_paisa'] == 0
    assert len(client.get('/api/v1/bills?status=paid').json()['bills']) == 1
