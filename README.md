# AI Readiness Scorecard

Executive-facing MVP for assessing organizational readiness to adopt AI responsibly, effectively, and strategically.

## Stack
- Next.js 15 (App Router)
- React 18
- JavaScript modules with clean config-driven architecture
- Recharts for visual score breakdowns

## Structure
- `app/` app shell, page entry, global styles
- `components/` client UI and assessment experience
- `lib/assessment-config.js` editable product configuration (categories, weights, questions, maturity levels)
- `lib/industry-config.js` industry profiles, sector-specific recommendations, and roadmap overlays
- `lib/question-overrides.js` sector-specific wording overlays for lighter customization
- `lib/question-sets.js` deeper sector-specific question sets for priority markets
- `lib/brand-config.js` 2Nspira brand and CTA messaging
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
- Educational Institutions, Small Businesses, and IT Teams now use deeper tailored question sets.

## Regression checks

Use Node.js 20+ (verified on Node 24) and Python 3 for the local static server:

```bash
npm ci
npm test
npm run build
npm run test:e2e
```

The browser tests exercise the production static export in `out/`, on loopback
port 3013 with fictional browser-local data. No lead submissions or deployments
are performed. On Linux, first run `npx playwright install --with-deps chromium`.
On macOS the config uses installed Google Chrome because current Playwright
browser downloads do not support macOS 13; override its path with
`PLAYWRIGHT_CHROME_EXECUTABLE_PATH` if needed.

An empty assessment has `overallScore: null`, `maturity: null`, and no archetype
or ranked strengths/gaps. It renders **Incomplete** without readiness guidance.
At least one scored answer (including the lowest answer or “Not sure”) keeps
the original partial-assessment weighting; a real score of zero is **Unprepared**.
