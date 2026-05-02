// ============================================================
// STEMI NETWORK INTELLIGENCE — DEMO DATA
// All variables used by the working demo application.
// Source logic: derived from NCDR ACTION + CathPCI distributions,
// Delaware network topology, and operations research literature.
// ============================================================

export const NETWORK = {

  // ── PCI-CAPABLE HUBS ──────────────────────────────────────
  hubs: [
    {
      id: "hub_kent",
      name: "Kent Regional Medical Center",
      shortName: "Kent Regional",
      city: "Dover, DE",
      lat: 39.158, lng: -75.524,
      type: "pci_hub",
      // CathPCI-derived D2B distributions (minutes)
      d2b: {
        preActivated:   { p10: 34, p50: 48, p90: 68 },
        notActivated:   { p10: 52, p50: 74, p90: 102 },
      },
      annualPciVolume: 340,
      cathLabsAvailable: 2,
      cathLabQueue: 0,          // live: cases currently running
      onCallTeamStatus: "home", // "home" | "in_house"
      missionLifelineLevel: "Gold",
      ncdrPercentile: { d2b: 71, fmcToDevice: 68 },
    },
    {
      id: "hub_christiana",
      name: "Christiana Hospital",
      shortName: "Christiana",
      city: "Newark, DE",
      lat: 39.678, lng: -75.699,
      type: "pci_hub",
      d2b: {
        preActivated:   { p10: 40, p50: 58, p90: 82 },
        notActivated:   { p10: 61, p50: 88, p90: 118 },
      },
      annualPciVolume: 580,
      cathLabsAvailable: 3,
      cathLabQueue: 1,
      onCallTeamStatus: "in_house",
      missionLifelineLevel: "Platinum",
      ncdrPercentile: { d2b: 84, fmcToDevice: 79 },
    },
  ],

  // ── SPOKE / NON-PCI ERS ───────────────────────────────────
  spokeERs: [
    {
      id: "spoke_milford",
      name: "Milford Community Hospital",
      shortName: "Milford ER",
      city: "Milford, DE",
      lat: 38.912, lng: -75.428,
      type: "spoke_er",
      // NCDR ACTION DIDO distributions (minutes)
      dido: {
        p10: 22, p50: 36, p90: 58,
        // Time-of-day adjustment factors (multiplier on P50)
        timeOfDayFactors: {
          "00-06": 0.88, "06-12": 1.12, "12-18": 1.08, "18-24": 0.95
        }
      },
      erCensus: { current: 8, capacity: 18 },
      primaryTransferHub: "hub_kent",
      ncdrPercentile: { dido: 48 },
      bottleneck: "ECG-to-activation delay",
    },
    {
      id: "spoke_nanticoke",
      name: "Nanticoke Memorial",
      shortName: "Nanticoke ER",
      city: "Seaford, DE",
      lat: 38.641, lng: -75.611,
      type: "spoke_er",
      dido: {
        p10: 29, p50: 47, p90: 74,
        timeOfDayFactors: {
          "00-06": 0.92, "06-12": 1.18, "12-18": 1.05, "18-24": 0.98
        }
      },
      erCensus: { current: 14, capacity: 20 },
      primaryTransferHub: "hub_kent",
      ncdrPercentile: { dido: 34 },
      bottleneck: "Transfer coordination time",
    },
    {
      id: "spoke_beebe",
      name: "Beebe Medical",
      shortName: "Beebe ER",
      city: "Lewes, DE",
      lat: 38.774, lng: -75.139,
      type: "spoke_er",
      dido: {
        p10: 31, p50: 52, p90: 80,
        timeOfDayFactors: {
          "00-06": 0.85, "06-12": 1.22, "12-18": 1.10, "18-24": 1.02
        }
      },
      erCensus: { current: 11, capacity: 16 },
      primaryTransferHub: "hub_kent",
      ncdrPercentile: { dido: 28 },
      bottleneck: "HEMS vs. ground decision delay",
    },
  ],

  // ── EMS UNITS ─────────────────────────────────────────────
  emsUnits: [
    {
      id: "ems_1",
      callSign: "Medic-1",
      type: "ALS",
      status: "available",
      lat: 39.158, lng: -75.524,   // Dover area
      station: "Station 1 – Dover",
      busyFraction: 0.31,
      responseZone: "New Castle/Kent",
    },
    {
      id: "ems_2",
      callSign: "Medic-2",
      type: "ALS",
      status: "available",
      lat: 38.912, lng: -75.428,   // Milford area
      station: "Station 2 – Milford",
      busyFraction: 0.28,
      responseZone: "Kent/Sussex",
    },
    {
      id: "ems_3",
      callSign: "Medic-3",
      type: "ALS",
      status: "transporting",      // busy — on another call
      lat: 38.641, lng: -75.611,
      station: "Station 3 – Seaford",
      busyFraction: 0.34,
      responseZone: "Sussex West",
    },
    {
      id: "ems_4",
      callSign: "Medic-4",
      type: "ALS",
      status: "available",
      lat: 38.690, lng: -75.358,   // Georgetown area — gap zone
      station: "Station 4 – Georgetown",
      busyFraction: 0.22,
      responseZone: "Sussex Central",
    },
    {
      id: "ems_5",
      callSign: "HEMS-1",
      type: "HEMS",
      status: "available",
      lat: 38.912, lng: -75.428,
      station: "Air Base – Milford",
      busyFraction: 0.18,
      responseZone: "Statewide",
    },
  ],
};

