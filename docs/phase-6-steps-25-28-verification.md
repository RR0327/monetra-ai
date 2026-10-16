# Phase 6 — Steps 25–28 Verification (local sign-off)

**Release package:** Phase 6 · **Backend API version:** 0.7.0 (no API change) · **Owner:** Tech_Innovators

## Installation

Keep your original `.git` directory, private `backend/.env`, and `backend/monetra.db`. Extract the complete repository ZIP into a *separate temporary folder first*, compare files, then copy source changes into your existing repository. Do not overwrite your local secrets/database. A safe fresh environment creates them separately.

**Terminal 1 — from repository root (PowerShell)**

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m pytest -v
python -m uvicorn app.main:app --reload
```

If `.venv` does not exist yet: `python -m venv .venv` before activating it.

**Terminal 2 — from repository root**

```powershell
cd frontend
npm ci
node --test tests/architecture.test.mjs
npm run build
npm run dev
```

Open `http://127.0.0.1:8000/docs` and `http://localhost:5173`.

## Sixteen-point interactive verification companion

- [ ] 1. All 40 Python tests pass.
- [ ] 2. All 4 frontend architecture tests pass.
- [ ] 3. `npm ci` and `npm run build` pass locally.
- [ ] 4. Five React pages load and mobile navigation works.
- [ ] 5. CSV import and duplicate reupload behave correctly.
- [ ] 6. Transaction category correction persists; totals match SQLite.
- [ ] 7. Budget limits and zero-budget behavior are correct.
- [ ] 8. Forecast, risk, assumptions and low-confidence caveats display.
- [ ] 9. Purchase simulation does not mutate recorded transactions or bills.
- [ ] 10. Bills can be created, listed and marked paid without double-counting.
- [ ] 11. Grounded Gemini chatbot returns trusted Python fields with genuine explanation.
- [ ] 12. Gemini outage/quota failure shows controlled fallback and calculator still works.
- [ ] 13. Three synthetic user scenarios pass the manual UI journey.
- [ ] 14. README, architecture, API contract and demo script match application.
- [ ] 15. No secrets or database in ZIP; Tech_Innovators, MIT and `/monetra-ai/` remain.
- [ ] 16. Slides, backup recording, team responsibilities and **official** submission requirements are confirmed.

## Automated synthetic scenarios

`backend/tests/test_end_to_end.py` validates three independent TestClient journeys with isolated in-memory SQLite and no live Gemini call:

1. Healthy budget: salary + grocery import; duplicate detection; budget matching; deterministic finance context on assistant fallback.
2. Tight cash flow: negative impact of purchase, pending bill reserves, forecast and risk; repeat simulation confirms no write.
3. Outage and settlement: income, pending bill, assistant not-configured state with verified balance; paid bill removes reserve.

These verify backend HTTP pathways; they **do not** replace manual browser end-to-end checks or a live Gemini connectivity check.

## Manual acceptance route

1. With synthetic October 2026 CSV, upload and re-upload it; confirm counts and duplicates.
2. Correct an expense category, set a category budget and inspect the dashboard.
3. Inspect forecast cutoff date and confidence; create pending bill and check spendable impact.
4. Run a purchase simulation; refresh Transactions to confirm nothing new was inserted.
5. Ask Assistant a specific financial question; compare trusted fields to dashboard; temporarily remove Gemini key locally and confirm fallback.
6. Mark the pending bill paid; verify its reservation disappears without a new transaction.
7. Test all five pages at desktop and narrow mobile width; verify loading/errors, build and navigation.

## Expected release behavior

The API application continues to report **version 0.7.0**: Phase 6 adds documentation, CI coverage and non-production demo tests, not a new backend interface. Do not confuse package milestone with API version.

## Remaining release blockers

Before submitting, confirm local `npm run build`, genuine hosted Gemini success/failure and the organizer’s current submission specifications. A unit-test pass is not a substitute for these checks.
