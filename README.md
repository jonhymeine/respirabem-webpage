# RespiraBEM — Webpage

Small web project that fetches weather and air-quality data and displays it in the browser.

This README explains how to run and test the project locally, how the geolocation flow works, and troubleshooting tips.

## What this project contains

- `index.html` — App entry (may load modules under `src/` when using the Vite dev server).
- `src/` — Project source (TypeScript/JS entry point referenced by the HTML) when present.
- `script.js`, `query.js` — helper and runtime scripts (present in some branches/versions of the project).
- `package.json` — contains scripts (`dev`, `build`, `preview`) and dependencies (Vite, dayjs, etc.).

## Prerequisites

- Node.js (v20+ recommended) and npm, if you plan to run the Vite dev server or build.
- A modern browser that supports ES modules and the Geolocation API (recent Chrome, Firefox, Edge, Safari).

## Recommended: run with the Vite dev server (fast, module-friendly)

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the URL printed by Vite in your browser (usually <http://localhost:5173>).

Why this: ES module imports (and TypeScript, if present) are handled automatically. The server sets correct headers so modules load and fetch/geolocation works from the served origin.

## Build and preview (production-like)

```bash
npm run build
npm run preview
```

This will produce a production build (if the project contains a build step) and preview it on a local server.