// ── ACTIVE STEMI EVENT ─────────────────────────────────────
// The live event being routed in the "Live Event" layer.
export const ACTIVE_EVENT = {
  id: "evt_20260501_0923",
  timestamp: "2026-05-01T09:23:00",
  timeLabel: "09:23 AM",
  dayOfWeek: "Tuesday",
  timeSlot: "06-12",                // morning peak

  patient: {
    origin: { lat: 38.720, lng: -75.480, label: "Rural Sussex County" },
    age: 67,
    sex: "Male",
    riskFlags: ["HTN", "DM", "prior_MI"],
    cardiogenicShock: false,
    lvef: null,                      // unknown pre-cath
  },

  fieldECG: {
    result: "STEMI_CONFIRMED",
    leads: "II, III, aVF",           // inferior STEMI
    transmittedAt: "09:25:00",
    aiConfidence: 0.94,
  },

  assignedUnit: "ems_4",             // Medic-4 (nearest available)
  emsResponseTime: 7,                // minutes from dispatch to scene
  sceneTime: 6,                      // minutes (ECG + IV + report)

  // ── ROUTING PATHWAYS COMPUTED BY M3 ──
  // Each pathway: sequence of legs with predicted times
  pathways: [
    {
      id: "path_direct_kent",
      label: "Direct → Kent",
      recommended: true,
      legs: [
        { label: "EMS response",         min: 7,  type: "ems" },
        { label: "Scene / ECG",          min: 6,  type: "scene" },
        { label: "Transport to Kent PCI", min: 44, type: "transport" },
        { label: "D2B (pre-activated)",  min: 48, type: "d2b",
          distribution: { p10: 34, p50: 48, p90: 68 } },
      ],
      fmcToDevice: { p10: 73, p50: 87, p90: 108 },  // sum of distributions
      probUnder90: 0.62,
      preActivationSent: true,
      bypasses: [],
      totalMinutes: 87,
      color: "#0d6e5a",
    },
    {
      id: "path_via_milford",
      label: "Via Milford ER",
      recommended: false,
      legs: [
        { label: "EMS response",          min: 7,  type: "ems" },
        { label: "Scene / ECG",           min: 6,  type: "scene" },
        { label: "Transport to Milford",  min: 12, type: "transport" },
        { label: "DIDO at Milford",       min: 40, type: "dido",
          distribution: { p10: 22, p50: 36, p90: 58 },
          adjustedForTOD: true },
        { label: "Transfer to Kent",      min: 34, type: "transport" },
        { label: "D2B at Kent",           min: 48, type: "d2b",
          distribution: { p10: 34, p50: 48, p90: 68 } },
      ],
      fmcToDevice: { p10: 98, p50: 121, p90: 148 },
      probUnder90: 0.09,
      preActivationSent: false,
      bypasses: ["spoke_milford"],
      totalMinutes: 121,
      color: "#92650a",
    },
    {
      id: "path_direct_christiana",
      label: "Direct → Christiana",
      recommended: false,
      legs: [
        { label: "EMS response",               min: 7,  type: "ems" },
        { label: "Scene / ECG",                min: 6,  type: "scene" },
        { label: "Transport to Christiana PCI", min: 71, type: "transport" },
        { label: "D2B (in-house team)",        min: 52, type: "d2b",
          distribution: { p10: 40, p50: 58, p90: 82 } },
      ],
      fmcToDevice: { p10: 118, p50: 142, p90: 170 },
      probUnder90: 0.02,
      preActivationSent: false,
      bypasses: [],
      totalMinutes: 142,
      color: "#c0392b",
    },
  ],
};

