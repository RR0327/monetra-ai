"""Phase 3 Steps 12-13: deterministic math and HTTP integration."""
from datetime import date
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.core.database import Base, get_db
from app.models import Transaction, Bill, Setting
from app.services.prediction import classify_risk, forecast_month_end, forecast_for_month


def test_exact_run_rate_rounding_and_zero():
    assert forecast_month_end(1200000, 20, 30) == 1800000
    assert forecast_month_end(1, 2, 3) == 2
    assert forecast_month_end(100, 0, 31) == 0


def test_risk_boundaries_and_no_division_by_zero():
    assert classify_risk(8000,10000) == 'low'
    assert classify_risk(8001,10000) == 'medium'
    assert classify_risk(10000,10000) == 'medium'
    assert classify_risk(10001,10000) == 'high'
    assert classify_risk(1,0) == 'high'
    assert classify_risk(0,0) == 'unknown'


def test_forecast_cutoff_future_past_and_bills():
    engine = create_engine('sqlite://', connect_args={'check_same_thread':False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    with Session() as db:
        db.add(Setting(opening_balance_paisa=100000, currency='BDT'))
        db.add_all([
            Transaction(date=date(2026,10,1),description='Salary',type='income',category='Income',amount_paisa=200000,fingerprint='aa'),
            Transaction(date=date(2026,10,2),description='Food',type='expense',category='Food',amount_paisa=40000,fingerprint='bb'),
            Transaction(date=date(2026,10,29),description='Future expense',type='expense',category='Food',amount_paisa=1000000,fingerprint='cc'),
            Bill(title='Pending',due_date=date(2026,10,21),amount_paisa=10000,status='pending'),
            Bill(title='Paid',due_date=date(2026,10,10),amount_paisa=9900,status='paid')])
        db.commit()
        early = forecast_for_month(db,'2026-10',date(2026,10,3))
        assert early['recorded_expenses_paisa'] == 40000
        assert early['projected_month_end_expenses_paisa'] == 413333
        assert early['available_funds_paisa'] == 300000
        assert early['projected_obligations_paisa'] == 423333
        assert early['risk_level'] == 'high'
        assert early['confidence'] == 'low'
        future = forecast_for_month(db,'2026-11',date(2026,10,3))
        assert future['status'] == 'not_available'
        assert future['projected_month_end_expenses_paisa'] is None
        historical = forecast_for_month(db,'2026-10',date(2026,11,5))
        assert historical['status'] == 'actual'
        assert historical['recorded_expenses_paisa'] == 1040000
        def override():
            with Session() as db:
                yield db
        app.dependency_overrides[get_db] = override
        try:
            with TestClient(app) as client:
                r = client.get('/api/v1/forecast?month=2026-10')
                assert r.status_code == 200
                assert r.json()['currency'] == 'BDT'
                assert client.get('/api/v1/forecast?month=2026-13').status_code == 422
        finally:
            app.dependency_overrides.clear()
    engine.dispose()
