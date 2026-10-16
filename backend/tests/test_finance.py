"""Phase 3 verification: exact summary, budgets, and isolation."""
import io
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.core.database import Base, get_db
from app.models import Setting, Bill

@pytest.fixture
def client():
    engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    sessions = sessionmaker(bind=engine)
    def override():
        with sessions() as db:
            yield db
    app.dependency_overrides[get_db] = override
    with TestClient(app) as c:
        yield c, sessions
    app.dependency_overrides.clear()
    engine.dispose()

def upload(c, data):
    return c.post('/api/v1/transactions/import', files={'file': ('demo.csv', io.BytesIO(data.encode()), 'text/csv')})

def test_empty_month(client):
    c, _ = client
    r = c.get('/api/v1/summary?month=2026-10')
    assert r.status_code == 200
    assert r.json()['balance_paisa'] == 0
    assert r.json()['category_expenses_paisa'] == {}

def test_exact_totals_carried_balance_and_corrected_categories(client):
    c, sessions = client
    with sessions() as db:
        db.add(Setting(currency='BDT', opening_balance_paisa=12345))
        db.commit()
    data = 'date,description,type,amount,category\n2026-09-20,Salary,income,100.50,Income\n2026-10-01,Salary,income,300.00,Income\n2026-10-02,Meal,expense,50.25,Food\n2026-10-03,Taxi,expense,10.00,Transport\n'
    assert upload(c, data).json()['imported'] == 4
    result = c.get('/api/v1/summary?month=2026-10').json()
    assert result['opening_balance_paisa'] == 22395
    assert result['income_paisa'] == 30000
    assert result['expenses_paisa'] == 6025
    assert result['balance_paisa'] == 46370
    assert result['category_expenses_paisa'] == {'Food': 5025, 'Transport': 1000}
    tx = c.get('/api/v1/transactions?category=Food').json()[0]
    assert c.patch(f"/api/v1/transactions/{tx['id']}", json={'category':'Shopping'}).status_code == 200
    assert c.get('/api/v1/summary?month=2026-10').json()['category_expenses_paisa']['Shopping'] == 5025

def test_budget_upsert_utilization_overbudget_and_zero(client):
    c, _ = client
    upload(c, 'date,description,type,amount,category\n2026-10-02,Meal,expense,75.25,Food\n')
    path = '/api/v1/budgets'
    payload = {'month':'2026-10','category':'Food','limit_paisa':10000}
    a = c.put(path, json=payload).json()
    assert a['spent_paisa'] == 7525 and a['utilization_percent'] == 75.25
    payload['limit_paisa'] = 5000
    b = c.put(path,json=payload).json()
    assert b['id'] == a['id'] and b['status'] == 'over_budget' and b['remaining_paisa'] == -2525
    payload['limit_paisa'] = 0
    z = c.put(path,json=payload).json()
    assert z['status'] == 'no_budget' and z['utilization_percent'] is None
    assert len(c.get(path+'?month=2026-10').json()) == 1
    assert c.get(path+'?month=2026-09').json() == []

def test_pending_bills_reserved_and_validation(client):
    c, sessions = client
    with sessions() as db:
        db.add_all([Bill(title='Rent', due_date=__import__('datetime').date(2026,10,20), amount_paisa=5000, status='pending'),
                    Bill(title='Later', due_date=__import__('datetime').date(2026,11,5), amount_paisa=9000, status='pending'),
                    Bill(title='Paid', due_date=__import__('datetime').date(2026,10,4), amount_paisa=100, status='paid')])
        db.commit()
    s = c.get('/api/v1/summary?month=2026-10').json()
    assert s['unpaid_bills_paisa'] == 5000 and s['spendable_paisa'] == -5000
    assert c.get('/api/v1/summary?month=2026-13').status_code == 422
    assert c.put('/api/v1/budgets',json={'month':'2026-10','category':'Income','limit_paisa':100}).status_code == 422
    assert c.put('/api/v1/budgets',json={'month':'2026-10','category':'Food','limit_paisa':-1}).status_code == 422
