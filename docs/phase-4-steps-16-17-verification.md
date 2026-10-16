# Phase 4 — Steps 16–17: Hosted Gemini configuration and connectivity

**Team:** Tech_Innovators · Copyright © 2026 Tech_Innovators · [MIT License](../LICENSE)

## Scope

This phase adds a **backend-only independent test** of Gemini, not the financial AI chat endpoint. All financial calculation endpoints must continue working even when Gemini is not configured. No client-side Gemini calls are introduced.

## Before starting

1. Open [Google AI Studio](https://aistudio.google.com/) and verify availability in your region and project, applicable API data policies, current free-tier eligibility and rate limits. Free service is not guaranteed.
2. Create an API key in a project you control. **Never paste it in chat, GitHub issues, screenshots, terminal recordings, or frontend files.**
3. From the repo root, copy `backend/.env.example` to `backend/.env` and edit it locally. Set `GEMINI_API_KEY` and `GEMINI_MODEL` to a model actually available for your key. The name intentionally has no default.
4. Keep using *fictional* finance data only.

## Commands (Windows PowerShell, from repository root)

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m pytest -v
python -m scripts.check_gemini
python -m uvicorn app.main:app --reload
```

`python -m scripts.check_gemini` prints a JSON response. On success, look for `"ok": true` and `"status": "connected"`. On failure, a safe status such as `not_configured`, `access_denied`, `model_unavailable`, `quota_exceeded`, `network_error`, or `provider_unavailable` is returned, with exit code 1. Genuine success **requires internet, a valid key, a supported model and available quota**. Unit tests use mocks and do not prove live access.

## Verification (mark only after personally testing)

1. Existing backend unit/API tests pass.
2. `/api/v1/health` reports version 0.6.0.
3. Existing transaction, summary, budget, forecast, simulator and bill endpoints work without a key.
4. `.env` is excluded from `git status --short`; `.env.example` remains tracked.
5. Configured, verified model produces a real response via the standalone script.
6. Missing key returns `not_configured` and does not crash the backend.
7. Invalid/unavailable key or model reports a controlled error without printing the credential.
8. Frontend still builds with `npm run build` and works without an AI endpoint.
9. `README.md` links to `LICENSE` and identifies Tech_Innovators.
10. `.gitignore` still contains `/monetra-ai/`.

## Troubleshooting

- `not_configured`: check `backend/.env` values and command working directory.
- `access_denied`: confirm key, account permissions, region, and provider restrictions.
- `model_unavailable`: verify the exact model ID currently supported for your key.
- `quota_exceeded`: review current quota and retry according to provider limits; do not assume free quota.
- `network_error`: check connection and firewall.
- `provider_unavailable`: verify Google AI Studio settings; avoid exposing exception bodies or secrets.

**Never use a live key in test fixtures.** The model may reply with wording other than the requested sentence; any nonempty response is a successful connectivity test.
