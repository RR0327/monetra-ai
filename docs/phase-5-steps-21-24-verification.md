# Monetra AI — Phase 5 Steps 21–24 verification

**Baseline:** Phase 4 v0.7.0 passed all 16 user-reported checks. Phase 5 restructures React; the finance, assistant, and Gemini backend services and API contracts remain unchanged.

## Installation (Windows PowerShell)

Back up your existing working project, especially `.git`, `backend/.env`, and `backend/monetra.db`. Extract the supplied project ZIP and copy the **complete** included source files into your repository. Do not overwrite your local private `.env` or database. Never commit those files.

Backend terminal, from repository root:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m pytest -v
python -m uvicorn app.main:app --reload
```

Frontend terminal, from repository root:

```powershell
cd frontend
npm ci
node --test tests/architecture.test.mjs
npm run build
npm run dev
```

If `npm ci` fails because of an old platform-specific optional dependency, delete `frontend/node_modules` and run `npm install`, then retry the production build. Do not delete backend database or `.env`.

Open `http://localhost:5173`. Check `http://127.0.0.1:8000/docs` and `GET /api/v1/health`. The API still reports v0.7.0 because this phase changes frontend architecture, not the backend API version.

## Phase 5 verification checklist — tick only after local confirmation

- [ ] All 37 backend tests pass.
- [ ] Frontend architecture tests pass (`node --test tests/architecture.test.mjs`).
- [ ] Frontend `npm run build` passes locally.
- [ ] React app opens and navigation works without full-page reload.
- [ ] Dashboard shows verified summary metrics, spending categories, budget usage and budget editing.
- [ ] Transactions page imports CSV, reports invalid/duplicate rows and allows category correction.
- [ ] Forecast page displays projected expenses, risk, cutoff, confidence and assumptions.
- [ ] What-if simulator returns results without writing a transaction or bill.
- [ ] Assistant page returns genuine Gemini explanation and separate verified Python fields.
- [ ] Assistant stays usable with Gemini disabled and returns controlled fallback.
- [ ] Bills page creates and lists bills and marks them paid without creating a transaction.
- [ ] Month selection updates all month-specific views consistently.
- [ ] Loading, empty, success and API-error states are understandable.
- [ ] Navigation works on a narrow/mobile viewport; menu toggle and keyboard navigation work.
- [ ] Backend finance, budgets, forecast, bills, simulation, transactions and chat endpoints show no regressions.
- [ ] `Tech_Innovators` copyright, MIT License and custom `/monetra-ai/` ignore rule are intact, and no keys are shipped.

### Full end-to-end scenario

1. Import synthetic `data/sample_transactions.csv` (or the project-provided CSV) on Transactions, verify duplicates don't increase totals.
2. Visit Dashboard and compare balance/income/expenses with FastAPI `/api/v1/summary` for the selected month.
3. Set a budget and confirm utilization, then view Forecast and its assumptions.
4. Run a purchase simulation twice; confirm DB transaction/bill counts do not change.
5. Add a synthetic bill, observe reserved funds, mark it paid, and verify the record remains a bill and no payment transaction was created.
6. Ask the Assistant a summary, budget, and purchase question. Compare trusted fields with deterministic API results.
7. Temporarily remove Gemini configuration locally, restart backend and confirm controlled AI-unavailable status while all finance screens still work; restore the private configuration afterward.

## Known build-environment limitation

The Phase 5 source was syntax-checked using Babel's JSX parser and passed the 37 existing backend tests and the four frontend architecture tests. **A Vite production build could not be completed in the packaging environment** because its dependency installation was incomplete and the available older dependency tree lacked the correct native Rollup module. The user must confirm `npm ci`, `npm run build` and the full UI flow locally. A passing static architecture test is not a substitute for a successful Vite build or browser check.
