# Cloudflare migration — 2026-11-09

This assessment exports static HTML/JS/CSS with Next.js; Cloudflare Workers
Static Assets serves `out/` with no server functions or paid add-ons.
No database, personal answers or local-development env files are uploaded.

`npm ci`, `npm run build`, `npm audit --omit=dev`, then `npx wrangler deploy`
from the reviewed merged commit. No Git-triggered Cloudflare build is configured
by this change. The Next 14 build dependency was updated to patched Next 15;
compatible patched CSS/source-map dependencies are pinned via overrides.

The existing custom hostname is retained, so browser-local answers remain on
the same origin. Existing Vercel deployments stay available for rollback. Before
custom-domain attachment, record the existing DNS target; restoring it reverts
the hostname to Vercel without changing any assessment answers.

Source base is GitHub main, matching current Vercel content. Uncommitted local
SEO/security/copy changes are intentionally excluded from this hosting migration.


## PR review hosting — 2026-11-22

Production remains `ai-readiness-scorecard` at `scorecard.2nspira.com`, using
`wrangler.json`. The isolated review Worker is `ai-readiness-scorecard-review`,
using **only** `wrangler.preview.json` (no routes/custom domains/databases).
This replaces Vercel for this branch's review hosting without releasing the fix
to production. `vercel.json` disables automatic Vercel Git deployments for commits
containing that file; main/other branches remain unchanged until it is merged.
Existing Vercel projects/deployments are retained for rollback, not deleted.

```bash
npm ci
npm test
npm run deploy:preview
# After independent QA and Jeffrey's explicit production approval, from reviewed main:
# npm run deploy:cloudflare
```

Both deployment scripts build locally, then publish static `out/` via project-local
Wrangler and existing authorized Cloudflare credentials. They do not configure
Cloudflare Git-triggered builds or GitHub Actions secrets. Do not claim automatic
Cloudflare builds are enabled. `out/build-info.json` records the source commit for
runtime verification; deploy from a clean committed checkout. Review preview is
public: use only fictional browser-local QA data, no real lead submissions.
A later preview deploy replaces the shared review Worker; it never changes the
production Worker, production routes or production browser-local answers.

Validate `/build-info.json`, root page, missing-path 404 and the results regression
suite against the actual review URL after deploy. Retain exact commit/version IDs
in the PR checkpoint. Restore automatic Vercel builds by reverting `vercel.json`;
no Vercel cleanup or production DNS changes are required for this preview switch.

References:
- https://developers.cloudflare.com/workers/static-assets/
- https://vercel.com/docs/project-configuration/git-configuration#turning-off-all-automatic-deployments
