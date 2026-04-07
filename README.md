# AI Readiness Scorecard

Executive-facing MVP for assessing organizational readiness to adopt AI responsibly, effectively, and strategically.

## Stack
- Next.js 14 (App Router)
- React 18
- JavaScript modules with clean config-driven architecture
- Recharts for visual score breakdowns

## Structure
- `app/` app shell, page entry, global styles
- `components/` client UI and assessment experience
- `lib/assessment-config.js` editable product configuration (categories, weights, questions, maturity levels)
- `lib/industry-config.js` industry profiles, sector-specific recommendations, and roadmap overlays
- `lib/question-overrides.js` sector-specific question wording overlays
- `lib/scoring.js` scoring engine, maturity logic, archetypes, summaries, roadmap generation

## Run
```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Notes
- Responses persist in localStorage.
- Print styles are not fully specialized yet, but the export section is intentionally structured for easy PDF/report support.
- Questions, weights, and maturity text can be updated without rewriting the UI.
- Industry-specific versions are driven by `lib/industry-config.js`.
