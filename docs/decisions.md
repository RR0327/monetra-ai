# Architectural Decision Log

## ADR-001 — Consistent versioned API URLs

**Decision:** Standardize on `/api/v1`.

**Context:** One supplied development guide uses `/api/...`; the updated system roadmap uses `/api/v1/...`. This choice prevents a split interface/API contract. New backend handlers and frontend calls must match this document.

## ADR-002 — Integer minor units

**Decision:** Persist and calculate money as integer BDT paisa, never float-based currency.

## ADR-003 — Deterministic finance before AI

**Decision:** Python services compute balances/forecasts/risk; Gemini explains only validated context. AI outages must leave calculations usable.

## ADR-004 — Synthetic data and local demo

**Decision:** Do not include authentication, bank sync, payment execution or production real-user processing in the MVP. Keep fictional data locally in SQLite and CSV.
