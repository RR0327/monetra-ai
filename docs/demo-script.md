# Monetra AI — 3-Minute Live Demonstration Script

**Audience:** FinTech competition reviewers · **Demo mode:** local synthetic data · **Owner:** Tech_Innovators

## Before recording

1. Prepare a clean local demo database or back up the previous `backend/monetra.db` first. Import only fictional records. Check FastAPI `/docs`, React at `localhost:5173`, and Gemini quota/connectivity. Do not show private API keys or terminal `.env` content.
2. Have a working synthetic CSV and one planned bill. Ensure both servers remain running. Select October 2026 in the UI so all examples use the same month.
3. Prepare a *clearly labeled recording* from a previously successful synthetic-data demonstration as a backup, plus a fallback demo of deterministic calculations without Gemini.

## Timed presenter script

| Time | On-screen action | Presenter message |
|---|---|---|
| 0:00–0:30 | Title / Dashboard | “Monetra AI helps people understand spending, identify emerging cash-flow pressure, and evaluate purchases before committing.” |
| 0:30–1:00 | Transactions | “We ingest fictional CSV transactions, validate amounts/dates, classify expenses and skip duplicate uploads. Users can correct categories.” |
| 1:00–1:30 | Dashboard / Budgets | “Income, expenses and spendable amounts are calculated in Python, in integer paisa—not by AI. Pending bills reduce available funds separately.” |
| 1:30–2:00 | Forecast / risk | “We project the month-end spending run-rate, show confidence/assumptions, and classify financial pressure using explicit thresholds.” |
| 2:00–2:30 | Purchase simulator | “Here’s a proposed purchase: the hypothetical result changes, but the underlying transactions and bills do not.” |
| 2:30–3:00 | AI Assistant | “Gemini explains the Python-calculated financial context. Verified numeric fields stay separate. If the provider fails, the app preserves the calculations and transparently marks AI unavailable.” |

## Questions to demonstrate

- “What is my balance this month?”
- “How is my Food budget?”
- “What is my forecast risk?”
- “Can I buy a phone for 1200 BDT?”
- “What upcoming bills remain?”

## Common judge questions

**Does the model calculate the money?** No. SQLAlchemy-backed Python services calculate balances, budgets, forecast, risk and simulation. Gemini is a bounded explanation layer.

**Does simulation post a purchase?** No. It is read-only; automated tests assert transaction and bill counts remain unchanged.

**What if Gemini fails?** The assistant returns a controlled source/status and trusted fields; finance endpoints remain operational.

**Does the app connect to real banks?** No. This is an educational synthetic-data prototype; authentication and real financial integration are out of scope.

## Operational fallback

If an API request stalls, confirm backend and frontend are running. If Gemini fails, demonstrate the deterministic fields and explicitly label AI unavailable. If the live demo is blocked by network/quota, switch to the prerecorded synthetic-data walkthrough and identify it as a recording. Do not pretend it is a live response.
