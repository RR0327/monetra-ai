# Phase 3 — Steps 12–13: Verification Guide

Copyright © 2026 Tech_Innovators.

## Install and start (Windows PowerShell)

From `backend/`: activate `.venv`, run `python -m pip install -r requirements.txt`, `python -m pytest -v`, then `python -m uvicorn app.main:app --reload`.

From `frontend/`: run `npm install`, `npm run build`, then `npm run dev`.

Open `http://127.0.0.1:8000/docs` and `http://localhost:5173`. Preserve `backend/monetra.db`, `.env`, and `.git` when updating.

## 16 acceptance checks

1. Backend starts and `/api/v1/health` reports version 0.4.0.
2. Swagger lists `GET /api/v1/forecast`.
3. The React finance dashboard loads.
4. Existing CSV upload continues to work.
5. Re-upload does not create duplicate transactions.
6. Monthly summary totals still match previous release.
7. Monthly budgets still create/update.
8. Selected month changes forecast and dashboard.
9. Forecast clearly displays the cutoff and elapsed days.
10. Forecast shows run-rate assumptions.
11. Fewer than seven days displays low confidence.
12. Future month displays forecast not available.
13. Completed month displays actual recorded expenses.
14. Risk is low/medium/high based on obligations vs funds; zero funds are handled.
15. Pending bills count once and paid bills do not count as pending.
16. `python -m pytest -v` and `npm run build` both pass.

## Calculation rules

The forecast counts only expense rows dated on or before the selected cutoff. Run-rate = recorded expenses / elapsed calendar days; month-end estimate = run-rate × total calendar days. Risk compares projected **full-month** expenses plus unpaid bills with opening funds and income received through cutoff, avoiding duplicate recorded expenses. Low: obligations ≤80% of funds. Medium: >80% to 100%. High: >100%. With no available funds, positive obligations means high, otherwise unknown.

### Important limitations

This is an indicative, deterministic statistical projection, not trained machine learning. Forecast assumptions are especially weak early in a month. Historical bill statuses reflect current records, not reconstructed history. A pending bill that is also saved as an expense must be marked paid to prevent double counting. No Gemini is involved in these calculations.
