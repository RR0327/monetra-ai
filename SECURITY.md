# Security Policy

## Supported versions

Monetra AI is a hackathon prototype; only the current `main` branch receives fixes.

## Reporting a vulnerability

**Do not open a public issue for a security flaw.** If GitHub private vulnerability reporting is enabled, use the repository's **Security** tab to report it. Otherwise contact the repository owner privately through their listed GitHub profile contact method. Do not include secrets or real financial records.

## Threat-model basics

- The Gemini API key stays in backend `.env`; never expose it to browser code.
- Never commit real bank exports or personally identifying information.
- Validate CSV size, schema and content before import in later phases.
- Treat uploaded text as untrusted; it must not override AI system instructions.
- Simulations must never write financial transactions.

**Warning:** This is a synthetic-data demonstration, not a production banking application. It has no authentication or real banking integration.
