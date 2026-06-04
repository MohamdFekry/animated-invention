# E2 Experiment Analysis Concepts

This project contains a learnable webpage for the E2 analysis recommendations
document. It explains adjusted regression, CUPED, confidence intervals, and MLM
using the CPO/fleet-mix example from:

`/Users/moamin/Documents/Codex/sc-food-api/E2_ANALYSIS_RECOMMENDATIONS.md`

## GitHub Pages

The public, 100% free hosting target is GitHub Pages.

Use `docs/` as the Pages source folder:

- `docs/index.html` is the static page GitHub Pages will serve.
- `docs/.nojekyll` disables Jekyll processing.

In GitHub, enable:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

The page will be available at:

`https://<github-username>.github.io/<repo-name>/`

## Local Preview

Open `docs/index.html` directly in a browser for the GitHub Pages version.

The React/vinext version is also available for local editing and Sites-style
preview:

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Files

- `docs/index.html`: GitHub Pages-ready static website.
- `app/page.tsx`: React/vinext version used for local preview.
- `public/screenshot.jpeg`: canonical preview screenshot for Sites-style
  tooling.
