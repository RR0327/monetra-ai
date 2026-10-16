# Phase 3 Steps 10–11 — Verification

Copyright © 2026 Tech_Innovators.

## Before updating

1. Copy the downloaded ZIP contents into your existing `monetra-ai/` repo.
2. Preserve your existing `.git/`, `backend/monetra.db` and local `.env` files.
3. This ZIP intentionally excludes all local DB and secret files.

## Backend

Run from `backend/` with the Python virtual environment active:

```powershell
python -m pip install -r requirements.txt
python -m pytest -v
python -m uvicorn app.main:app --reload
```

Expected suite at packaging: **15 passing tests**. Open `http://127.0.0.1:8000/docs` and check `/api/v1/summary` and `/api/v1/budgets`.

## Frontend

From `frontend/`:

```powershell
npm install
npm run build
npm run dev
```

Open `http://localhost:5173`, select **2026-10**, and verify that summary values are loaded from FastAPI. If your database is empty, upload `sample_data/transactions.csv` from the UI. Re-uploading must not add duplicates.

## Manual acceptance checks

- [ ] Backend starts and health reports version 0.3.0
- [ ] Existing CSV import still works with validation
- [ ] Duplicate CSV import adds no new rows
- [ ] October monthly income, expense and category totals appear
- [ ] Changing a transaction category updates its category subtotal
- [ ] Switching August/September/October changes the selected month summary
- [ ] Balance carries earlier transactions into later months
- [ ] No-transactions month shows zero monthly income/expense without errors
- [ ] Setting Food budget for October saves and persists after refresh
- [ ] Editing the same Food budget updates it rather than creating a duplicate
- [ ] Spending above the budget shows `over budget`
- [ ] Budget limit 0 displays `no budget` without division by zero
- [ ] Invalid month, negative limit, or Income category is rejected
- [ ] All 15 backend tests pass
- [ ] Frontend `npm run build` passes on your machine
- [ ] `README.md`, `LICENSE` and `.gitignore` retain Tech_Innovators conventions

## Limitations

The current UI does not edit the configured opening balance or create/pay bills; these workflows are later roadmap items. Pending bill reserves use current bill statuses and do not recreate past status history. Summary values are based on database records, not solely the 500 latest displayed transactions.
