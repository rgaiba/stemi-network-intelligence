# STEMI Network Intelligence

Interactive demo of a clinical decision-support platform that optimizes ambulance routing and EMS deployment for STEMI (heart attack) patients. Built on NCDR ACTION and CathPCI registry distributions, U.S. Census CenPop2020 population centroids, and a stochastic shortest-path routing model.

The demo shows the full three-tier architecture (prediction models, routing simulator, system optimizer) surfaced through five role-aware views.

## What it shows

The product centers on three predictive components stitched together by a system optimizer:

- **DIDO Predictor.** Predicts door-in-door-out time at each spoke ER from NCDR distributions, ER census, and time-of-day load.
- **D2B Predictor.** Predicts door-to-balloon time at each PCI hub from CathPCI distributions, pre-activation status, cath lab queue, and on-call team posture.
- **FMC-to-Device Simulator.** Monte Carlo simulation across all candidate pathways. Outputs expected total time, P10/P90, and probability of meeting the 90-minute guideline.
- **Coverage and Siting Layer.** Population access analysis using U.S. Census CenPop2020 mean block-group centroids. Adds a MEXCLP siting view for EMS expansion.

These compose into five interactive layers in the demo.

## Five layers

| Layer | Purpose |
| --- | --- |
| Live Event | Real-time pathway recommendation for an active STEMI. Three pathways compared on the same 90-minute guideline. |
| Prediction Models | DIDO and D2B outputs with NCDR-derived distributions, plus the FMC-to-device Monte Carlo result for the recommended pathway. |
| Coverage | Census-derived drive-time access to PCI centers. Current six-center network vs. seven-center scenario adding a Milford PCI hub. Includes a separate EMS expansion capital scenario. |
| Role Dashboards | The same underlying data surfaced for six personas: EMS Crew, Spoke ER, PCI Hub, State DOH, CFO, Research. |
| Network State | The current S(t): five EMS units, three spoke ERs, two PCI hubs, with TOD-adjusted predictions. |

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

Population access numbers in the Coverage layer are derived from the U.S. Census Bureau CenPop2020 mean block-group centroids for Delaware (FIPS 10): 702 block groups, 989,948 residents. Drive time uses haversine distance with a 1.35 detour factor at 45 mph average speed. The current six-center PCI network is benchmarked against a seven-center scenario adding a mid-state PCI hub at Milford.

Time-distribution inputs (DIDO, D2B) and the active STEMI event in `src/data.js` are illustrative and derived from public NCDR ACTION and CathPCI distributions and operations-research literature. The active patient and routing scenario are synthetic. Replace illustrative inputs with live registry feeds and real-time CAD/dispatch data for production use.

## Design notes

- Clinical command-center aesthetic. Slate-900 background, monospaced metrics, semantic color (teal for action, green for ok, amber for warn, red for critical).
- 90-minute guideline rendered consistently on every time-based chart.
- Layer toggle uses a 150ms opacity transition so context-switching feels instant.

## Roadmap

- Live CAD/dispatch integration for the active-event feed.
- Real-time NCDR pull for benchmark refresh.
- Map view for the Network State layer (currently tabular).
- Scenario simulator on the Coverage layer (drag candidate stations, recompute MEXCLP).

## License

MIT
