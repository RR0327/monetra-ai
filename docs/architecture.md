# Monetra AI — Final MVP Architecture

**Owner:** Tech_Innovators · **License:** MIT · **API contract:** `/api/v1` · **Financial units:** integer paisa (100 paisa = 1 BDT)

## System context

```text
Browser (React / Vite / Tailwind / Recharts)
  |
  | HTTP JSON + multipart CSV
  v
FastAPI modular monolith (CORS: local frontend origins)
  |-- api/v1/transactions -> validation, fingerprints, category corrections
  |-- api/v1/finance      -> monthly summary and budgets
  |-- api/v1/prediction   -> run-rate forecast and risk thresholds
  |-- api/v1/simulation   -> read-only purchase analysis
  |-- api/v1/bills        -> bill reserve / status transitions
  |-- api/v1/assistant    -> intent routing -> trusted financial context
  |                                      -> guarded Gemini explanation
  |-- SQLAlchemy -> SQLite file (single fictional demo profile)
  `-- google-genai -> hosted Gemini HTTPS service (backend environment key only)
```

## Trust boundaries

1. The React client is presentation only. It displays paisa-derived BDT amounts; it must not author authoritative financial figures.
2. All authoritative arithmetic is performed by deterministic Python services over SQLAlchemy database records. Balance = opening balance + recorded income - recorded expenses. Spendable = balance - pending reserved bills.
3. Forecasts use observed daily spending rate and disclose temporal cutoffs and confidence; **not** a trained ML model.
4. Simulations operate without transaction or bill database mutations.
5. The assistant routes the question to read-only Python calculations; only the minimum structured synthetic context is sent to Gemini. A response validator rejects certain unsupported numeric statements. This is a conservative guardrail, **not a mathematical proof** of arbitrary model prose.
6. If Gemini is offline, unauthorized, rate-limited, or misconfigured, the API returns a controlled AI status and available trusted numerical fields. The React app does not receive the API key.
7. Paid bills are no longer reserved as unpaid obligations. A bill marked paid **does not automatically post an expense transaction**; the actual expense must be recorded separately.

## Application boundaries

- Frontend pages: Dashboard, Transactions, Forecast/Simulator, Assistant, Bills; shared selected-month state and centralized `src/services/api.js`.
- Backend structure: `app/api/v1` routes, `app/schemas` contracts, `app/services` logic, `app/models` persistence, `app/core` DB and Gemini environment configuration.
- One SQLite demo profile; no real users, login system, bank integrations, payments, production multi-tenancy, or real-money movements.

## Financial data lifecycle

```text
Synthetic CSV -> column/type/date/money validation -> Decimal to integer paisa
   -> fingerprint duplicate check -> deterministic categorization
   -> database transaction -> monthly summary/budget/forecast/simulator
   -> structured trusted assistant context -> hosted Gemini explanation
   -> guarded response + trusted fields / controlled fallback
```

## Runtime and portability

Start backend from `backend/` to use the existing SQLite path (`sqlite:///./monetra.db`). Start frontend from `frontend/`. Local secrets and SQLite databases are excluded from source archives. Fresh setup requires a local `.env` copied from `backend/.env.example` and a locally available Gemini model/key for live AI. Backend tests inject isolated in-memory SQLite and mocked provider settings; they do not access a hosted LLM.

## Main API routes

See [API contract](api-contract.md). Key endpoints: `GET /api/v1/health`, `POST /api/v1/transactions/import`, `GET /api/v1/transactions`, `PATCH /api/v1/transactions/{id}`, `GET /api/v1/summary`, `GET/PUT /api/v1/budgets`, `GET /api/v1/forecast`, `POST /api/v1/simulations/purchase`, `POST/GET /api/v1/bills`, `PATCH /api/v1/bills/{id}/paid`, `POST /api/v1/assistant/chat`.

## Remaining limitations and risks

- Prototype categorization is keyword-based; ambiguous descriptions can remain `Other`.
- Forecast confidence and risk bands are heuristic educational indicators, not financial recommendations.
- AI intent recognition uses keywords and can misclassify complex requests. Grounding guardrails cannot catch every hallucination.
- No identity/authentication, rate limits for public deployment, audit-grade controls, backups, encryption-at-rest scheme, or migration pipeline. This MVP is meant for synthetic local demos, **not public production banking use**.
- Verify live Gemini quotas, privacy policy, connectivity, and official competition deliverables separately.
