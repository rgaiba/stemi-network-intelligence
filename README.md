# STEMI Network Intelligence

Interactive demo of a clinical decision-support platform that optimizes ambulance routing and EMS deployment for STEMI (heart attack) patients. Built on NCDR ACTION + CathPCI registry distributions and a stochastic shortest-path routing model.

The demo shows the full three-tier architecture (prediction models, routing simulator, system optimizer) surfaced through five role-aware views.

## What it shows

The product centers on three predictive models stitched together by a system optimizer:

- **M1 — DIDO Predictor.** Predicts door-in-door-out time at each spoke ER from NCDR distributions, ER census, and time-of-day load.
- **M2 — D2B Predictor.** Predicts door-to-balloon time at each PCI hub from CathPCI distributions, pre-activation status, cath lab queue, and on-call team posture.
- **M3 — FMC-to-Device Simulator.** Monte Carlo simulation across all candidate pathways. Outputs expected total time, P10/P90, and probability of meeting the 90-minute guideline.
- **MEXCLP Coverage Optimizer.** Static system optimizer that recommends new EMS unit locations to close coverage gaps and lift FMC→device performance.

These compose into five interactive layers in the demo.

## Five layers

| Layer | Purpose |
| --- | --- |
| Live Event | Real-time pathway recommendation for an active STEMI. Three pathways compared on the same 90-minute guideline. |
| Prediction Models | M1 (DIDO) and M2 (D2B) outputs with NCDR-derived distributions, plus the M3 Monte Carlo result for the recommended pathway. |
| Coverage Optimizer | MEXCLP output. Current vs. optimized coverage, identified gap zones, and a 36-month investment-return view with payback line. |
| Role Dashboards | The same underlying data surfaced for six personas — EMS Crew, Spoke ER, PCI Hub, State DOH, CFO, Research. |
| Network State | The current S(t) — five EMS units, three spoke ERs, two PCI hubs, with TOD-adjusted predictions. |

## Tech stack

- React 18 (functional components, hooks)
- Vite 5 (dev + build)
- Tailwind CSS 3
- Recharts for charts and sparklines
- lucide-react for icons

No backend, no API calls, no browser storage. All data is bundled in `src/data.js` and was derived from NCDR ACTION + CathPCI distributions and Delaware network topology.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview
```

The compiled bundle lands in `dist/` and is fully static — drop it on any static host (Netlify, Vercel, S3, GitHub Pages).

## Project structure

```
.
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src
    ├── App.jsx        ← all five layers, ~800 lines, self-contained
    ├── data.js        ← NCDR-derived demo data (network, active event, coverage, benchmarks, dashboards, trends)
    ├── index.css      ← Tailwind directives + chart polish
    └── main.jsx       ← React entry
```

## Data provenance

The numbers in `src/data.js` are illustrative and derived from public NCDR ACTION and CathPCI distributions, Delaware EMS network topology, and operations-research literature on ambulance siting (MEXCLP). Nothing here represents a real patient or a real audit. Replace with live registry feeds and real-time CAD/dispatch data for production use.

## Design notes

- Clinical command-center aesthetic. Slate-900 background, monospaced metrics, semantic color (teal for action, green for ok, amber for warn, red for critical).
- 90-minute guideline rendered consistently on every time-based chart.
- Layer toggle uses a 150ms opacity transition so context-switching feels instant.

## Roadmap

- Live CAD/dispatch integration for the active-event feed.
- Real-time NCDR pull for benchmark refresh.
- Map view for the Network State layer (currently tabular).
- Scenario simulator on the Coverage Optimizer (drag candidate stations, recompute MEXCLP).

## License

MIT
