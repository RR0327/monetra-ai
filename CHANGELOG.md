## [0.7.0] — Phase 4 Steps 18–20
- Added deterministic intent routing and privacy-minimized finance context retrieval.
- Added backend-only grounded Gemini explanations, cautious output guards and controlled outages.
- Added read-only `POST /api/v1/assistant/chat` and integrated React chatbot.
- Added assistant unit/API tests, full-file deliverables and verification instructions.
- Copyright © 2026 Tech_Innovators; MIT License preserved.

## [0.6.0] — Phase 4 Steps 16–17

- Add backend-only Gemini environment settings and independent hosted connection probe.
- Handle missing configuration and quota, access, model, and network failures with safe status messages.
- Add mocked probe regression tests and step-by-step setup documentation.
- Do not add Gemini chat or client-side API credentials at this stage.

## [0.4.0] — Phase 3 Steps 12–13
- Added run-rate forecasting, risk classification, confidence warnings, and API.
- Added React forecast panel and automated regression checks.
- Copyright © 2026 Tech_Innovators.

# Changelog

Notable project changes are recorded here.

## [Unreleased]

### Added
- Phase 1 repository scaffold, health-check API and React starter UI.
- Contributor guidance, API contract, security documentation and CI.

## [0.3.0] - 2026-10-16
- Added exact monthly financial summary, carried balance and category spending aggregation.
- Added persistent monthly category budgets with zero-limit and overspending states.
- Integrated financial cards, category bars and budget editor in React.
- Added finance/budget tests and Phase 3 verification guide.
- Copyright © 2026 Tech_Innovators.

## [0.5.0] — 2026-10-16

- Added read-only purchase simulation with revised risk and conservative future spending reserve.
- Added bill creation, listing, paid status and integration into balances/forecasts.
- Added purchase simulator and bill controls to existing React dashboard.
- Added four integration tests for bills, validation, simulation and read-only persistence.
- Updated version, documentation and Tech_Innovators ownership conventions.

## Phase 5 — Steps 21–24 (frontend architecture update)
- Split monolithic dashboard views into five routed React pages; persistent global month selection and action handlers preserve original backend contracts.
- Added mobile-friendly application shell, active navigation, loading/error/success feedback and shared formatting utilities.
- Kept Axios API methods centralized in `frontend/src/services/api.js`; no finance arithmetic was moved to AI or client.
- Added independent frontend architecture checks and a 16-item local integration verification guide.
- Backend API remains v0.7.0; existing regression suite reports 37 passing tests. Vite production build requires local verification due to unavailable native Rollup dependency in the packaging environment.
