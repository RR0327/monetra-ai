"""Bill lifecycle, validation, no-write guarantee and integration regression."""
from datetime import date
import io
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select, func
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.core.database import Base, get_db
from app.models import Transaction, Bill, Setting

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

def test_bill_lifecycle_reserves_once_and_paid_idempotent(client):
    c, _ = client
    bill = c.post('/api/v1/bills', json={'title':'Internet','due_date':'2026-10-15','amount_paisa':100000})
    assert bill.status_code == 201
    bid = bill.json()['id']
    assert c.get('/api/v1/summary?month=2026-10').json()['unpaid_bills_paisa'] == 100000
    assert c.get('/api/v1/bills?status=pending').json()['pending_total_paisa'] == 100000
    assert c.patch(f'/api/v1/bills/{bid}/paid').json()['status'] == 'paid'
    assert c.patch(f'/api/v1/bills/{bid}/paid').status_code == 200
    assert c.get('/api/v1/summary?month=2026-10').json()['unpaid_bills_paisa'] == 0
    assert c.get('/api/v1/bills?status=paid').json()['bills'][0]['id'] == bid
    assert c.patch('/api/v1/bills/999/paid').status_code == 404

def test_bill_rejections(client):
    c, _ = client
    for data in [
        {'title':'','due_date':'2026-10-15','amount_paisa':10},
        {'title':'Rent','due_date':'bad','amount_paisa':10},
        {'title':'Rent','due_date':'2026-10-15','amount_paisa':0},
        {'title':'Rent','due_date':'2026-10-15','amount_paisa':-20},
    ]:
        assert c.post('/api/v1/bills', json=data).status_code == 422
    assert c.get('/api/v1/bills?status=overdue').status_code == 422

def test_simulation_read_only_and_bills_not_double_counted(client):
    c, sessions = client
    with sessions() as db:
        db.add(Setting(currency='BDT',opening_balance_paisa=1000000))
        db.commit()
    uploaded = c.post('/api/v1/transactions/import', files={'file':('sample.csv',io.BytesIO(b'date,description,type,amount,category\n2026-10-01,Groceries,expense,500,Food\n'),'text/csv')})
    assert uploaded.json()['imported'] == 1
    bill = c.post('/api/v1/bills',json={'title':'Rent','due_date':'2026-10-28','amount_paisa':100000})
    assert bill.status_code == 201
    with sessions() as db:
        before_transactions = db.scalar(select(func.count()).select_from(Transaction))
        before_bills = [(b.id,b.status,b.amount_paisa) for b in db.scalars(select(Bill))]
    payload = {'month':'2026-10','category':'Shopping','purchase_amount_paisa':200000}
    first = c.post('/api/v1/simulations/purchase',json=payload)
    assert first.status_code == 200
    result = first.json()
    assert result['current_balance_paisa'] == 950000
    assert result['balance_after_purchase_paisa'] == 750000
    assert result['spendable_after_bills_paisa'] == 650000
    assert result['pending_bills_paisa'] == 100000
    assert result['risk_level_after'] in ['low','medium','high','unknown']
    assert c.post('/api/v1/simulations/purchase',json=payload).json() == result
    with sessions() as db:
        assert db.scalar(select(func.count()).select_from(Transaction)) == before_transactions
        assert [(b.id,b.status,b.amount_paisa) for b in db.scalars(select(Bill))] == before_bills

def test_simulation_invalid_and_future_month(client):
    c, _ = client
    base = {'month':'2026-10','category':'Shopping','purchase_amount_paisa':100}
    for change in [{'purchase_amount_paisa':0},{'purchase_amount_paisa':-1},{'category':'Income'},{'month':'2026-13'}]:
        assert c.post('/api/v1/simulations/purchase',json={**base,**change}).status_code == 422
    future = c.post('/api/v1/simulations/purchase',json={**base,'month':'2099-01'}).json()
    assert future['risk_level_after'] == 'unknown'
    assert future['spendable_after_essentials_paisa'] is None
