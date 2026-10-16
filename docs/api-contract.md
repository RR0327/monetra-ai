# Monetra AI API Contract

Copyright © 2026 Tech_Innovators.

Canonical prefix: `/api/v1`. Amounts are **integer paisa** in API responses.

| Method | Endpoint | Status | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/health` | Implemented | API status |
| POST | `/api/v1/transactions/import` | Implemented | Multipart `file` CSV upload; returns `imported`, `duplicates`, `invalid_rows`, `errors` |
| GET | `/api/v1/transactions` | Implemented | Up to 500 latest records; optional `month=YYYY-MM`, `category` |
| PATCH | `/api/v1/transactions/{id}` | Implemented | JSON `{"category":"Food"}` updates the user's category |
| GET | `/api/v1/summary` | Planned | Exact monthly summary |
| PUT / GET | `/api/v1/budgets` | Planned | Category spending limits |
| GET | `/api/v1/forecast` | Planned | Month-end projection and risk |
| POST | `/api/v1/simulations/purchase` | Planned | No-write purchase simulation |
| GET / POST | `/api/v1/bills` | Planned | Pending and paid obligations |
| POST | `/api/v1/assistant/chat` | Planned | Grounded Gemini explanation |

## CSV Contract

`date,description,type,amount,category` (category optional). UTF-8, maximum 2 MB, up to 10,000 rows. Dates ISO `YYYY-MM-DD`, positive BDT decimal amounts with at most 2 fractional digits, `income` or `expense` type. Files with invalid headers are rejected; invalid rows are reported and skipped. Duplicates are identified with a SHA-256 fingerprint excluding category.

## Security/limits

Synthetic demo data only. No auth or live financial accounts. Never send API keys through frontend. Never assume this is safe for public deployment.


## Phase 3 — Exact finance endpoints

All routes use `/api/v1`, all money values are integer paisa, and dates are `YYYY-MM`.

### GET `/api/v1/summary?month=2026-10`

Returns `month`, `currency`, `opening_balance_paisa`, `income_paisa`, `expenses_paisa`, `balance_paisa`, `unpaid_bills_paisa`, `spendable_paisa`, `category_expenses_paisa`.

Monthly balance = configured opening balance + net transactions before month + recorded income during month − recorded expenses during month. Spendable = balance − pending bills with due dates before the next month.

### GET `/api/v1/budgets?month=2026-10`

Returns array of `{id,month,category,limit_paisa,spent_paisa,remaining_paisa,utilization_percent,status}`. Only saved budget categories are returned. A zero limit gives `status: "no_budget"` and `utilization_percent: null`.

### PUT `/api/v1/budgets`

Request `{ "month": "2026-10", "category": "Food", "limit_paisa": 500000 }`. Allowed categories: Food, Transport, Shopping, Utilities, Rent, Health, Education, Other. Returns one budget object (creates or updates the same month/category entry). Rejects negatives and unsupported categories with 422.

Copyright © 2026 Tech_Innovators.
