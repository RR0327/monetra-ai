# Monetra AI — Submission Gate and Handoff

**Team:** Tech_Innovators · **Competition:** 2026 Shenzhen International FinTech Competition, Topic A · **License:** MIT

## A. Build and engineering sign-off

- [ ] Fresh checkout/unzip starts FastAPI and React following README.
- [ ] `python -m pytest -v` in `backend/`: **40 tests** pass (37 prior + 3 synthetic full-flow tests).
- [ ] `node --test tests/architecture.test.mjs` in `frontend/`: **4 architecture tests** pass.
- [ ] `npm ci` and `npm run build` succeed on the actual demo machine.
- [ ] CSV invalid rows/duplicate imports, zero transactions, paisa precision, budget and forecast edge cases pass.
- [ ] Simulated purchase does not write to transactions/bills; pending/paid bill reservations behave as expected.
- [ ] Live Gemini access and safe failure mode work; client and GitHub contain no API key.
- [ ] Three synthetic full-flow scenarios are verified in UI as well as API tests.
- [ ] Copyright, MIT license link, and custom `.gitignore` exception remain correct.

## B. Demonstration and presentation

- [ ] Prepare six-to-eight slides: problem, user, workflow, architecture, deterministic calculations, AI grounding, demonstration, limitations/impact.
- [ ] Rehearse the 3-minute [demo script](demo-script.md) with sample CSV.
- [ ] Produce a backup screen recording using synthetic data and label it prerecorded.
- [ ] Confirm laptop power, internet, network quota, correct model, projector resolution, and local database backup.
- [ ] Assign presenter and secondary operator; keep fallback route ready.

## C. Official requirements — must be independently confirmed

- [ ] Verify the official **current** submission deadline and timezone with the organizer.
- [ ] Verify whether repository URL, source ZIP, PDF/slides, executable, and/or demo video are mandatory.
- [ ] Verify exact video length, supported formats, maximum upload size, and whether a live demonstration is required.
- [ ] Verify authors/team eligibility, required declarations, scoring rubric, submission portal and receipt confirmation.
- [ ] Submit before the organizer deadline and save the confirmation/receipt.

**Important:** The supplied technical roadmap *states* October 20, 2026 at 23:59 Beijing time (21:59 Bangladesh time), but does not confirm the required deliverable format or constitute current official organizer verification. Do not assume this checklist is an official rulebook.

## D. Release inventory

- Full repository source and complete replacement-file manifest.
- README, LICENSE, architecture, API contract, demo script, submission checklist and release verification checklist.
- Fictional transaction and bill datasets; no personal bank statements.
- No `.env`, API key, local SQLite DB, `.git`, `.venv`, `node_modules`, or `dist` in deliverable ZIP.

## Freeze policy

Once production builds and the rehearsal are successful, freeze new features. Fix only critical demo failures. Record known limitations rather than introducing last-minute dependencies.
