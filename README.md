# Monetra AI

**An explainable, privacy-conscious personal finance copilot for a synthetic-data hackathon demo.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Project status:** Phase 3 Steps 12–13: exact monthly financial summary and category budgets implemented. Features below describe the planned MVP; they are **not all implemented yet**.
>
> **Competition:** 2026 Shenzhen International FinTech Competition — Topic A: Personal Finance Assistant.

## Overview

Monetra AI aims to help a person understand spending, check budgets, forecast possible shortfalls, simulate purchases, and ask grounded financial questions. Backend Python services calculate monetary values; the hosted Gemini service explains **verified** values rather than determining balances.

## Planned MVP features

- **Import transactions:** Validate CSV files, classify categories, and skip duplicate entries.
- **Financial dashboard:** Income, expenses, available balance, and category budgets.
- **Forecast and risk signals:** Transparent month-end estimates and explainable alerts.
- **Upcoming bills:** Reserve pending obligations without double counting.
- **What-if purchase simulator:** Read-only scenarios that never alter stored transactions.
- **AI explanations:** Gemini-powered finance Q&A grounded in Python-calculated data, with clear outage handling.

## Technology

| Layer | Technology |
| --- | --- |
| Client | React, Vite, Tailwind CSS, Recharts |
| API | FastAPI, Python |
| Data | SQLite, SQLAlchemy, Pandas, NumPy |
| AI | Google Gemini API via backend only |
| Testing | Pytest, FastAPI TestClient, GitHub Actions |

## Current implementation

This initial repository includes a working `/api/v1/health` API, a starter React interface that checks API health, backend tests, a GitHub Actions workflow, and project documentation. Transaction CSV import, categorization, duplicate prevention, listing, and category correction are implemented. Monthly financial summary and category budgets are implemented. Forecasting, risk scoring, simulations, bills management and Gemini chat remain planned.

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

See [architecture](docs/architecture.md) and [API contract](docs/api-contract.md).

## Repository structure

```text
monetra-ai/
├── .github/               # CI, issue and pull request templates
├── backend/
│   ├── app/
│   │   ├── api/v1/         # Versioned FastAPI routes
│   │   ├── core/           # Configuration and DB wiring
│   │   ├── models/         # SQLAlchemy models (later phases)
│   │   ├── schemas/        # Pydantic contracts (later phases)
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
├── sample_data/           # Fictional CSV only
├── docs/                  # Architecture, API, demo and decisions
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
└── README.md
```

## Quick start

Prerequisites: Python **3.11+**, Node.js **20.19+** (or 22.12+), npm, and Git.

**Backend** (from repository root):

```bash
cd backend
python -m venv .venv
# Windows PowerShell: .\.venv\Scripts\Activate.ps1
# macOS/Linux: source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

API: `http://127.0.0.1:8000/api/v1/health`  
Swagger UI: `http://127.0.0.1:8000/docs`

**Frontend** (new terminal, from repository root):

```bash
cd frontend
cp .env.example .env  # Windows PowerShell: Copy-Item .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`. The starter screen reports the API connection state.

**Tests**:

```bash
cd backend
python -m pytest -v
```

```bash
cd frontend
npm run build
```

## Configuration and safety

- Configure non-secret Vite variables in `frontend/.env`.
- For future AI steps, copy `backend/.env.example` to `backend/.env` and set a Gemini key **only on the server**.
- Never commit `.env`, API keys, user financial data, or real bank/card information.
- All demo CSVs must be **fictional**.
- This is an educational prototype, **not financial or investment advice**.

## Development roadmap

| Phase | Goal | Status |
| --- | --- | --- |
| 1 | Foundation and local servers | Starter available; local verification required |
| 2 | SQLite, synthetic dataset, CSV validation/import | Steps 06–09 implemented; local verification required |
| 3 | Deterministic financial engine | Steps 10–11 implemented; steps 12–15 planned |
| 4 | Hosted Gemini integration | Planned |
| 5 | Complete UI and API integration | Planned |
| 6 | Tests, demo, documentation, submission | Planned |

Read [roadmap](docs/roadmap.md) for the planned sequence.

## Collaboration

We welcome focused issues and pull requests. Please read [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and [SECURITY.md](SECURITY.md) before participating.

## License

This project is licensed under the **[MIT License](LICENSE)**. See the separate license file for the full text.

Copyright © 2026 Tech_Innovators.

## CSV transaction demo (Phase 2 Steps 07–09)

Use the **Upload CSV** control on the frontend and select `sample_data/transactions.csv` (90 fictional rows), or use Swagger UI at `/docs` → `POST /api/v1/transactions/import`.

- Required CSV columns: `date,description,type,amount`; optional `category`.
- Dates use `YYYY-MM-DD`; amount uses BDT with no more than 2 decimal places.
- Valid transaction types: `income` and `expense`. Duplicate transactions are skipped using a stable fingerprint.
- Results include `imported`, `duplicates`, `invalid_rows`, and up to 30 row error explanations.
- Reimporting the same CSV should report zero newly imported rows. Category edits persist across reuploads.
- `GET /api/v1/transactions` shows up to 500 latest rows; use `?month=2026-10` or `?category=Food` to filter.

## Development team

Developed and maintained by **Tech_Innovators**.

## Current checkpoint

Follow [Phase 3 Steps 12–13 verification](docs/phase-3-steps-10-11-verification.md) before implementing forecasting and risk assessment.

## Monthly financial dashboard and budgets (Phase 3 Steps 12–13)

- `GET /api/v1/summary?month=2026-10` returns monthly income, expenses, category expense subtotals, carried-in balance, balance through the month and spendable balance after reserving pending bills.
- `GET /api/v1/budgets?month=2026-10` lists configured budgets with actual spending, remaining funds, utilization percentage and status.
- `PUT /api/v1/budgets` creates or updates a month/category budget; request example: `{"month":"2026-10","category":"Food","limit_paisa":500000}` (BDT 5,000). A limit of 0 reports `no_budget` and no utilization percentage.
- Every authoritative amount is calculated by Python/SQLAlchemy using integer paisa, not estimated or recalculated in the frontend.
- The selected month's opening balance is the configured opening balance plus **recorded** net transactions before the month. Transactions dated after the selected month are excluded.
- Pending bills due by the selected month's end are reserved based on their current stored status. Historical bill-status snapshots are not available yet; full bill creation/payment and reconciliation arrive in Step 15.
- No settings editor is included yet; the default configured opening balance is zero unless a `settings` row is added separately.

Copyright © 2026 Tech_Innovators.


## Phase 3 Steps 12–13: forecast and risk

`GET /api/v1/forecast?month=YYYY-MM` returns a Python-calculated calendar-day spending projection, actual expenses through the cutoff, available funds, unpaid bill reserve, risk classification, confidence and assumptions. Future months return `not_available`; completed months show actual spending. Less than seven elapsed days is labelled low confidence. The model does not learn from data and does not guarantee future expenses. See [verification instructions](docs/phase-3-steps-12-13-verification.md).

Copyright © 2026 Tech_Innovators. Licensed under the [MIT License](LICENSE).
