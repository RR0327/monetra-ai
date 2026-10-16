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


### GET `/api/v1/forecast?month=YYYY-MM`

Returns `month`, `currency`, `as_of_date`, `cutoff_date`, `days_in_month`, `elapsed_days`, `recorded_expenses_paisa`, `projected_month_end_expenses_paisa`, `estimated_remaining_expenses_paisa`, `available_funds_paisa`, `unpaid_bills_paisa`, `projected_obligations_paisa`, `risk_level` (`low`/`medium`/`high`/`unknown`), `risk_ratio_percent`, `confidence`, `status`, `assumptions`, and `warning`. Future months have no projected amount. All monetary amounts are integer paisa.

## Phase 3 Steps 14–15 endpoints

All money amounts use integer paisa. Responses are derived from the local fictional demo database.

### POST `/api/v1/simulations/purchase`

Request: `{"month":"2026-10","category":"Shopping","purchase_amount_paisa":200000}`. Returns balance after purchase, balance after pending bills, estimated balance after forecast remaining spending, before/after risk, warning, assumptions. Never inserts a transaction. Rejects invalid amount, category or month with HTTP 422.

### POST `/api/v1/bills`

Request: `{"title":"Internet","due_date":"2026-10-20","amount_paisa":100000}`. Returns new pending bill with HTTP 201.

### GET `/api/v1/bills`

Optional query `status=pending|paid`. Returns `{ "bills": [...], "pending_total_paisa": 0, "currency":"BDT" }` (total applies to returned list). Bills are sorted by due date.

### PATCH `/api/v1/bills/{bill_id}/paid`

Marks an existing bill paid (idempotent). HTTP 404 if not found. It stops the pending reserve and does **not** record a payment transaction; import the matching actual expense independently once.

**Scope/limitation:** Bill reservations include all currently pending bills due before the end of the selected month, even overdue bills. Historical snapshots use current statuses, not reconstructed historical states. The forecast run-rate is a statistical estimate, not trained machine learning.


## Phase 4 Steps 18–20 endpoint

### POST `/api/v1/assistant/chat`

**Request** (month required for deterministic month selection):

```json
{"month":"2026-10","question":"Can I buy a phone for 1200 BDT?"}
```

For purchase questions with no unambiguous BDT amount, include `"purchase_amount_paisa":120000` or provide a clear BDT amount in the question.

**Response:**

```json
{
  "month":"2026-10", "currency":"BDT", "intent":"purchase",
  "status":"connected", "source":"gemini",
  "answer":"Consider your essential spending and upcoming obligations before deciding.",
  "trusted_fields": {"month":"2026-10","currency":"BDT","summary":{"opening_balance_paisa":0,"income_paisa":0,"expenses_paisa":0,"balance_paisa":0,"unpaid_bills_paisa":0,"spendable_paisa":0},"forecast":{},"simulation":{}},
  "limitations":["Educational prototype using fictional data; not professional financial advice."]
}
```

Above values are **illustrative of response shape only**, not a live financial response. Actual `trusted_fields` include complete selected data from Python services.

`status`: `connected`, `not_configured`, `quota_exceeded`, `access_denied`, `model_unavailable`, `network_error`, `invalid_request`, `provider_unavailable`, `empty_response`, `unsafe_response`, or `needs_amount`. `source` is `gemini` only for a successful, guarded model explanation; otherwise `deterministic`. All calculated monetary fields are integer paisa. Gemini text is never the authoritative numerical source. Missing/invalid input returns 422. API has no database write operations.
