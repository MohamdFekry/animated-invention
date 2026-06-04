# E2 Experiment Analysis Concepts

This project contains an interactive self-learning mini-course for the E2
analysis recommendations document. It explains weighted averages, CUPED,
confidence intervals, adjusted regression, and MLM using the CPO/fleet-mix
example from:

`/Users/moamin/Documents/Codex/sc-food-api/E2_ANALYSIS_RECOMMENDATIONS.md`

## GitHub Pages

The public, 100% free hosting target is GitHub Pages.

Use `docs/` as the Pages source folder:

- `docs/index.html` is the course homepage GitHub Pages will serve.
- `docs/mix.html`, `docs/weights.html`, `docs/cuped.html`,
  `docs/confidence-intervals.html`, `docs/adjusted-regression.html`, and
  `docs/mlm.html` are the individual lesson pages.
- `docs/styles.css` contains the visual design.
- `docs/app.js` contains the browser-side interactive labs.
- `docs/.nojekyll` disables Jekyll processing.

In GitHub, enable:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

The page will be available at:

`https://<github-username>.github.io/<repo-name>/`

## Local Preview

Run a small local server from `docs/` for the GitHub Pages version:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open `http://127.0.0.1:4173/`.

The React/vinext version is also available for local editing and Sites-style
preview:

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Files

- `docs/index.html`: GitHub Pages-ready course homepage.
- `docs/*.html`: one focused self-learning page per lab.
- `docs/styles.css`: visual system and responsive layout.
- `docs/app.js`: sliders, calculators, and lab interactions.
- `app/page.tsx`: React/vinext version used for local preview.
- `public/screenshot.jpeg`: canonical preview screenshot for Sites-style
  tooling.