// ── POPULATION COVERAGE / MEXCLP OPTIMIZER DATA ───────────
export const COVERAGE_DATA = {
  currentState: {
    populationCovered8min: 0.64,      // 64% within 8-min ALS response
    populationCoveredAny: 0.91,
    avgResponseTimeSuspectedSTEMI: 14.2,  // minutes, statewide
    stemisMeetingFMC90: 0.58,             // 58% achieve FMC-to-device <90 min
    annualSTEMIs: 185,                     // Delaware estimated
    annualExcessDeaths: 12,                // vs. fully optimized system
  },
  optimizedState: {
    unitsAdded: 2,
    populationCovered8min: 0.81,
    populationCoveredAny: 0.97,
    avgResponseTimeSuspectedSTEMI: 10.8,
    stemisMeetingFMC90: 0.79,
    annualExcessDeaths: 5,
    annualLivesSaved: 7,
    capitalCost: 420000,
    annualOpEx: 720000,
    annualRevenueCapture: 880000,
    netContribution: 160000,
    paybackMonths: 24,
  },
  gapZones: [
    {
      id: "gap_sussex_central",
      label: "Sussex Central",
      center: { lat: 38.690, lng: -75.380 },
      population: 42000,
      currentResponseMin: 22,
      optimizedResponseMin: 9,
      annualSTEMIs: 14,
      priority: "CRITICAL",
      recommendedStation: "Georgetown Fire Station",
      unitType: "ALS",
    },
    {
      id: "gap_sussex_east",
      label: "Sussex East / Shore",
      center: { lat: 38.720, lng: -75.140 },
      population: 28000,
      currentResponseMin: 18,
      optimizedResponseMin: 8,
      annualSTEMIs: 9,
      priority: "HIGH",
      recommendedStation: "Lewes Area",
      unitType: "ALS",
    },
  ],
  busyFractionByUnit: {
    "ems_1": 0.31, "ems_2": 0.28,
    "ems_3": 0.34, "ems_4": 0.22, "ems_5": 0.18,
  },
};

// ── NCDR BENCHMARKING DATA ─────────────────────────────────
export const NCDR_BENCHMARKS = {
  national: {
    d2b_p50: 58,           // minutes
    dido_p50: 43,
    fmcToDevice_p50: 96,
    pctMeeting90min: 0.64,
  },
  // Pilot hub actuals vs. national
  facilityActuals: {
    "hub_kent": {
      d2b_p50: 52,
      dido_p50_spokes: 36,     // avg across its spoke network
      fmcToDevice_p50: 88,
      pctMeeting90min: 0.71,
      missionLifelineLevel: "Gold",
      trend: "improving",      // "improving" | "stable" | "declining"
    },
  },
  // 30-day rolling metrics for Bayhealth
  rolling30day: {
    totalSTEMIs: 14,
    transferSTEMIs: 6,
    directSTEMIs: 8,
    avgFMCToDevice: 84,
    pctUnder90: 0.71,
    avgDIDO: 38,
    avgD2B: 50,
    cancelledActivations: 2,
    cancelRate: 0.12,
  },
};

