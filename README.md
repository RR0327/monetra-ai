
# Monetra AI

**An explainable, privacy-conscious personal finance copilot for a synthetic-data hackathon demo.**

**Developed by Tech_Innovators**

[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)



## Overview

Monetra AI is a personal finance copilot designed to help people understand spending, check budgets, forecast possible shortfalls, simulate purchases, and ask grounded financial questions.

Backend Python services calculate monetary values. The hosted Gemini service explains **verified** values rather than determining balances. The project is an educational hackathon prototype that uses fictional demo data.

## Features

- **Transaction import:** Validate CSV files, classify categories, and skip duplicate entries.
- **Financial dashboard:** Income, expenses, available balance, and category budgets.
- **Forecast and risk signals:** Transparent month-end estimates and explainable alerts.
- **Upcoming bills:** Create, list, and mark bills paid; reserve pending obligations without double counting.
- **What-if purchase simulator:** Read-only scenarios that never alter stored transactions.
- **AI explanations:** Gemini-powered finance Q&A grounded in Python-calculated data, with clear outage handling.
- **Invoice-style financial controls:** Deterministic calculations, explicit assumptions, and guarded AI explanations.
- **Human-readable demo:** Synthetic CSV data and documented verification steps.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite 6, Tailwind CSS 3, Recharts |
| Backend API | Python, FastAPI |
| Data | SQLite3, SQLAlchemy, Pandas, NumPy |
| AI | Google Gemini API through the backend only |
| Testing | Pytest, FastAPI TestClient, Node.js tests, GitHub Actions |

## Current Implementation

The repository includes:

- A working `/api/v1/health` API and starter React interface that checks API health.
- Backend tests, a GitHub Actions workflow, and project documentation.
- Transaction CSV import, categorization, duplicate prevention, listing, and category correction.
- Monthly financial summary and category budgets.
- Forecasting, risk scoring, purchase simulations, bill management, and grounded Gemini chat.

The backend API version remains **v0.7.0**. Local browser build, live Gemini access, and official competition requirements still require independent verification.

## Architecture

```text
React + Vite
    |
    | HTTP JSON (/api/v1)
    v
FastAPI (validation + orchestration)
    |-- deterministic services (finance, budgets, forecast, simulator)
    |-- SQLAlchemy -> SQLite (fictional demo data)
    `-- grounded AI service -> Gemini API (backend-side secret)
```

See [Architecture](docs/architecture.md), [API Contract](docs/api-contract.md), and the [Roadmap](docs/roadmap.md).
<!--
## Repository Structure

```text
monetra-ai/
├── .github/               # CI, issue and pull request templates
├── backend/
│   ├── app/
│   │   ├── api/v1/        # Versioned FastAPI routes
│   │   ├── core/           # Configuration and DB wiring
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic contracts
│   │   └── services/       # Deterministic financial logic + AI adapter
│   ├── tests/
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/components/
│   ├── src/pages/
│   ├── src/services/
│   ├── .env.example
│   └── package.json
├── sample_data/            # Fictional CSV only
├── docs/                   # Architecture, API, demo and decisions
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
└── README.md
```
-->
## Getting Started (Windows, macOS, and Linux)

### Prerequisites

- Python **3.11+**
- Node.js **20.19+** (or **22.12+**)
- npm and Git
- Tesseract is not required for Monetra's current transaction demo; follow project-specific setup if OCR-related functionality is added.

### Backend

From the repository root:

```bash
cd backend
python -m venv .venv

# Windows PowerShell:
# .\.venv\Scripts\Activate.ps1

# macOS/Linux:
# source .venv/bin/activate

python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

- API health: `http://127.0.0.1:8000/api/v1/health`
- Swagger UI: `http://127.0.0.1:8000/docs`

### Frontend

Open a new terminal from the repository root:

```bash
cd frontend

# macOS/Linux:
cp .env.example .env

# Windows PowerShell:
# Copy-Item .env.example .env

npm install
npm run dev
```

Open `http://localhost:5173`. The starter screen reports the API connection state.

## Testing and Verification

### Backend

Run from `backend/` with the virtual environment activated:

```bash
python manage.py check
```

Monetra uses FastAPI rather than Django. Use the project's actual test commands:
<!--
```bash
python -m pytest -v
```

### Frontend

Run from `frontend/`:

```bash
npm install
npm run build
node --test tests/architecture.test.mjs
```

### Phase 6 release checks
-->
From `backend/`:

```bash
python -m pytest -v
```

Expected: **40 tests**, including three synthetic API journeys.

From `frontend/`:

```bash
node --test tests/architecture.test.mjs
npm ci
npm run build
```

