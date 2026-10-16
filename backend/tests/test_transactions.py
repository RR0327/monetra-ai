from datetime import date
import io
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.core.database import Base, get_db
from app.main import app
from app.models import Transaction
from app.services.categories import categorize
from app.services.transactions import to_paisa

@pytest.fixture
def client():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    session = sessionmaker(bind=engine)
    def override():
        with session() as db:
            yield db
    app.dependency_overrides[get_db] = override
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()
    engine.dispose()

CSV = b"date,description,type,amount,category\n2026-10-01,Salary,income,30000,\n2026-10-02,KFC lunch,expense,550.25,\n"
def upload(client, csv_bytes=CSV):
    return client.post("/api/v1/transactions/import", files={"file": ("demo.csv", io.BytesIO(csv_bytes), "text/csv")})

def test_categories_and_precision():
    assert categorize("Uber ride") == "Transport"
    assert categorize("Unknown description") == "Other"
    assert categorize("Work", "income") == "Income"
    assert to_paisa("0.01") == 1
    assert to_paisa("550.25") == 55025
    for invalid in ["0", "-1", "1.234", "NaN", "Infinity", "oops"]:
        with pytest.raises(ValueError): to_paisa(invalid)

def test_upload_repeat_and_list(client):
    assert upload(client).json()["imported"] == 2
    repeat = upload(client).json()
    assert repeat["imported"] == 0 and repeat["duplicates"] == 2
    items = client.get("/api/v1/transactions").json()
    assert len(items) == 2
    assert any(r["amount_paisa"] == 55025 and r["category"] == "Food" for r in items)
    assert len(client.get("/api/v1/transactions?month=2026-09").json()) == 0

def test_invalid_row_and_duplicate_within_file(client):
    csv_data = b"date,description,type,amount\n2026-10-01,Tea,expense,10\n2026-10-01,Tea,expense,10\n2026-10-02,Bad,expense,0\n"
    response = upload(client, csv_data)
    assert response.status_code == 200
    assert response.json()["imported"] == 1
    assert response.json()["duplicates"] == 1
    assert response.json()["invalid_rows"] == 1

def test_reject_malformed_header_and_extension(client):
    assert upload(client, b"date,description\n2026-10-01,Tea\n").status_code == 400
    assert client.post("/api/v1/transactions/import", files={"file": ("bad.txt", b"ok", "text/plain")}).status_code == 400
    assert upload(client, b"date,description,type,amount\n2026-10-01,Tea,expense,2,unexpected\n").json()["invalid_rows"] == 1

def test_category_correction_survives_reupload(client):
    upload(client)
    item = client.get("/api/v1/transactions").json()[0]
    r = client.patch(f"/api/v1/transactions/{item['id']}", json={"category": "Shopping"})
    assert r.status_code == 200 and r.json()["category"] == "Shopping"
    upload(client)
    corrected = client.get(f"/api/v1/transactions?category=Shopping").json()
    assert len(corrected) == 1
    assert client.patch(f"/api/v1/transactions/{item['id']}", json={"category": "NotARealCategory"}).status_code == 422
    assert client.patch("/api/v1/transactions/999", json={"category": "Food"}).status_code == 404

def test_month_filter_validates(client):
    assert client.get("/api/v1/transactions?month=2026-13").status_code == 422
