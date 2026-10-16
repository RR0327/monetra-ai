# Phase 1 Verification + Phase 2 Step 06

This step extends the original starter archive; use these checks before CSV import.

## Backend (terminal 1)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m pytest -v
python -m uvicorn app.main:app --reload
```

On Linux/macOS use `source .venv/bin/activate` instead of the PowerShell activation command.
Open `http://127.0.0.1:8000/api/v1/health` and `http://127.0.0.1:8000/docs`.
The database file `backend/monetra.db` is created on API startup. Never commit it.

## Frontend (terminal 2)

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` and look for `Connected — Monetra AI API v0.1.0`.
Run `npm run build` as a separate check.

## Database inspection (optional)

From the backend directory, with your venv active:

```powershell
python -c "from app.core.database import engine; from sqlalchemy import inspect; print(inspect(engine).get_table_names())"
```

Expected tables: `bills`, `budgets`, `settings`, `transactions`.

## Acceptance checklist

- [ ] Python, Node, npm and Git print versions
- [ ] Backend `/api/v1/health` returns `status: ok`
- [ ] Swagger documentation `/docs` opens
- [ ] React opens and shows backend connected
- [ ] Backend tests pass
- [ ] Frontend build passes
- [ ] Four SQLite tables exist
- [ ] SQLite data survives a backend restart (tested by automated database test)
- [ ] `.env` and `.db` are not tracked in Git

No CSV import, AI, or finance calculations are implemented in this milestone.