Expected: **4 frontend architecture checks**. An end-to-end local browser check remains required. Backend tests use isolated fictional data and mocked Gemini settings; they do not prove live Gemini connectivity.

## Configuration and Safety

- Configure non-secret Vite variables in `frontend/.env`.
- For Gemini setup, copy `backend/.env.example` to a local, Git-ignored `backend/.env`.
- Set `GEMINI_API_KEY` and a provider-verified `GEMINI_MODEL` **only on the backend**.
- Never commit `.env` files, API keys, user financial data, or real bank/card information.
- All demo CSVs and transactions must be **fictional**.
- No real bank connections, real transaction uploads, bank credentials, or live transfers are supported.
- This is an educational prototype, **not financial or investment advice**.
- Python is authoritative for monetary fields. Gemini is explanatory and is not a guarantee against generated inaccuracies.
<!--
## CSV Transaction Demo (Phase 2 Steps 07–09)

Use the **Upload CSV** control in the frontend and select `sample_data/transactions.csv` (90 fictional rows), or use Swagger UI at `/docs` → `POST /api/v1/transactions/import`.

- Required CSV columns: `date,description,type,amount`; optional column: `category`.
- Dates use `YYYY-MM-DD`; amounts use BDT with no more than 2 decimal places.
- Valid transaction types: `income` and `expense`.
- Duplicate transactions are skipped using a stable fingerprint.
- Results include `imported`, `duplicates`, `invalid_rows`, and up to 30 row error explanations.
- Reimporting the same CSV should report zero newly imported rows. Category edits persist across reuploads.
- `GET /api/v1/transactions` shows up to 500 latest rows. Filter with `?month=2026-10` or `?category=Food`.

## Monthly Financial Dashboard and Budgets (Phase 3 Steps 12–13)

- `GET /api/v1/summary?month=2026-10` returns monthly income, expenses, category expense subtotals, carried-in balance, balance through the month, and spendable balance after reserving pending bills.
- `GET /api/v1/budgets?month=2026-10` lists configured budgets with actual spending, remaining funds, utilization percentage, and status.
- `PUT /api/v1/budgets` creates or updates a month/category budget. Example request:

  ```json
  {
    "month": "2026-10",
    "category": "Food",
    "limit_paisa": 500000
  }
  ```

  `limit_paisa: 500000` represents BDT 5,000. A limit of `0` reports `no_budget` and no utilization percentage.
- Every authoritative amount is calculated by Python/SQLAlchemy using integer paisa, not estimated or recalculated in the frontend.
- The selected month's opening balance is the configured opening balance plus **recorded** net transactions before the month. Transactions dated after the selected month are excluded.
- Pending bills due by the selected month's end are reserved based on their current stored status. Historical bill-status snapshots are not available yet; full bill creation/payment and reconciliation arrive in Step 15.
- No settings editor is included yet. The default configured opening balance is zero unless a `settings` row is added separately.

## Forecast and Risk (Phase 3 Steps 12–13)

`GET /api/v1/forecast?month=YYYY-MM` returns a Python-calculated calendar-day spending projection, actual expenses through the cutoff, available funds, unpaid bill reserve, risk classification, confidence, and assumptions.

- Future months return `not_available`.
- Completed months show actual spending.
- Fewer than seven elapsed days is labelled low confidence.
- The model does not learn from data and does not guarantee future expenses.

See [Phase 3 Steps 12–13 verification instructions](docs/phase-3-steps-12-13-verification.md).

## Bills and Purchase Simulation (Phase 3 Steps 14–15)

See [Phase 3 Steps 14–15 verification instructions](docs/phase-3-steps-14-15-verification.md).

Bill settlement changes a bill's status **only**; it does not create a bank payment or transaction. If a bill is paid, import the matching actual expense separately once. The simulator is read-only. Estimated future essential expenses are approximated by the forecast's **total** remaining spending, not a category-trained essentials model.

Endpoints:

- `POST /api/v1/simulations/purchase`
- `POST /api/v1/bills`
- `GET /api/v1/bills`
- `PATCH /api/v1/bills/{bill_id}/paid`

## Gemini API Setup and Connectivity (Phase 4 Steps 16–17)

Google Gemini is **not yet wired to finance questions** in this connectivity step. This phase adds a secure standalone connectivity check and mocked tests.

To verify hosted access:

1. Copy `backend/.env.example` to a local, Git-ignored `backend/.env`.
2. Set `GEMINI_API_KEY` and a provider-verified `GEMINI_MODEL`.
3. From `backend/`, run:

   ```bash
   python -m scripts.check_gemini
   ```

The script sends only a fixed, non-financial test prompt; it does not send financial or transaction data.

