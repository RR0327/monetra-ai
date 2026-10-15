# Contributing to Monetra AI

Thanks for helping improve Monetra AI. This project is a hackathon-stage educational prototype.

## Before you begin

1. Read the [README](README.md), [architecture](docs/architecture.md), and [code of conduct](CODE_OF_CONDUCT.md).
2. Check existing issues to avoid duplicate work; propose significant changes in an issue first.
3. Use synthetic data only. Do not share credentials, private bank statements, or API keys.

## Development workflow

1. Fork (external contributors) or branch from the current `main` (team members).
2. Use branch names such as `feature/csv-import`, `fix/forecast-edge-case`, or `docs/api-contract`.
3. Make a small, focused change and add or update tests.
4. Run backend tests and frontend build:

```bash
cd backend && python -m pytest -v
cd ../frontend && npm install && npm run build
```

5. Open a pull request targeting `main`; fill out the PR template and request review.
6. Merge only after checks pass and a teammate approves.

## Engineering conventions

- Keep FastAPI routes thin; put business logic in `backend/app/services/`.
- Monetary calculations must use integer paisa, not floating-point currency.
- Use `/api/v1` endpoints and update `docs/api-contract.md` when changing API behavior.
- Financial results must come from Python, never Gemini's invented arithmetic.
- Handle empty data, duplicates, invalid inputs, network failures, and zero denominators.
- Use meaningful commit messages, e.g. `feat: add CSV duplicate detection`.
- Avoid broad refactors during the final demo freeze.

## Reporting issues

Use GitHub issue templates. Include reproducible steps and expected versus actual behavior. **Redact any sensitive data**.

By participating, you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).