// ── ROLE DASHBOARD DATA ────────────────────────────────────
export const ROLE_DASHBOARDS = {
  ems: {
    role: "EMS Crew / Dispatch",
    persona: "Medic-4 crew, en route",
    primaryMetric: "Routing Recommendation",
    widgets: [
      { label: "Recommendation",          value: "BYPASS → Kent Regional PCI",  status: "action", highlight: true },
      { label: "Expected FMC→Device",     value: "87 min [73–108]",    status: "warn" },
      { label: "Confidence <90 min",      value: "62%",                status: "warn" },
      { label: "Cath Lab Pre-Activation", value: "SEND NOW",           status: "action" },
      { label: "Preferred Route",         value: "US-13 N → DE-1 N",  status: "info" },
      { label: "ETA to Kent Regional",    value: "44 min",             status: "info" },
      { label: "Alt: Via Milford ER",     value: "121 min expected",   status: "bad" },
      { label: "HEMS Threshold",          value: "Not met (ground OK)", status: "ok" },
    ],
  },
  spokeER: {
    role: "Spoke ER Medical Director",
    persona: "Milford ER, shift view",
    primaryMetric: "DIDO Performance",
    widgets: [
      { label: "Current ER Census",       value: "8 / 18 beds",        status: "ok" },
      { label: "Predicted DIDO (next 4h)", value: "40 min [P50]",      status: "warn" },
      { label: "30-day DIDO P50",         value: "36 min",             status: "ok" },
      { label: "vs. NCDR National P50",   value: "↓ 7 min (better)",  status: "ok" },
      { label: "% DIDO <30 min (30d)",    value: "38% (target: 60%)", status: "bad" },
      { label: "Bottleneck",              value: "ECG→Activation delay", status: "warn" },
      { label: "Incoming transfers today", value: "2 projected",       status: "info" },
      { label: "NCDR DIDO Percentile",    value: "48th",               status: "warn" },
    ],
  },
  pciHub: {
    role: "PCI Hub Cath Lab Director",
    persona: "Kent Regional, live queue",
    primaryMetric: "Live Queue + Incoming",
    widgets: [
      { label: "Incoming STEMI (pre-act.)", value: "1 — ETA 44 min",  status: "action", highlight: true },
      { label: "Cath Lab Status",           value: "Available",        status: "ok" },
      { label: "Predicted D2B (this case)", value: "48 min [34–68]",  status: "ok" },
      { label: "Projected FMC→Device",      value: "87 min",          status: "warn" },
      { label: "30-day D2B P50",            value: "52 min",          status: "ok" },
      { label: "vs. NCDR National P50",     value: "↓ 6 min (better)", status: "ok" },
      { label: "STEMI captures YTD",        value: "38 (+7 vs. 2025)", status: "ok" },
      { label: "Mission: Lifeline Level",   value: "Gold",            status: "ok" },
    ],
  },
  stateDOH: {
    role: "State DOH / STEMI Coordinator",
    persona: "Delaware Cardiac Systems",
    primaryMetric: "Population Coverage",
    widgets: [
      { label: "Pop. within 8-min ALS",   value: "64% (target: 80%)", status: "bad" },
      { label: "% STEMIs <90 min FMC→D", value: "58% (target: 75%)", status: "bad" },
      { label: "Gap Zones Identified",    value: "2 priority zones",  status: "warn" },
      { label: "Units Recommended (add)", value: "2 ALS",             status: "action" },
      { label: "Est. Lives Saved (10yr)", value: "14–22",             status: "info" },
      { label: "Rural-Urban DIDO Gap",    value: "+18 min excess",    status: "bad" },
      { label: "Hospital Closures (risk)","value": "3 at risk",       status: "warn" },
      { label: "HRSA Grant Opportunity",  value: "$2.1M eligible",    status: "info" },
    ],
  },
  cfo: {
    role: "Health System CFO",
    persona: "Pilot Health System",
    primaryMetric: "Financial Attribution",
    widgets: [
      { label: "STEMI Captures (Q1 2026)",    value: "38 (+7 vs. Q1 2025)", status: "ok" },
      { label: "Incremental DRG Revenue (Q1)","value": "+$280K",            status: "ok" },
      { label: "Bypass Rate (direct-to-PCI)", value: "72% (↑ from 54%)",   status: "ok" },
      { label: "5-yr Cardiac LTV Pipeline",   value: "$840K est.",          status: "ok" },
      { label: "Platform Cost (annualized)",  value: "$195K",               status: "info" },
      { label: "Net ROI (acute + transport)", value: "143%",                status: "ok" },
      { label: "Payback Period",              value: "22 months",           status: "ok" },
      { label: "Next: Unit #5 Rec. (Sussex)", value: "$380K/yr OpEx",      status: "action" },
    ],
  },
  research: {
    role: "QI / Research Officer",
    persona: "NCDR Benchmarking View",
    primaryMetric: "Registry Benchmarking",
    widgets: [
      { label: "DIDO Percentile vs. NCDR",       value: "48th",          status: "warn" },
      { label: "D2B Percentile vs. NCDR",        value: "71st",          status: "ok" },
      { label: "FMC-to-Device vs. NCDR",         value: "68th percentile", status: "ok" },
      { label: "ACC Mission: Lifeline",           value: "Gold (Silver→Gold upgrade)", status: "ok" },
      { label: "Top Improvement Lever",          value: "DIDO (ECG→act)", status: "warn" },
      { label: "Publication Dataset Ready",      value: "24-month cohort", status: "ok" },
      { label: "Counterfactual Routing Pairs",   value: "n=47 matched",  status: "info" },
      { label: "Target Journal",                 value: "Circ: CQO / JACC", status: "info" },
    ],
  },
};

