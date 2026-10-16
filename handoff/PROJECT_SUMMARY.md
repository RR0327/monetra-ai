# Monetra AI — Project Summary (English)

**Team:** Tech_Innovators | **Track:** International, Topic A — Personal Finance Assistant

## The problem
Budgeting tools often show retrospective expenses without clarifying potential month-end shortfalls or the effect of an upcoming purchase. A conversational answer can be misleading when the language model invents balances.

## The solution
Monetra AI is a synthetic-data personal-finance prototype. It imports and categorizes transaction CSVs, displays income and spending, evaluates monthly budgets, estimates end-of-month expenditure, classifies risk, tracks pending bills, and simulates proposed purchases without committing transactions. A Gemini-powered assistant explains **Python-calculated** facts with explicit uncertainty and controlled AI-unavailable behavior.

## Architecture
React + Vite frontend → FastAPI `/api/v1` routes → modular Python financial services + SQLAlchemy/SQLite (synthetic records). Backend-only Gemini integration receives minimal structured context; the API returns trusted numerical fields separately from generated explanatory text. All stored monetary values use integer paisa.

## Demo flow
Upload fictional CSV → verify dashboard/budgets → inspect forecast/risk → simulate purchase (read-only) → ask Gemini for a grounded explanation → show graceful error fallback.

## Validation and boundaries
The current release includes 40 passing backend tests and four frontend architecture tests; the team reports completion of the full local final checklist. This is a demonstration prototype, not a bank-linked or regulated advisory product. It has no real user authentication, money transfers, live bank integrations or predictive ML training. Forecasts are extrapolations with caveats.

## Data handling
All competition demonstrations should use fictional financial data. Gemini API keys are configured server-side and excluded from submitted source archives.