See the [Phase 4 Steps 16–17 guide](docs/phase-4-steps-16-17-verification.md) for setup, error handling, and verification. Free-tier eligibility, available models, and usage policies depend on the provider and must be verified. The financial dashboard works without Gemini.

## Financial Assistant (Phase 4 Steps 18–20)

`POST /api/v1/assistant/chat` receives `month` and `question`, plus optional explicit `purchase_amount_paisa`.

The server categorizes intent, calls existing read-only deterministic finance services, sends minimal synthetic context to Gemini, and returns:

- `answer`
- `status`
- `source`
- `trusted_fields`
- `limitations`

The chat intentionally displays monetary values only from trusted Python-generated fields. Gemini-generated prose containing numerical figures or suspicious money-movement or guarantee claims is rejected. This restrictive check can also reject benign AI explanations. If an amount for a proposed purchase cannot be safely identified, the server requests an explicit BDT amount instead of guessing.

### Verification

Start backend and frontend as described in Quick Start. Run `python -m pytest -v` in `backend/`, then `npm install` and `npm run build` in `frontend/`. Verify hosted Gemini integration using your **own private backend/.env**.

See [Phase 4 Steps 18–20 verification](docs/phase-4-steps-18-20-verification.md).

### Limitations

- Keyword intent routing is heuristic.
- The number guard is intentionally strict, not a formal mathematical proof of all natural-language claims. Generated prose must not be treated as authoritative.
- No real bank connections or real transaction uploads are supported.
- Gemini usage depends on provider access, quota, and network availability.

## Multi-page React Architecture (Phase 5 Steps 21–24)

React provides distinct, routed **Dashboard**, **Transactions**, **Forecast & Simulator**, **AI Assistant**, and **Bills** screens, a persistent global month filter, responsive/mobile navigation, accessible loading/error notices, and preserved finance operations.

- `react-router-dom` is used for routing.
- Network requests remain centralized in `frontend/src/services/api.js`.
- Python alone calculates trusted monetary totals.
- No new backend endpoints or database migration are required.
- `/api/v1/health` continues to report backend version **0.7.0**.

See the [Phase 5 verification guide](docs/phase-5-steps-21-24-verification.md) and [full replacement-file list](docs/phase-5-full-replacement-files.md).

Run `node --test tests/architecture.test.mjs`, `npm ci`, and `npm run build` from `frontend/`, plus `python -m pytest -v` from `backend/`. An end-to-end local browser check remains required.

## Phase 6: Release Preparation and Competition Handoff

- [Architecture and trust boundaries](docs/architecture.md)
- [Three-minute demo script](docs/demo-script.md)
- [Submission checklist (official requirements pending independent verification)](docs/submission-checklist.md)
- [Phase 6 verification: 16 checks](docs/phase-6-steps-25-28-verification.md)
- [Full replacement-file manifest](docs/phase-6-full-replacement-files.md)

The current release-preparation checkpoint reports 40 backend tests and four frontend architecture checks. Verify the browser build, live Gemini access, and official submission requirements locally before release.

## Development Roadmap

| Phase | Goal | Status |
| --- | --- | --- |
| 1 | Foundation and local servers | Starter available; local verification required |
| 2 | SQLite, synthetic dataset, CSV validation/import | Steps 06–09 implemented; local verification required |
| 3 | Deterministic financial engine | Steps 10–11 implemented; steps 12–15 planned |
| 4 | Hosted Gemini integration | Planned |
| 5 | Complete UI and API integration | Planned |
| 6 | Tests, demo, documentation, submission | Planned |

Read the [roadmap](docs/roadmap.md) for the planned sequence.

> **Status note:** The supplied README contains both phase-roadmap entries marked “planned” and later phase-specific implementation/verification notes. Those original status statements have been retained rather than silently reconciled. Confirm the roadmap table against the repository before publishing.

## Competition Demo and Submission

- Competition: **2026 Shenzhen International FinTech Competition — Topic A: Personal Finance Assistant**
- Demo data: `sample_data/transactions.csv` (90 fictional rows)
- Demo script: [Three-minute demo script](docs/demo-script.md)
- Submission requirements: [Submission checklist](docs/submission-checklist.md) — official requirements pending independent verification.
-->
## Contributing

We welcome focused issues and pull requests. Please read [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and [SECURITY.md](SECURITY.md) before participating.

Contributions should preserve synthetic-data safeguards and must not expose private financial data or secrets.

## Security

Please report vulnerabilities privately. Review [SECURITY.md](SECURITY.md) and the deployment limitations before using the project beyond its educational demo scope.

## License

This project is licensed under the **[MIT License](LICENSE)**. See the separate license file for the full text.

Copyright © 2026 **Tech_Innovators**.