// ── HISTORICAL TREND DATA (for sparklines / charts) ────────
export const TREND_DATA = {
  monthlyFMCToDevice: [
    { month: "Jun 25", value: 102 },
    { month: "Jul 25", value: 98 },
    { month: "Aug 25", value: 96 },
    { month: "Sep 25", value: 101 },
    { month: "Oct 25", value: 94 },
    { month: "Nov 25", value: 91 },
    { month: "Dec 25", value: 89 },
    { month: "Jan 26", value: 88 },
    { month: "Feb 26", value: 86 },
    { month: "Mar 26", value: 84 },
    { month: "Apr 26", value: 84 },
    { month: "May 26", value: 87 },  // current month (partial)
  ],
  monthlyD2B: [
    { month: "Jun 25", value: 64 },
    { month: "Jul 25", value: 61 },
    { month: "Aug 25", value: 59 },
    { month: "Sep 25", value: 62 },
    { month: "Oct 25", value: 57 },
    { month: "Nov 25", value: 55 },
    { month: "Dec 25", value: 54 },
    { month: "Jan 26", value: 53 },
    { month: "Feb 26", value: 51 },
    { month: "Mar 26", value: 50 },
    { month: "Apr 26", value: 52 },
    { month: "May 26", value: 48 },
  ],
  monthlyDIDO: [
    { month: "Jun 25", value: 52 },
    { month: "Jul 25", value: 49 },
    { month: "Aug 25", value: 47 },
    { month: "Sep 25", value: 50 },
    { month: "Oct 25", value: 45 },
    { month: "Nov 25", value: 42 },
    { month: "Dec 25", value: 41 },
    { month: "Jan 26", value: 40 },
    { month: "Feb 26", value: 39 },
    { month: "Mar 26", value: 38 },
    { month: "Apr 26", value: 36 },
    { month: "May 26", value: 36 },
  ],
  ncdrNationalBenchmark: { fmcToDevice: 96, d2b: 58, dido: 43 },
};

