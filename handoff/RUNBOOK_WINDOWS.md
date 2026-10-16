# Clean-room Windows runbook

Extract the source repository ZIP. Keep any existing local `.env` and demo database outside the submitted source ZIP.

Backend PowerShell:
```powershell
cd monetra-ai\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m pytest -v
python -m uvicorn app.main:app --reload
```

Frontend PowerShell in another window:
```powershell
cd monetra-ai\frontend
npm ci
node --test tests/architecture.test.mjs
npm run build
npm run dev
```

Local sites: http://127.0.0.1:8000/docs and http://localhost:5173.

For live Gemini, configure `backend/.env` from `.env.example` locally; never include real keys in ZIP, deck or videos.

Fingerprint:
```powershell
Get-FileHash -Algorithm SHA256 .\Monetra_AI_Phase6_Steps25-28_Complete_Repository.zip
```
