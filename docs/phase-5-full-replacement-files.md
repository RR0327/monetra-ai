# Phase 5 — complete file inventory

All files below are present **in full** in this ZIP. No patches or partial snippets are required.

## Updated
- `frontend/src/App.jsx` — persistent state controller, nested client-side routes, responsive shell, loading and error states.
- `README.md` — Phase 5 setup and project progress.
- `CHANGELOG.md` — Phase 5 history.

## New
- `frontend/src/pages/Dashboard.jsx` — summary, category spend and budgets.
- `frontend/src/pages/Transactions.jsx` — CSV import and transaction editing.
- `frontend/src/pages/Forecast.jsx` — forecast, risks, read-only purchase simulation.
- `frontend/src/pages/Assistant.jsx` — grounded Gemini chatbot and trusted figures.
- `frontend/src/pages/Bills.jsx` — bill creation, reservation and paid state.
- `frontend/src/utils/format.js` — shared BDT/paisa formatting, category values and amount validation.
- `frontend/tests/architecture.test.mjs` — no-extra-package static frontend architecture tests.
- `docs/phase-5-steps-21-24-verification.md` — commands, 16-check checklist and full journey.
- `docs/phase-5-full-replacement-files.md` — this file.

## Unchanged but included
All v0.7.0 backend sources and 37 regression tests, `frontend/src/services/api.js` (existing centralized Axios client), all other application files, MIT License, original .gitignore and supporting docs. Backend API remains at version 0.7.0; frontend architecture is Phase 5.