// ── CENSUS-DERIVED PCI ACCESS (REAL NUMBERS) ──────────────
// Source: U.S. Census Bureau CenPop2020 mean block-group centroids,
// FIPS 10 (Delaware). 702 block groups, total residents 989,948.
// Drive-time model: haversine distance × 1.35 detour factor / 45 mph.
// Hospitals: 6 PCI-capable centers in current network (4 DE, 2 MD).
// Scenario: + 1 PCI center in Milford, DE (mid-state coverage gap).
export const CENSUS_ACCESS = {
  source: "U.S. Census Bureau · CenPop2020 mean block-group centroids · FIPS 10",
  blockGroups: 702,
  totalResidents: 989948,
  driveTimeModel: { detourFactor: 1.35, speedMph: 45 },
  current: {
    centers: 6,
    pctWithin8min:  42.1,
    pctWithin15min: 65.0,
    pctWithin30min: 89.1,
    pctWithin45min: 100.0,
    meanDriveMin: 13.6,
    medianDriveMin: 9.3,
    residentsBeyond30min: 107840,
  },
  withMilford: {
    centers: 7,
    pctWithin8min:  44.2,
    pctWithin15min: 69.5,
    pctWithin30min: 91.5,
    pctWithin45min: 100.0,
    meanDriveMin: 12.5,
    medianDriveMin: 9.0,
    residentsBeyond30min: 83985,
  },
  delta: {
    residentsGaining30minAccess: 23855,
    pctOfState: 2.4,
    pctWithin30minDelta: 2.4,
    meanDriveSavedMin: 1.1,
  },
  hubAssignmentCurrent: [
    { name: "Christiana",     city: "Newark, DE",     state: "DE", pop: 341380, pctOfState: 34.5 },
    { name: "Wilmington",     city: "Wilmington, DE", state: "DE", pop: 221006, pctOfState: 22.3 },
    { name: "Kent Regional",  city: "Dover, DE",      state: "DE", pop: 199223, pctOfState: 20.1 },
    { name: "Beebe",          city: "Lewes, DE",      state: "DE", pop: 170931, pctOfState: 17.3 },
    { name: "TidalHealth",    city: "Salisbury, MD",  state: "MD", pop:  54424, pctOfState:  5.5 },
    { name: "Shore Easton",   city: "Easton, MD",     state: "MD", pop:   2984, pctOfState:  0.3 },
  ],
  hubAssignmentWithMilford: [
    { name: "Christiana",     city: "Newark, DE",     state: "DE", pop: 341380, pctOfState: 34.5, delta:      0 },
    { name: "Wilmington",     city: "Wilmington, DE", state: "DE", pop: 221006, pctOfState: 22.3, delta:      0 },
    { name: "Kent Regional",  city: "Dover, DE",      state: "DE", pop: 157194, pctOfState: 15.9, delta: -42029 },
    { name: "Milford PCI",    city: "Milford, DE",    state: "DE", pop:  75305, pctOfState:  7.6, delta: +75305, isNew: true },
    { name: "Beebe",          city: "Lewes, DE",      state: "DE", pop: 145192, pctOfState: 14.7, delta: -25739 },
    { name: "TidalHealth",    city: "Salisbury, MD",  state: "MD", pop:  49871, pctOfState:  5.0, delta:  -4553 },
    { name: "Shore Easton",   city: "Easton, MD",     state: "MD", pop:      0, pctOfState:  0.0, delta:  -2984 },
  ],
};

// ── LAYER DEFINITIONS ─────────────────────────────────────
// Used to drive the layer toggle switch in the UI.
export const LAYERS = [
  {
    id: "live_event",
    label: "Live Event",
    icon: "⚡",
    description: "Active STEMI routing recommendation — real-time M3 pathway comparison",
    color: "#c0392b",
  },
  {
    id: "prediction_models",
    label: "Prediction Models",
    icon: "📊",
    description: "DIDO (M1) and D2B (M2) model outputs with NCDR-derived distributions",
    color: "#1a3f7a",
  },
  {
    id: "coverage_optimizer",
    label: "Coverage",
    icon: "🗺",
    description: "Population access to PCI centers, current vs. proposed-network scenario",
    color: "#0d6e5a",
  },
  {
    id: "dashboards",
    label: "Role Dashboards",
    icon: "👤",
    description: "Role-stratified intelligence — 6 personas, same underlying data",
    color: "#92650a",
  },
  {
    id: "network_state",
    label: "Network State",
    icon: "🔗",
    description: "Current S(t) — all EMS units, ER census, cath lab queue, traffic",
    color: "#6b3fa0",
  },
];
