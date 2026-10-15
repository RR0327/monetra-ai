# Development Roadmap

The two supplied Monetra AI plans define a 5-day, 28-step, six-phase MVP. This repository keeps the phase ordering and uses `/api/v1` consistently.

| Phase | Steps | Deliverable |
| --- | --- | --- |
| 1. Foundation | 01–05 | Git, Python/Node tooling, running FastAPI and React |
| 2. Data | 06–09 | SQLite tables, fictional CSV data, categorization, validated deduplicated import |
| 3. Financial logic | 10–15 | Exact summaries, budgets, forecasts, risk, simulator and bills |
| 4. AI | 16–20 | Gemini connectivity, verified prompt context, guarded chat endpoint |
| 5. UI | 21–24 | Dashboard, import, forecast, simulator, assistant and bills integrated |
| 6. Finish | 25–28 | Automated and manual testing, docs, demo and submission |

**Current milestone:** Phase 1 project scaffold and health connection. The remaining work must be implemented and verified in order.

## Suggested 5-day coordination

- **Day 1:** Tooling, basic API/UI, database models, API contract, demo dataset.
- **Day 2:** CSV import, deterministic categories, totals, budgets, dashboard.
- **Day 3:** Forecast/risk, guarded Gemini service and chat UI.
- **Day 4:** Purchase simulation, bills, integration, edge-case testing.
- **Day 5:** Regression fixes, demonstration recording, slides, submission.

Freeze features once the end-to-end user journey works. Check competition rules and deadline through the organizer rather than assuming the documents fully specify deliverables.
