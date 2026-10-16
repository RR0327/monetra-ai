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
