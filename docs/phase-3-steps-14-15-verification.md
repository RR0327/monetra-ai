# Phase 3 Steps 14–15 — Verification

Copyright © 2026 Tech_Innovators.

## Upgrade safety

Extract the ZIP and replace matching files in your existing repository. **Do not replace** `.git/`, private `.env` files or `backend/monetra.db`. The ZIP excludes databases and secrets. The existing `bills` table requires no migration for this step.

## Backend — Windows PowerShell

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m pytest -v
python -m uvicorn app.main:app --reload
```

Expected test result: **22 passed**. Check `http://127.0.0.1:8000/docs` and `/api/v1/health` (version `0.5.0`).

## Frontend (new terminal from repository root)

```powershell
cd frontend
npm install
npm run build
npm run dev
```

Visit `http://localhost:5173`. The package's frontend production build was **not** verified by the authoring environment because npm installation timed out. You must run it locally before marking this step complete.

## Manual acceptance checks

1. Backend starts, health reports `0.5.0`, and Swagger lists the four new API operations.
2. All **22** backend tests pass.
3. Frontend compiles with `npm run build` and dashboard loads.
4. Previously imported CSV data, month selection, budget edits, dashboard and forecast still work.
5. Create bill `Internet`, due in selected month, amount `1000` BDT. Check that the pending bill appears.
6. Observe reserved pending bills increase by 100000 paisa, and spendable balance decreases by the same amount.
7. Create a bill due **next** month; it should not be reserved in the current month's snapshot.
8. Mark the first bill paid. Pending reserve decreases; marking paid again from Swagger has no additional effect.
9. Confirm paying a bill does not create a new transaction. Import the corresponding expense separately to record actual spending.
10. Submit a purchase simulation for `2000` BDT. Confirm remaining balances decrease and risk is recalculated where the forecast is available.
11. Run the same simulation twice and check transaction count and bill count remain unchanged.
12. Try negative/zero purchase amounts, blank bill title, malformed bill date and invalid category. Confirm HTTP 422.
13. Select an unstarted future month: risk is unknown and forecast essentials are unavailable.
14. Verify README link opens LICENSE and credits `Tech_Innovators`.
15. Verify `.gitignore` contains the exact user rule `/monetra-ai/` and continues to exclude `.env` and `.db` files.

## Important interpretation

This is a **fictional-data demonstration**, not a payment application. Marking a bill paid is a record-status action only. The 'estimated remaining essentials' is **all remaining projected spending** as a conservative substitute; it is not a trained essentials model. Risk levels are prototype flags, not guarantees.
