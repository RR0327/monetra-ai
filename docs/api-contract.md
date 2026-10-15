# API Contract (Planned)

**Canonical base path: `/api/v1`.** Endpoints below except health are planned, not implemented.

| Method | Route | Responsibility |
| --- | --- | --- |
| GET | `/api/v1/health` | Implemented: service readiness |
| POST | `/api/v1/transactions/import` | Upload / validate / deduplicate CSV |
| GET | `/api/v1/transactions` | Filter/list transactions |
| PATCH | `/api/v1/transactions/{id}` | Correct a category |
| GET | `/api/v1/summary?month=YYYY-MM` | Exact totals and category spending |
| PUT | `/api/v1/budgets` | Set monthly category budget |
| GET | `/api/v1/budgets?month=YYYY-MM` | Read budgets and utilization |
| GET | `/api/v1/forecast?month=YYYY-MM` | Estimate and risk assumptions |
| POST | `/api/v1/simulations/purchase` | Read-only purchase scenario |
| POST | `/api/v1/bills` | Add demo bill |
| GET | `/api/v1/bills` | List unpaid and paid bills |
| PATCH | `/api/v1/bills/{id}/paid` | Mark bill paid |
| POST | `/api/v1/assistant/chat` | Grounded Gemini explanation |

## Example: health (implemented)

```json
{"status":"ok","project":"Monetra AI","version":"0.1.0"}
```

## Example: purchase simulation (planned)

```json
{"month":"2026-10","amount_paisa":500000,"category":"Shopping"}
```

Response fields will distinguish recorded balance, pending bill reserve, simulation impact, and expected future essentials. No purchases are committed during simulations.

**Important:** Some original project guides used unversioned `/api` endpoints, while another used `/api/v1`. This repository standardizes on `/api/v1`; adjust any future snippets accordingly.
