# Phase 2 · Steps 07–09 · Verification

Copyright © 2026 Tech_Innovators.

## Run

From `backend/`, activate your virtual environment and run `python -m pip install -r requirements.txt`, then `python -m pytest -v`, then `python -m uvicorn app.main:app --reload`.

From `frontend/`, run `npm install`, `npm run build`, and `npm run dev`.

## Acceptance checklist

1. `/api/v1/health` returns 0.2.0 and `/docs` shows transaction endpoints.
2. React loads, shows connected backend, and renders the transaction screen.
3. Upload `sample_data/transactions.csv` (90 fictional records) and see an import report.
4. Upload the same file again; imported count is zero and duplicates are reported.
5. Refresh the webpage and confirm transaction records are still visible.
6. Filter by `2026-10`; the table changes to that month's records.
7. Correct a category and refresh; the correction persists.
8. Upload again after category correction; the correction remains unchanged.
9. Test a bad CSV amount (`0`, negative, or too many decimal places); that row is flagged.
10. Test a missing required CSV column; the API returns HTTP 400.
11. Stop/start the backend; records persist in SQLite.
12. `python -m pytest -v` and `npm run build` succeed.
13. Verify `.env`, `.db`, `node_modules` are ignored and no real financial data is used.
14. Verify license and docs say `Tech_Innovators` and README links to `LICENSE`.

## Known design limits

Fingerprint uses normalized date, description, type and amount; two genuinely separate identical purchases on the same day will be treated as duplicates. This is acceptable for the fictional MVP but should be replaced with source transaction IDs before any production usage. Partial row validation errors are returned, but valid rows import in one database transaction. There is no real-bank integration or user authentication.
