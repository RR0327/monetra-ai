# Phase 4 — Steps 18–20: Verification Guide

Copyright © 2026 Tech_Innovators · MIT License · Monetra AI 0.7.0

## Before applying files

Keep your current `.git/`, `backend/.env`, `backend/monetra.db`, and any other local private settings/data in a secure backup. This release does **not** include those files and does not require a database migration. Extract the supplied ZIP and copy its **complete** source files over your repository, preserving local secrets and SQLite. Do not nest a second `monetra-ai` directory inside the repository. Do not commit `.env`, `.db`, `.venv`, `node_modules`, or `dist`.

## Step A — Backend (Windows PowerShell from repository root)

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m pytest -v
python -m uvicorn app.main:app --reload
```

Expected on this delivery: **37 passed** backend tests (30 previous + 7 new), `/api/v1/health` reports `0.7.0`, and Swagger at `http://127.0.0.1:8000/docs` lists `POST /api/v1/assistant/chat`.

## Step B — Frontend (another PowerShell terminal)

```powershell
cd frontend
npm install
npm run build
npm run dev
```

Open `http://localhost:5173`, choose October 2026 and check the new chatbot section. `VITE_API_URL` is the backend URL only, never Gemini secrets.

## Step C — Live assistant questions

Use **synthetic demo transactions**, verified Gemini configuration in `backend/.env`, and the selected month. Try:

1. `Summarize my spending` — authoritative summary amounts remain in `trusted_fields.summary`.
2. `How are my budgets?` — category budget details appear in `trusted_fields.budgets`.
3. `What is my financial risk?` — show risk/status, forecast confidence and warning.
4. `What bills are pending?` — outstanding monthly bill reserves are grounded in SQLite.
5. `Can I buy a phone for 1200 BDT?` — simulation amount is exactly `120000` paisa; no database changes.
6. `Can I afford a phone?` — `needs_amount` without inventing a purchase price.

Check Gemini `connected` only when a valid qualitative explanation passed the safety filter. As an intentionally strict protection, generated prose containing digits, currency markers or numeric words is rejected with `unsafe_response`; trusted figures still appear.

## Step D — Regression and failure scenarios

- Temporarily **remove** `GEMINI_API_KEY` locally (never print its value); restart backend and verify `not_configured` plus trusted calculations.
- Verify network/provider outage and quota failure yield controlled status with no traceback or secrets in chat.
- Try blank input, invalid month and negative purchase amount in Swagger; each must yield HTTP 422.
- Count SQLite transactions and bills before/after repeating a purchase question; counts and status must remain unchanged.
- Confirm CSV upload, budgets, forecast, bills, and purchase simulator still work.
- Confirm no Gemini key appears in `frontend`, `.git`, screenshots, or browser network response.
- Confirm copyright © 2026 Tech_Innovators, linked MIT `LICENSE`, and custom `.gitignore` entry:

```gitignore
# Not necessary to track these files
/monetra-ai/
```

## Delivery verification checklist

- [ ] 37 backend tests pass on local machine
- [ ] Health API v0.7.0 and Swagger chat route
- [ ] Summary, budget, forecast, bills and purchase responses are grounded
- [ ] Purchase chat is read-only and missing amount is handled
- [ ] Invalid input rejected with 422
- [ ] Gemini genuinely responds using private backend key
- [ ] Unsafe or fabricated numeric AI prose is rejected
- [ ] Gemini outages preserve deterministic trusted financial fields
- [ ] Frontend chatbot renders, accepts presets and normal queries
- [ ] Frontend `npm run build` succeeds on your machine
- [ ] Existing 16 Step 16–17 verification checks still pass
- [ ] Tech_Innovators, MIT and `.gitignore` conventions preserved

**Validation performed for this package:** 37 Python tests passed. A production frontend build was attempted here but could not complete because the uploaded `node_modules` contained native Rollup packages incompatible with this Linux environment. Install fresh dependencies on your own machine before running `npm run build`. Live hosted Gemini chat was not exercised here (no private API key included). Do not mark those checks passed until local verification.
