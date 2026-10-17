"""CSV import with strict validation, money precision and stable deduplication."""
import csv
from datetime import date
from decimal import Decimal, InvalidOperation
import hashlib
import io
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.models import Transaction
from app.services.categories import categorize

MAX_UPLOAD_BYTES = 2 * 1024 * 1024
MAX_ROWS = 10_000
REQUIRED = {"date", "description", "type", "amount"}
ALLOWED_CATEGORIES = {"Income", "Food", "Transport", "Shopping", "Utilities", "Rent", "Health", "Education", "Other"}

def to_paisa(value: str) -> int:
    try:
        amount = Decimal(value.strip())
    except (InvalidOperation, AttributeError):
        raise ValueError("amount must be a valid number") from None
    if not amount.is_finite() or amount <= 0 or amount.as_tuple().exponent < -2:
        raise ValueError("amount must be positive with at most two decimal places")
    paisa = int(amount * 100)
    if paisa > 9_000_000_000_000_000:
        raise ValueError("amount is too large")
    return paisa

def fingerprint(day: date, description: str, kind: str, paisa: int) -> str:
    # Category is intentionally excluded: a user correction must not affect deduplication.
    canonical = f"{day.isoformat()}|{description.casefold().strip()}|{kind}|{paisa}"
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

def import_csv(db: Session, content: bytes, user_id: int) -> dict:
    if not content or len(content) > MAX_UPLOAD_BYTES:
        raise ValueError("CSV must not be empty or exceed 2 MB")
    try:
        text = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        raise ValueError("CSV must be UTF-8 encoded") from None
    try:
        reader = csv.DictReader(io.StringIO(text, newline=""), strict=True)
        if reader.fieldnames is None:
            raise ValueError("CSV header is missing")
        names = [name.strip().lower() for name in reader.fieldnames]
        if len(names) != len(set(names)) or not REQUIRED.issubset(names):
            raise ValueError("CSV requires unique date, description, type, amount columns")
        if any(name not in REQUIRED | {"category"} for name in names):
            raise ValueError("CSV contains unexpected columns")
        reader.fieldnames = names
        candidates = []
        invalid = []
        seen = set()
        duplicates = 0
        for row_number, row in enumerate(reader, start=2):
            if row_number > MAX_ROWS + 1:
                raise ValueError("CSV exceeds 10,000 data rows")
            try:
                if None in row or any(value is None for value in row.values()):
                    raise ValueError("row has missing or extra columns")
                day = date.fromisoformat(row["date"].strip())
                description = row["description"].strip()
                if not description or len(description) > 300:
                    raise ValueError("description must be 1–300 characters")
                kind = row["type"].strip().lower()
                if kind not in {"income", "expense"}:
                    raise ValueError("type must be income or expense")
                paisa = to_paisa(row["amount"])
                supplied = row.get("category", "").strip()
                if supplied and supplied not in ALLOWED_CATEGORIES:
                    raise ValueError("category is not supported")
                category = supplied or categorize(description, kind)
                # Keep deduplication private to the account, even on legacy
                # SQLite databases that still have a global fingerprint index.
                identifier = hashlib.sha256(f"{user_id}|{fingerprint(day, description, kind, paisa)}".encode()).hexdigest()
                if identifier in seen:
                    duplicates += 1
                    continue
                seen.add(identifier)
                candidates.append(Transaction(user_id=user_id, date=day, description=description, type=kind,
                                              category=category, amount_paisa=paisa, fingerprint=identifier))
            except (ValueError, TypeError) as exc:
                invalid.append({"row": row_number, "reason": str(exc)})
    except csv.Error as exc:
        raise ValueError(f"Malformed CSV: {exc}") from None

    existing = set()
    if candidates:
        identifiers = [item.fingerprint for item in candidates]
        existing = set(db.scalars(select(Transaction.fingerprint).where(
            Transaction.user_id == user_id, Transaction.fingerprint.in_(identifiers))).all())
    new_items = [item for item in candidates if item.fingerprint not in existing]
    duplicates += len(candidates) - len(new_items)
    try:
        db.add_all(new_items)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ValueError("Import conflict: please retry; no rows were imported") from None
    return {"imported": len(new_items), "duplicates": duplicates,
            "invalid_rows": len(invalid), "errors": invalid[:30]}
