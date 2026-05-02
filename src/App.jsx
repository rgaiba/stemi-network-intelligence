import { useState, useEffect, useMemo } from 'react'
import {
  Activity, MapPin, Zap, Users, BarChart2, Radio, Heart, Truck, Building2,
  Plane, AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, DollarSign,
  Microscope, Stethoscope, Clock, Send, ChevronRight, Info, X,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine, Legend, Area, AreaChart, Cell,
} from 'recharts'
import {
  NETWORK, ACTIVE_EVENT, COVERAGE_DATA, NCDR_BENCHMARKS,
  ROLE_DASHBOARDS, TREND_DATA, LAYERS, CENSUS_ACCESS,
} from './data.js'

// ─────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────
const C = {
  bg: '#0f172a',
  surface: '#1e293b',
  surface2: '#172033',
  border: '#334155',
  text: '#e2e8f0',
  muted: '#94a3b8',
  teal: '#14b8a6',
  amber: '#f59e0b',
  red: '#ef4444',
  green: '#22c55e',
  blue: '#38bdf8',
  indigo: '#6366f1',
  purple: '#a855f7',
}

const LEG_COLORS = {
  ems: '#38bdf8',
  scene: '#a855f7',
  transport: '#6366f1',
  dido: '#f59e0b',
  d2b: '#14b8a6',
}

const STATUS_BORDER = {
  action: 'border-l-4 border-l-[#14b8a6]',
  ok:     'border-l-4 border-l-[#22c55e]',
  warn:   'border-l-4 border-l-[#f59e0b]',
  bad:    'border-l-4 border-l-[#ef4444]',
  info:   'border-l-4 border-l-[#475569]',
}
const STATUS_TEXT = {
  action: 'text-[#14b8a6]',
  ok:     'text-[#22c55e]',
  warn:   'text-[#f59e0b]',
  bad:    'text-[#ef4444]',
  info:   'text-slate-300',
}

const layerIcon = (id, props = {}) => {
  const map = {
    live_event: <Zap {...props} />,
    prediction_models: <BarChart2 {...props} />,
    coverage_optimizer: <MapPin {...props} />,
    dashboards: <Users {...props} />,
    network_state: <Radio {...props} />,
  }
  return map[id]
}

// ─────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────
function Header({ onAbout, aboutActive }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <header className="border-b border-[#334155] bg-[#0b1322] px-6 py-3">
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <Heart className="text-[#14b8a6]" size={22} />
          <div>
            <div className="text-[15px] font-semibold tracking-wide text-slate-100">
              STEMI NETWORK INTELLIGENCE
            </div>
            <div className="text-[11px] text-slate-400">
              Powered by NCDR ACTION + CathPCI Registry · Pilot Network · v1.0
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-[#172033] border border-[#334155]">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulseDot inline-block" />
            <span>Live: Delaware Network</span>
          </div>
          <button
            onClick={onAbout}
            className={[
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition',
              aboutActive
                ? 'bg-[#14b8a6] border-[#14b8a6] text-slate-900 font-semibold'
                : 'bg-[#172033] border-[#334155] text-slate-300 hover:bg-[#243248] hover:text-slate-100 hover:border-[#14b8a6]/60',
            ].join(' ')}
            title={aboutActive ? 'Back to dashboard' : 'About this dashboard'}
          >
            <Info size={13} />
            <span>{aboutActive ? 'Dashboard' : 'About'}</span>
          </button>
          <div className="metric-num pl-2">
            <span className="text-slate-100 font-semibold">{time}</span>
            <span className="ml-2 text-slate-400">{date}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

// ─────────────────────────────────────────────────────────────
// About page — light theme, NCDR research proposal structure,
// written for a clinical audience.
// ─────────────────────────────────────────────────────────────
function AboutPage({ onBack }) {
  return (
    <div className="bg-[#fafaf7] text-[#1a1e2e] min-h-[calc(100vh-128px)]">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10 font-serif">
        {/* Top metadata bar */}
        <div className="flex items-center justify-between border-b border-[#d4d6dc] pb-3 mb-6 text-[11px] uppercase tracking-[0.16em] text-[#7a7f8e]" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
          <span>About · Methodology and Evidence</span>
          <button
            onClick={onBack}
            className="text-[#1a1e2e] hover:text-[#b8860b] transition flex items-center gap-1"
          >
            <X size={11} /> Back to dashboard
          </button>
        </div>

        {/* Title block */}
        <div className="mb-8">
          <div className="text-[10px] uppercase tracking-[0.22em] text-[#7a7f8e] mb-2" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
            Research-Grade Clinical Decision Support
          </div>
          <h1 className="text-[34px] leading-[1.1] font-medium tracking-[-0.02em]">
            Network-Aware EMS Dispatch for ST-Elevation Myocardial Infarction
          </h1>
          <p className="mt-3 text-[15px] text-[#3a4055] leading-relaxed">
            A decision-analytic dashboard parameterized by the NCDR ACTION and CathPCI Registries,
            U.S. Census population centroids, and the operations-research literature on ambulance
            location. Designed for the prehospital, hospital, and policy decision-maker.
          </p>
        </div>

        {/* Central architecture figure */}
        <ArchitectureFigure />

        <div className="space-y-8 text-[14.5px] leading-[1.7] text-[#252a3d]">
          {/* 1. Why This Is Important */}
          <Section2 num="1" title="Why this is important">
            <p>
              ST-elevation myocardial infarction is the most time-sensitive emergency in cardiovascular
              medicine. Primary percutaneous coronary intervention is highly effective when delivered
              promptly, and its efficacy degrades in a dose-response relationship with time. The
              relationship is quantified, consistent across multiple national datasets, and directly
              actionable.
            </p>
            <p>
              Emergency medical dispatch in the United States is managed by approximately 17,000
              independent agencies operating on legacy computer-aided dispatch systems designed for
              jurisdictional compliance, not clinical optimization. Three structural failures follow
              from this architecture. The nearest available advanced life support unit is invisible to
              the dispatching system if it sits across an agency boundary. Units return to fixed home
              stations regardless of current demand distribution. Crews use static bypass protocols
              based on geographic distance rather than real-time predictions of door-in-door-out and
              door-to-balloon times.
            </p>
            <p>
              In the largest national prehospital STEMI cohort published to date, the median EMS
              interval was 57.0 minutes in rural settings and 37.6 minutes in urban settings, a gap of
              19.4 minutes that persisted after controlling for loaded mileage [1]. The authors
              estimated a 17.4% excess annual mortality in rural STEMI patients attributable to this
              disparity. The gap is structural, not geographic, and is therefore modifiable.
            </p>
          </Section2>

          {/* 2. Specific Aims */}
          <Section2 num="2" title="Specific aims">
            <p>The dashboard operationalizes three aims drawn directly from the underlying research program.</p>
            <ol className="list-decimal pl-6 space-y-2 mt-2">
              <li>
                Provide real-time, NCDR-anchored predictions of door-in-door-out time at each spoke
                emergency department and door-to-balloon time at each percutaneous coronary
                intervention hub, conditioned on current network state.
              </li>
              <li>
                Produce a stochastic shortest-path routing recommendation from first medical contact
                to device, with explicit probability of meeting the 90-minute guideline.
              </li>
              <li>
                Quantify the population-level mortality and access benefit of network-aware dispatch
                and surface it in formats appropriate to operational, quality, and policy audiences.
              </li>
            </ol>
          </Section2>

          {/* 3. Background and Significance */}
          <Section2 num="3" title="Background and significance">
            <h3 className="text-[15px] font-semibold mt-3 mb-1 text-[#1a1e2e]">3.1 STEMI epidemiology and the time imperative</h3>
            <p>
              Approximately 165,000 STEMI hospitalizations occur annually in the United States,
              generating roughly $5.8 billion in acute care costs. When primary percutaneous coronary
              intervention is delivered within 90 minutes of first medical contact, 30-day mortality
              approaches 4 to 6 percent. Beyond 90 minutes, mortality rises substantially. The ACC and
              AHA guideline target is met in fewer than 65 percent of cases nationally [2,3].
            </p>

            <h3 className="text-[15px] font-semibold mt-4 mb-1 text-[#1a1e2e]">3.2 The rural mortality disparity</h3>
            <p>
              Rural STEMI patients face a qualitatively different care pathway. The 19.4-minute median
              EMS interval gap reported by Stopyra and colleagues is driven by EMS system architecture:
              volunteer workforce attrition, static deployment, cross-jurisdictional blindness, and the
              absence of any network-level optimization [1]. Each of these is independently improvable.
            </p>

            <h3 className="text-[15px] font-semibold mt-4 mb-1 text-[#1a1e2e]">3.3 The operations-research foundation</h3>
            <p>
              The ambulance location and deployment problem has a mature operations-research literature.
              The Maximum Expected Coverage Location Problem [4,5], hypercube queuing models, and System
              Status Management are validated approaches to optimizing unit count, placement, and
              dynamic redeployment. Comparative simulation studies report mean response time
              improvements of approximately 58 seconds and 6 percent absolute gain in priority-call
              coverage within 8 minutes [6]. These gains are independent of routing intelligence and
              compose with it.
            </p>

            <h3 className="text-[15px] font-semibold mt-4 mb-1 text-[#1a1e2e]">3.4 Why NCDR is the essential data source</h3>
            <p>
              The NCDR ACTION Registry and CathPCI Registry are the only national data sources that
              contain the process-time variables required for this model: facility-level DIDO
              distributions, D2B distributions stratified by pre-activation status, and FMC-to-device
              times across a representative sample of US STEMI care settings. Approximately 700
              hospitals contribute. Claims data do not contain these variables. Electronic health
              record data are not nationally harmonized [7,8].
            </p>
          </Section2>

          {/* 4. Methods */}
          <Section2 num="4" title="Methods">
            <h3 className="text-[15px] font-semibold mt-3 mb-1 text-[#1a1e2e]">4.1 Decision-analytic structure</h3>
            <p>
              The STEMI care pathway is formalized as a directed weighted graph. Nodes are the patient
              origin, candidate EMS units, spoke emergency departments, and PCI-capable hubs. Edges are
              transitions: dispatch, response, scene, bypass decision, transport, DIDO, transfer, and
              D2B. Each edge weight is a probability distribution, not a point estimate, parameterized
              by NCDR data and updated by current network state.
            </p>

            <h3 className="text-[15px] font-semibold mt-4 mb-1 text-[#1a1e2e]">4.2 Prediction sub-models</h3>
            <p>
              Door-in-door-out time at each spoke is predicted from facility-level NCDR percentiles,
              current emergency department census, and time-of-day load multipliers. Door-to-balloon
              time at each hub is predicted from CathPCI distributions stratified by pre-activation
              status, cath-lab queue depth, and on-call team posture. Outputs are reported as P10,
              P50, and P90 to make uncertainty explicit at the point of care [9,10].
            </p>

            <h3 className="text-[15px] font-semibold mt-4 mb-1 text-[#1a1e2e]">4.3 Routing engine</h3>
            <p>
              The routing engine is a stochastic shortest-path Monte Carlo simulator with 1,000 draws
              per pathway. The objective is to minimize expected FMC-to-device time across the full
              pathway distribution, subject to unit availability and facility capacity constraints.
              The probability of meeting the 90-minute guideline is the primary action metric for the
              field crew. Compute time is under 500 milliseconds per case.
            </p>

            <h3 className="text-[15px] font-semibold mt-4 mb-1 text-[#1a1e2e]">4.4 Dose-response and mortality benefit</h3>
            <p>
              Mortality benefit is anchored in published time-to-treatment elasticities for primary
              percutaneous coronary intervention [11,12]. The primary specification is nonlinear,
              reflecting the steeper early-ischemia mortality curve. A linear specification of
              approximately 3 percent relative mortality increase per minute of additional 911-to-PCI
              time is reported as a sensitivity bracket. System-level lives-saved estimates apply this
              elasticity to the modeled FMC-to-device shift across the eligible STEMI cohort.
            </p>

            <h3 className="text-[15px] font-semibold mt-4 mb-1 text-[#1a1e2e]">4.5 Coverage and siting</h3>
            <p>
              Population access is computed against U.S. Census Bureau CenPop2020 mean block-group
              centroids. Drive time uses haversine distance with a 1.35 detour factor at 45 mph
              average speed. Optimal EMS unit siting follows the Maximum Expected Coverage Location
              Problem formulation of Daskin [4]. Multiperiod redeployment for dynamic operations
              follows Rajagopalan and colleagues [13].
            </p>
          </Section2>

          {/* 5. Innovation and Anticipated Impact */}
          <Section2 num="5" title="Innovation and anticipated impact">
            <h3 className="text-[15px] font-semibold mt-3 mb-1 text-[#1a1e2e]">5.1 Clinical impact</h3>
            <p>
              The dashboard delivers a defensible, NCDR-anchored estimate of expected FMC-to-device
              time and the probability of meeting the 90-minute guideline at the moment of routing.
              The point-of-care metric is the action metric. Crew, spoke, and hub views are aligned
              to the same underlying predictions.
            </p>

            <h3 className="text-[15px] font-semibold mt-4 mb-1 text-[#1a1e2e]">5.2 Quality and registry impact</h3>
            <p>
              Predictions and outcomes feed back to a structured benchmarking layer aligned with
              Mission: Lifeline categories [14] and the NCDR percentile distributions. Quality
              improvement officers can identify the highest-yield bottleneck (typically ECG to
              activation) and target intervention without a separate analytic project.
            </p>

            <h3 className="text-[15px] font-semibold mt-4 mb-1 text-[#1a1e2e]">5.3 Policy impact</h3>
            <p>
              The Coverage layer surfaces the population access gap and rural-urban EMS interval
              disparity in a form usable by state health departments, the HRSA Federal Office of Rural
              Health Policy, and CMS innovation program officers. The HRSA office invests
              approximately $300 million annually in rural health programs. The dashboard provides
              the structured evidence base for directing a defined share of that investment toward
              network-optimized EMS deployment.
            </p>
          </Section2>

          {/* 6. Data provenance and limitations */}
          <Section2 num="6" title="Data provenance and limitations">
            <p>
              Registry inputs are derived from public NCDR ACTION and CathPCI distributions. The
              geographic baseline is U.S. Census Bureau CenPop2020 (FIPS 10). The active patient and
              routing scenario shown in the Live Event layer are illustrative. Production deployment
              requires a Data Use Agreement with NCDR, a live computer-aided dispatch feed, and local
              IRB review. The dashboard is a research-grade decision-support prototype. It is not a
              regulated medical device. Clinical and financial figures are estimates and require
              local validation before operational use.
            </p>
          </Section2>

          {/* 7. References */}
          <Section2 num="7" title="Key references">
            <ol className="list-decimal pl-6 space-y-2 text-[13.5px]">
              <li>Stopyra JP, Crowe RP, Snavely AC, et al. Prehospital Time Disparities for Rural Patients with Suspected STEMI. <em>Prehospital Emerg Care</em>. 2023;27(4):488 to 495.</li>
              <li>O'Gara PT, Kushner FG, Ascheim DD, et al. 2013 ACCF/AHA Guideline for the Management of ST-Elevation Myocardial Infarction. <em>J Am Coll Cardiol</em>. 2013;61(4):e78 to e140.</li>
              <li>Tamis-Holland JE, et al. SCAI Expert Consensus Statement on the Management of Patients With STEMI Referred for Primary PCI. <em>J Soc Cardiovasc Angiogr Interv</em>. 2024;3(11):102294.</li>
              <li>Daskin MS. A maximum expected covering location model: formulation, properties and heuristic solution. <em>Transp Sci</em>. 1983;17(1):48 to 70.</li>
              <li>Church RL, ReVelle C. The maximal covering location problem. <em>Papers in Regional Science</em>. 1974;32(1):101 to 118.</li>
              <li>Rajagopalan HK, Saydam C, Xiao J. A multiperiod set covering location model for dynamic redeployment of ambulances. <em>Comput Oper Res</em>. 2008;35(3):814 to 826.</li>
              <li>Cannon CP, Brindis RG, Chaitman BR, et al. 2013 ACCF/AHA Key Data Elements and Definitions for Measuring the Clinical Management and Outcomes of Patients With Acute Coronary Syndromes. <em>J Am Coll Cardiol</em>. 2013;61(9):992 to 1025.</li>
              <li>Brindis RG, Fitzgerald S, Anderson HV, et al. The American College of Cardiology National Cardiovascular Data Registry. <em>J Am Coll Cardiol</em>. 2001;37(8):2240 to 2245.</li>
              <li>Diercks DB, Kontos MC, Chen AY, et al. Utilization and impact of pre-hospital electrocardiograms for patients with acute STEMI: data from NCDR ACTION Registry. <em>J Am Coll Cardiol</em>. 2009;53(2):161 to 166.</li>
              <li>Krumholz HM, Bradley EH, Nallamothu BK, et al. A campaign to improve the timeliness of primary percutaneous coronary intervention: Door-to-Balloon: An Alliance for Quality. <em>JACC Cardiovasc Interv</em>. 2008;1(1):97 to 104.</li>
              <li>De Luca G, Suryapranata H, Ottervanger JP, Antman EM. Time delay to treatment and mortality in primary angioplasty for acute myocardial infarction: every minute of delay counts. <em>Circulation</em>. 2004;109(10):1223 to 1225.</li>
              <li>Nallamothu BK, Normand SL, Wang Y, et al. Relation between door-to-balloon times and mortality after primary percutaneous coronary intervention over time. <em>Lancet</em>. 2015;385(9973):1114 to 22.</li>
              <li>Nallamothu BK, Bates ER, Herrin J, et al. Times to treatment in transfer patients undergoing primary PCI in the United States. <em>Circulation</em>. 2005;111(6):761 to 767.</li>
              <li>Jollis JG, Granger CB, Henry TD, et al. Systems of care for ST-segment-elevation myocardial infarction: a report from the American Heart Association's Mission: Lifeline. <em>Circ Cardiovasc Qual Outcomes</em>. 2012;5(4):423 to 428.</li>
              <li>National Cardiovascular Data Registry. ACTION Registry / Chest Pain-MI. American College of Cardiology. ncdr.com/webncdr/action.</li>
              <li>National Cardiovascular Data Registry. CathPCI Registry. American College of Cardiology. ncdr.com/webncdr/cathpci.</li>
            </ol>
          </Section2>

          {/* Footer */}
          <div className="border-t border-[#d4d6dc] pt-4 mt-6 text-[11px] text-[#7a7f8e] flex flex-wrap justify-between gap-2" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
            <span>STEMI Network Intelligence · v1.0</span>
            <span>Decision-support prototype · Not a regulated medical device</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Central architecture figure for the About page (JACC-style)
// ─────────────────────────────────────────────────────────────
function ArchitectureFigure() {
  // Color palette tuned for an academic figure
  const C = {
    navy: '#1a3759',
    teal: '#1f7d75',
    gold: '#b8860b',
    red:  '#c62828',
    text: '#1a1e2e',
    muted:'#6a7287',
    line: '#4a5270',
    sep:  '#e5e7eb',
    bg:   '#f5f6f9',
    card: '#ffffff',
  }
  const fSans = 'Inter, ui-sans-serif, system-ui, sans-serif'
  const fMono = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace'

  // Helpers for the gauge in Panel C
  const cx = 935, cy = 178, r = 60
  const polar = (deg) => {
    const a = (deg * Math.PI) / 180
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)]
  }
  // gauge sweeps from 180° (left) over top to 0° (right) = 180°
  // 40% → 108°,  70% → 54°,  85% (needle) → 27°
  const [pStart, p40, p70, pEnd] = [polar(180), polar(108), polar(54), polar(0)]
  const [needleX, needleY] = polar(27)
  const arc = (a, b, color) => (
    <path d={`M ${a[0]} ${a[1]} A ${r} ${r} 0 0 1 ${b[0]} ${b[1]}`} stroke={color} strokeWidth="11" fill="none" strokeLinecap="butt" />
  )

  // Source-card spec for Panel A
  const dataCards = [
    {
      title: 'NCDR ACTION + CathPCI Registry',
      lines: ['Facility-level DIDO and D2B', 'distributions by pre-activation'],
      footer: '≈ 700 contributing hospitals',
    },
    {
      title: 'U.S. Census CenPop2020',
      lines: ['Mean block-group centroids', 'population-weighted access'],
      footer: '702 block groups · FIPS 10',
    },
    {
      title: 'Live Computer-Aided Dispatch',
      lines: ['Unit availability and location', 'jurisdictional demand surface'],
      footer: 'Real-time telemetry',
    },
    {
      title: 'Operations-Research Literature',
      lines: ['MEXCLP, hypercube queuing,', 'stochastic shortest-path methods'],
      footer: 'Daskin 1983 · Church 1974',
    },
  ]

  return (
    <figure className="my-8 bg-white border border-[#d4d6dc] rounded shadow-sm overflow-hidden">
      <div className="border-b border-[#d4d6dc] px-5 py-2.5 flex items-baseline justify-between gap-4">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#b8860b] font-semibold" style={{ fontFamily: fMono }}>
          Figure 1
        </span>
        <span className="text-[12px] text-[#3a4055] italic">
          Three-tier architecture of STEMI Network Intelligence
        </span>
      </div>

      <div className="p-3 sm:p-5 bg-white">
        <svg viewBox="0 0 1100 540" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          <defs>
            <marker id="arr" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.line} />
            </marker>
            <marker id="arrTeal" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.teal} />
            </marker>
          </defs>

          {/* Panel separators */}
          <line x1="345" y1="20" x2="345" y2="510" stroke={C.sep} strokeWidth="1" />
          <line x1="775" y1="20" x2="775" y2="510" stroke={C.sep} strokeWidth="1" />

          {/* Cross-panel arrows */}
          <line x1="338" y1="270" x2="352" y2="270" stroke={C.line} strokeWidth="1.4" markerEnd="url(#arr)" />
          <line x1="768" y1="270" x2="782" y2="270" stroke={C.line} strokeWidth="1.4" markerEnd="url(#arr)" />

          {/* ─────────── PANEL A · Data Substrate ─────────── */}
          <g>
            <text x="22" y="24" fontFamily={fSans} fontSize="15" fontWeight="700" fill={C.text}>A</text>
            <text x="40" y="24" fontFamily={fSans} fontSize="13" fontWeight="600" fill={C.navy}>Data Substrate</text>
            <text x="22" y="42" fontFamily={fSans} fontSize="10" fill={C.muted}>National registries and population baseline</text>

            {dataCards.map((d, i) => {
              const y = 64 + i * 110
              return (
                <g key={i} transform={`translate(22, ${y})`}>
                  <rect width="305" height="96" fill={C.bg} stroke={C.navy} strokeWidth="0.8" rx="3" />
                  <rect x="0" y="0" width="4" height="96" fill={C.navy} />
                  <text x="14" y="22" fontFamily={fSans} fontSize="11.5" fontWeight="700" fill={C.navy}>{d.title}</text>
                  {d.lines.map((ln, j) => (
                    <text key={j} x="14" y={42 + j * 14} fontFamily={fSans} fontSize="10" fill={C.text}>{ln}</text>
                  ))}
                  <text x="14" y="84" fontFamily={fMono} fontSize="9" fill={C.muted}>{d.footer}</text>
                </g>
              )
            })}
          </g>

          {/* ─────────── PANEL B · Computational Engine ─────────── */}
          <g>
            <text x="362" y="24" fontFamily={fSans} fontSize="15" fontWeight="700" fill={C.text}>B</text>
            <text x="380" y="24" fontFamily={fSans} fontSize="13" fontWeight="600" fill={C.navy}>Computational Engine</text>
            <text x="362" y="42" fontFamily={fSans} fontSize="10" fill={C.muted}>Stochastic shortest-path simulator</text>

            {/* Directed weighted graph */}
            <g>
              <text x="362" y="68" fontFamily={fSans} fontSize="10.5" fontWeight="600" fill={C.text}>STEMI care pathway as a directed weighted graph</text>

              {/* Nodes */}
              {[
                { x: 410, label: 'Origin',  sub: 'Scene' },
                { x: 510, label: 'EMS',     sub: 'Dispatch' },
                { x: 610, label: 'Spoke ED', sub: 'DIDO' },
                { x: 710, label: 'PCI Hub', sub: 'D2B' },
              ].map((n, i) => (
                <g key={i}>
                  <circle cx={n.x} cy="120" r="22" fill={i === 0 ? C.gold : C.navy} />
                  <text x={n.x} y="124" fontFamily={fSans} fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle">{n.label}</text>
                  <text x={n.x} y="158" fontFamily={fSans} fontSize="9" fill={C.muted} textAnchor="middle">{n.sub}</text>
                </g>
              ))}

              {/* Edges (with arrows) */}
              {[[432, 488], [532, 588], [632, 688]].map(([a, b], i) => (
                <g key={i}>
                  <line x1={a} y1="120" x2={b} y2="120" stroke={C.line} strokeWidth="1.4" markerEnd="url(#arr)" />
                  {/* Distribution glyph above each edge */}
                  <path d={`M ${a + 6} 96 Q ${(a + b) / 2} 78 ${b - 6} 96`} fill="none" stroke={C.teal} strokeWidth="1.2" />
                </g>
              ))}

              {/* Edge label */}
              <text x="560" y="92" fontFamily={fSans} fontSize="9" fill={C.muted} textAnchor="middle" fontStyle="italic">edge weights = probability distributions</text>
            </g>

            {/* Monte Carlo callout */}
            <g transform="translate(362, 200)">
              <rect width="180" height="118" fill={C.bg} stroke={C.navy} strokeWidth="0.8" rx="3" />
              <text x="14" y="20" fontFamily={fSans} fontSize="11" fontWeight="700" fill={C.navy}>Monte Carlo simulator</text>
              {/* Fan visualization */}
              <g transform="translate(20, 36)" stroke={C.teal} strokeWidth="0.7" fill="none" opacity="0.7">
                <path d="M 0 30 Q 35 5 70 30" />
                <path d="M 0 30 Q 35 12 70 38" />
                <path d="M 0 30 Q 35 20 70 26" />
                <path d="M 0 30 Q 35 25 70 44" />
                <path d="M 0 30 Q 35 35 70 22" />
                <path d="M 0 30 Q 35 42 70 36" />
                <path d="M 0 30 Q 35 48 70 50" />
              </g>
              {/* Stopwatch label area */}
              <text x="100" y="56" fontFamily={fMono} fontSize="11" fontWeight="700" fill={C.navy}>1,000</text>
              <text x="100" y="68" fontFamily={fSans} fontSize="9" fill={C.text}>draws per pathway</text>
              <text x="14" y="98" fontFamily={fMono} fontSize="10" fill={C.text}>≤ 500 ms</text>
              <text x="14" y="110" fontFamily={fSans} fontSize="9" fill={C.muted}>compute per case</text>
            </g>

            {/* Uncertainty quantification */}
            <g transform="translate(560, 200)">
              <rect width="195" height="118" fill={C.bg} stroke={C.navy} strokeWidth="0.8" rx="3" />
              <text x="14" y="20" fontFamily={fSans} fontSize="11" fontWeight="700" fill={C.navy}>Uncertainty quantified</text>

              {/* Mini distribution curve with P10/P50/P90 markers */}
              <g transform="translate(14, 36)">
                {/* Bell curve */}
                <path d="M 0 60 C 25 60 35 10 80 10 C 125 10 135 60 165 60 Z" fill={C.teal} fillOpacity="0.18" stroke={C.teal} strokeWidth="1" />
                {/* P10 line */}
                <line x1="40" y1="14" x2="40" y2="60" stroke={C.muted} strokeWidth="0.8" strokeDasharray="2 2" />
                <text x="40" y="74" fontFamily={fMono} fontSize="8.5" fill={C.muted} textAnchor="middle">P10</text>
                {/* P50 */}
                <line x1="80" y1="6" x2="80" y2="60" stroke={C.navy} strokeWidth="1" />
                <text x="80" y="74" fontFamily={fMono} fontSize="8.5" fontWeight="700" fill={C.navy} textAnchor="middle">P50</text>
                {/* P90 */}
                <line x1="120" y1="14" x2="120" y2="60" stroke={C.muted} strokeWidth="0.8" strokeDasharray="2 2" />
                <text x="120" y="74" fontFamily={fMono} fontSize="8.5" fill={C.muted} textAnchor="middle">P90</text>
              </g>
            </g>

            {/* Objective line */}
            <g transform="translate(362, 340)">
              <rect width="393" height="50" fill="#fff" stroke={C.gold} strokeWidth="0.8" rx="3" />
              <text x="14" y="22" fontFamily={fSans} fontSize="10" fontWeight="700" fill={C.gold}>OBJECTIVE</text>
              <text x="14" y="40" fontFamily={fSans} fontSize="11" fill={C.text}>Minimise expected First-Medical-Contact-to-Device time</text>
            </g>

            {/* Prediction sub-models row */}
            <g transform="translate(362, 408)">
              <text x="0" y="14" fontFamily={fSans} fontSize="10" fontWeight="600" fill={C.navy}>Prediction sub-models</text>
              <g transform="translate(0, 24)">
                <rect width="190" height="74" fill={C.bg} stroke={C.navy} strokeWidth="0.6" rx="3" />
                <text x="12" y="18" fontFamily={fSans} fontSize="10.5" fontWeight="700" fill={C.navy}>DIDO · Spoke ED</text>
                <text x="12" y="34" fontFamily={fSans} fontSize="9" fill={C.text}>NCDR distribution + ED census +</text>
                <text x="12" y="46" fontFamily={fSans} fontSize="9" fill={C.text}>time-of-day load multiplier</text>
                <text x="12" y="64" fontFamily={fMono} fontSize="9" fill={C.muted}>Reported as P10 · P50 · P90</text>
              </g>
              <g transform="translate(203, 24)">
                <rect width="190" height="74" fill={C.bg} stroke={C.navy} strokeWidth="0.6" rx="3" />
                <text x="12" y="18" fontFamily={fSans} fontSize="10.5" fontWeight="700" fill={C.navy}>D2B · PCI Hub</text>
                <text x="12" y="34" fontFamily={fSans} fontSize="9" fill={C.text}>CathPCI distribution + queue +</text>
                <text x="12" y="46" fontFamily={fSans} fontSize="9" fill={C.text}>pre-activation status</text>
                <text x="12" y="64" fontFamily={fMono} fontSize="9" fill={C.muted}>Reported as P10 · P50 · P90</text>
              </g>
            </g>
          </g>

          {/* ─────────── PANEL C · Clinical Output ─────────── */}
          <g>
            <text x="792" y="24" fontFamily={fSans} fontSize="15" fontWeight="700" fill={C.text}>C</text>
            <text x="810" y="24" fontFamily={fSans} fontSize="13" fontWeight="600" fill={C.navy}>Clinical Output</text>
            <text x="792" y="42" fontFamily={fSans} fontSize="10" fill={C.muted}>Point-of-care and population-level</text>

            {/* Gauge */}
            <g>
              <text x="935" y="74" fontFamily={fSans} fontSize="10.5" fontWeight="600" fill={C.text} textAnchor="middle">Probability of meeting</text>
              <text x="935" y="88" fontFamily={fSans} fontSize="10.5" fontWeight="600" fill={C.text} textAnchor="middle">90-min FMC→Device guideline</text>
              {/* gauge arcs */}
              {arc(pStart, p40, '#c62828')}
              {arc(p40, p70, '#d99a3a')}
              {arc(p70, pEnd, '#1f7d75')}
              {/* needle */}
              <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={C.text} strokeWidth="2" strokeLinecap="round" />
              <circle cx={cx} cy={cy} r="4" fill={C.text} />
              {/* tick labels */}
              <text x={pStart[0] - 4} y={pStart[1] + 14} fontFamily={fMono} fontSize="9" fill={C.muted} textAnchor="end">0%</text>
              <text x={pEnd[0] + 4} y={pEnd[1] + 14} fontFamily={fMono} fontSize="9" fill={C.muted}>100%</text>
              {/* readout */}
              <text x={cx} y={cy + 26} fontFamily={fMono} fontSize="22" fontWeight="700" fill={C.navy} textAnchor="middle">85%</text>
              <text x={cx} y={cy + 44} fontFamily={fSans} fontSize="9" fill={C.muted} textAnchor="middle" fontStyle="italic">case-level, NCDR-conditioned</text>
            </g>

            {/* Mortality elasticity */}
            <g transform="translate(792, 270)">
              <rect width="288" height="92" fill={C.bg} stroke={C.red} strokeWidth="0.8" rx="3" />
              <rect x="0" y="0" width="4" height="92" fill={C.red} />
              <text x="14" y="20" fontFamily={fSans} fontSize="10" fontWeight="700" fill={C.red}>MORTALITY ELASTICITY</text>
              <text x="14" y="48" fontFamily={fMono} fontSize="22" fontWeight="700" fill={C.text}>+3%</text>
              <text x="64" y="44" fontFamily={fSans} fontSize="10" fill={C.text}>relative mortality per minute</text>
              <text x="64" y="58" fontFamily={fSans} fontSize="10" fill={C.text}>of additional treatment delay</text>
              <text x="14" y="80" fontFamily={fMono} fontSize="9" fill={C.muted}>De Luca 2004 · Stopyra 2023</text>
            </g>

            {/* Rural-urban disparity */}
            <g transform="translate(792, 374)">
              <rect width="288" height="124" fill={C.bg} stroke={C.red} strokeWidth="0.8" rx="3" />
              <rect x="0" y="0" width="4" height="124" fill={C.red} />
              <text x="14" y="20" fontFamily={fSans} fontSize="10" fontWeight="700" fill={C.red}>RURAL EXCESS MORTALITY</text>
              <text x="14" y="50" fontFamily={fMono} fontSize="24" fontWeight="700" fill={C.text}>17.4%</text>
              <text x="80" y="42" fontFamily={fSans} fontSize="10" fill={C.text}>excess annual mortality</text>
              <text x="80" y="56" fontFamily={fSans} fontSize="10" fill={C.text}>in rural STEMI patients</text>

              {/* Two mini network sketches */}
              <g transform="translate(14, 70)">
                <text x="0" y="10" fontFamily={fSans} fontSize="9" fill={C.muted}>Traditional</text>
                <g transform="translate(0, 16)" stroke={C.muted} strokeWidth="0.8" fill={C.muted}>
                  <circle cx="6"  cy="6"  r="2.5" /><circle cx="32" cy="20" r="2.5" />
                  <circle cx="60" cy="6"  r="2.5" /><circle cx="48" cy="32" r="2.5" />
                  <circle cx="14" cy="32" r="2.5" />
                  <line x1="6" y1="6" x2="32" y2="20" /><line x1="32" y1="20" x2="60" y2="6" />
                  <line x1="14" y1="32" x2="48" y2="32" />
                </g>
              </g>
              <g transform="translate(160, 70)">
                <text x="0" y="10" fontFamily={fSans} fontSize="9" fill={C.muted}>Network-aware</text>
                <g transform="translate(0, 16)" stroke={C.teal} strokeWidth="0.9" fill={C.teal}>
                  <circle cx="6"  cy="6"  r="2.5" /><circle cx="32" cy="20" r="2.5" />
                  <circle cx="60" cy="6"  r="2.5" /><circle cx="48" cy="32" r="2.5" />
                  <circle cx="14" cy="32" r="2.5" /><circle cx="60" cy="32" r="2.5" />
                  <line x1="6" y1="6" x2="32" y2="20" /><line x1="32" y1="20" x2="60" y2="6" />
                  <line x1="32" y1="20" x2="14" y2="32" /><line x1="32" y1="20" x2="48" y2="32" />
                  <line x1="48" y1="32" x2="60" y2="32" /><line x1="60" y1="6" x2="60" y2="32" />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>

      <figcaption className="px-5 py-3 text-[12px] italic text-[#3a4055] leading-[1.65] border-t border-[#d4d6dc] bg-[#fafaf7]">
        <span className="font-semibold not-italic text-[#1a1e2e]">Figure 1.</span> Three-tier
        architecture of STEMI Network Intelligence. Tier A ingests facility-level distributions
        from the NCDR ACTION and CathPCI Registries, U.S. Census Bureau CenPop2020 mean
        block-group centroids, real-time computer-aided dispatch telemetry, and the
        operations-research literature on ambulance location. Tier B formalises the STEMI care
        pathway as a directed weighted graph in which edge weights are probability distributions,
        not point estimates; the stochastic shortest path is computed by Monte Carlo simulation
        with 1,000 draws per pathway, returning percentile outputs in under 500 ms. Tier C
        surfaces the probability of meeting the 90-minute first-medical-contact-to-device
        guideline at the point of care and quantifies the population-level mortality benefit.
        CAD, computer-aided dispatch; CathPCI, Catheterisation Percutaneous Coronary Intervention
        Registry; D2B, door-to-balloon; DIDO, door-in-door-out; FMC, first medical contact;
        MEXCLP, Maximum Expected Coverage Location Problem; NCDR, National Cardiovascular Data
        Registry; STEMI, ST-elevation myocardial infarction.
      </figcaption>
    </figure>
  )
}

function Section2({ num, title, children }) {
  return (
    <section>
      <h2 className="text-[20px] font-semibold tracking-[-0.01em] text-[#1a1e2e] flex items-baseline gap-3 mb-2 border-b border-[#d4d6dc] pb-1">
        <span className="text-[#b8860b] metric-num text-[16px]" style={{ fontFamily: 'JetBrains Mono, ui-monospace, monospace' }}>
          {num}
        </span>
        <span>{title}</span>
      </h2>
      <div className="space-y-3">
        {children}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Layer toggle
// ─────────────────────────────────────────────────────────────
function LayerToggle({ active, onChange }) {
  return (
    <div className="px-6 py-3 border-b border-[#334155] bg-[#0d1729]">
      <div className="flex gap-1 flex-wrap">
        {LAYERS.map(L => {
          const isActive = L.id === active
          return (
            <button
              key={L.id}
              onClick={() => onChange(L.id)}
              className={[
                'flex items-center gap-2 px-3.5 py-2 rounded-md text-sm transition',
                isActive
                  ? 'bg-[#14b8a6] text-slate-900 font-semibold shadow-md shadow-teal-900/40'
                  : 'bg-[#1e293b] text-slate-300 hover:bg-[#243248] border border-[#334155]',
              ].join(' ')}
            >
              {layerIcon(L.id, { size: 15 })}
              {L.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// LAYER 1 — Live Event
// ─────────────────────────────────────────────────────────────
function PathwayBar({ pathway, max }) {
  const total = pathway.totalMinutes
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className={pathway.recommended ? 'text-[#22c55e] font-semibold' : 'text-slate-300'}>
            {pathway.label}
          </span>
          {pathway.recommended && (
            <span className="text-[10px] uppercase tracking-wider text-[#22c55e] font-bold">
              ✓ Recommended
            </span>
          )}
        </div>
        <span className="metric-num text-slate-200 font-semibold">{total} min</span>
      </div>
      <div className="relative h-7 bg-[#0b1322] rounded border border-[#334155] overflow-hidden">
        <div className="absolute inset-0 flex" style={{ width: `${(total / max) * 100}%` }}>
          {pathway.legs.map((leg, i) => {
            const w = (leg.min / total) * 100
            return (
              <div
                key={i}
                title={`${leg.label}: ${leg.min} min`}
                className="flex items-center justify-center text-[10px] font-semibold text-slate-900 border-r border-slate-900/40 last:border-r-0"
                style={{ width: `${w}%`, backgroundColor: LEG_COLORS[leg.type] || '#64748b' }}
              >
                {leg.min >= 8 ? `${leg.min}` : ''}
              </div>
            )
          })}
        </div>
        {/* 90-min reference */}
        <div
          className="absolute top-0 bottom-0 border-l-2 border-dashed border-[#ef4444]"
          style={{ left: `${(90 / max) * 100}%` }}
          title="90-min guideline"
        />
      </div>
      <div className="flex justify-between text-[11px] text-slate-400 metric-num">
        <span>P50: {pathway.fmcToDevice.p50} min</span>
        <span>Prob &lt;90 min: {(pathway.probUnder90 * 100).toFixed(0)}%</span>
      </div>
    </div>
  )
}

function LiveEventLayer() {
  const [activated, setActivated] = useState(false)
  const evt = ACTIVE_EVENT
  const recommended = evt.pathways.find(p => p.recommended)
  const max = Math.max(...evt.pathways.map(p => p.totalMinutes), 90) * 1.1

  return (
    <div className="layer-fade grid grid-cols-12 gap-4">
      {/* Left column */}
      <div className="col-span-12 lg:col-span-5 space-y-4">
        <Panel
          title={
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulseDot" />
              <span>ACTIVE STEMI EVENT</span>
              <span className="ml-auto text-[10px] text-slate-400 metric-num">{evt.id}</span>
            </div>
          }
          accent="red"
        >
          <Row k="Patient" v={`${evt.patient.age}${evt.patient.sex[0]} · ${evt.patient.origin.label}`} />
          <Row k="ECG" v={`Inferior STEMI (${evt.fieldECG.leads}) · AI ${(evt.fieldECG.aiConfidence * 100).toFixed(0)}%`} />
          <Row k="Transmitted" v={evt.fieldECG.transmittedAt} />
          <Row k="Assigned Unit" v={`Medic-4 · ALS · ${evt.emsResponseTime} min ETA`} />
          <div className="flex gap-1.5 mt-2">
            {evt.patient.riskFlags.map(f => (
              <span key={f} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#7f1d1d]/60 text-[#fecaca] border border-[#ef4444]/40">
                {f.replace('_', ' ')}
              </span>
            ))}
          </div>
        </Panel>

        <Panel
          title={
            <div className="flex items-center gap-2 text-[#22c55e]">
              <CheckCircle2 size={16} />
              <span className="font-semibold">RECOMMENDED PATHWAY</span>
            </div>
          }
          accent="green"
        >
          <div className="text-lg font-semibold text-slate-100">Direct → Kent Regional PCI</div>
          <div className="mt-3 flex items-end gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Expected FMC→Device</div>
              <div className="metric-num text-5xl font-bold text-[#22c55e] leading-none">
                {recommended.fmcToDevice.p50}
                <span className="text-lg text-slate-400 font-normal ml-1">min</span>
              </div>
            </div>
            <div className="text-xs text-slate-300 metric-num pb-1">
              <div>80% CI: [{recommended.fmcToDevice.p10} – {recommended.fmcToDevice.p90}]</div>
              <div>Prob &lt;90 min: <span className="text-[#22c55e] font-semibold">{(recommended.probUnder90 * 100).toFixed(0)}%</span></div>
            </div>
          </div>
          <button
            onClick={() => setActivated(true)}
            disabled={activated}
            className={[
              'mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-sm transition',
              activated
                ? 'bg-[#22c55e] text-slate-900 cursor-default'
                : 'bg-[#14b8a6] text-slate-900 hover:bg-[#0fa896]',
            ].join(' ')}
          >
            {activated ? <CheckCircle2 size={16} /> : <Send size={16} />}
            {activated ? 'Pre-Activation Sent' : 'SEND PRE-ACTIVATION NOW'}
          </button>
        </Panel>
      </div>

      {/* Right column */}
      <div className="col-span-12 lg:col-span-7 space-y-4">
        <Panel title="Pathway Comparison · M3 Stochastic Simulation">
          <div className="space-y-4">
            {evt.pathways.map(p => <PathwayBar key={p.id} pathway={p} max={max} />)}
          </div>
          <Legend90 max={max} />
        </Panel>

        <Panel title="Recommended Pathway · Leg-by-Leg Breakdown">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="text-left py-2">Leg</th>
                <th className="text-right py-2">Minutes</th>
                <th className="py-2 w-1/2">Share</th>
                <th className="text-right py-2">Distribution</th>
              </tr>
            </thead>
            <tbody>
              {recommended.legs.map((leg, i) => {
                const total = recommended.totalMinutes
                const w = (leg.min / total) * 100
                return (
                  <tr key={i} className="border-t border-[#334155]">
                    <td className="py-2 text-slate-200">{leg.label}</td>
                    <td className="py-2 text-right metric-num text-slate-100 font-semibold">{leg.min}</td>
                    <td className="py-2 pr-3">
                      <div className="h-2 bg-[#0b1322] rounded">
                        <div className="h-full rounded" style={{ width: `${w}%`, backgroundColor: LEG_COLORS[leg.type] }} />
                      </div>
                    </td>
                    <td className="py-2 text-right metric-num text-slate-400 text-xs">
                      {leg.distribution
                        ? `P10–P90: ${leg.distribution.p10}–${leg.distribution.p90}`
                        : 'fixed'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  )
}

function Legend90({ max }) {
  return (
    <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
      <div className="flex items-center gap-3 flex-wrap">
        {Object.entries({ 'EMS': LEG_COLORS.ems, 'Scene/ECG': LEG_COLORS.scene, 'Transport': LEG_COLORS.transport, 'DIDO': LEG_COLORS.dido, 'D2B': LEG_COLORS.d2b }).map(([k, c]) => (
          <div key={k} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c }} />
            <span>{k}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-3 border-t-2 border-dashed border-[#ef4444]" />
        <span>90-min guideline</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// LAYER 2 — Prediction Models
// ─────────────────────────────────────────────────────────────
function distroBins({ p10, p50, p90 }, binMin, binMax, step) {
  // Build a smooth-ish triangular distribution given P10/P50/P90 anchors
  const bins = []
  for (let x = binMin; x <= binMax; x += step) bins.push({ x, y: 0 })
  const sigmaL = (p50 - p10) / 1.282
  const sigmaR = (p90 - p50) / 1.282
  bins.forEach(b => {
    const s = b.x < p50 ? sigmaL : sigmaR
    const z = (b.x - p50) / s
    b.y = +(Math.exp(-0.5 * z * z) * 100).toFixed(2)
  })
  return bins
}

function PredictionModelsLayer() {
  const ev = ACTIVE_EVENT
  const milford = NETWORK.spokeERs.find(s => s.id === 'spoke_milford')
  const kent = NETWORK.hubs.find(h => h.id === 'hub_kent')
  const todFactor = milford.dido.timeOfDayFactors[ev.timeSlot]
  const adjustedDIDOp50 = Math.round(milford.dido.p50 * todFactor)

  const m1Distro = distroBins({ p10: 22, p50: 40, p90: 58 }, 10, 80, 5)
  const m2Distro = distroBins({ p10: 34, p50: 48, p90: 68 }, 20, 90, 5)
  const m3Distro = distroBins({ p10: 73, p50: 87, p90: 108 }, 50, 140, 5)

  const recommended = ev.pathways.find(p => p.recommended)

  return (
    <div className="layer-fade grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-6">
        <ModelCard
          title="DIDO Prediction · Spoke ER"
          subtitle={milford.name}
          color="#f59e0b"
          inputs={[
            ['ER Census', `${milford.erCensus.current} / ${milford.erCensus.capacity} (${Math.round(milford.erCensus.current / milford.erCensus.capacity * 100)}% load)`],
            ['Time of Day', `${ev.timeLabel} (${ev.timeSlot} factor: ×${todFactor})`],
            ['Day of Week', ev.dayOfWeek],
            ['NCDR Historical P50', `${milford.dido.p50} min`],
            ['Time-adjusted P50', `${adjustedDIDOp50} min`],
          ]}
          chart={<DistroChart data={m1Distro} fill="#f59e0b" anchor={{ p10: 22, p50: 40, p90: 58 }} unit="DIDO min" />}
          outputs={[
            { label: 'P10', value: '22 min', tone: 'info' },
            { label: 'P50', value: '40 min', tone: 'warn' },
            { label: 'P90', value: '58 min', tone: 'info' },
          ]}
          callouts={[
            { text: 'Prob DIDO <30 min: 18%', tone: 'bad' },
            { text: 'Bottleneck: ECG → Activation delay', tone: 'warn' },
          ]}
        />
      </div>

      <div className="col-span-12 lg:col-span-6">
        <ModelCard
          title="D2B Prediction · PCI Hub"
          subtitle={kent.name}
          color="#14b8a6"
          inputs={[
            ['Pre-Activation', 'YES (from field ECG)'],
            ['Cath Lab Queue', `${kent.cathLabQueue} cases running`],
            ['On-Call Team', kent.onCallTeamStatus === 'home' ? 'Home call (+8 min vs. in-house)' : 'In-house'],
            ['NCDR Historical P50', `${NCDR_BENCHMARKS.national.d2b_p50} min → adjusted ${kent.d2b.preActivated.p50} min (pre-activated)`],
            ['Annual PCI Volume', `${kent.annualPciVolume}/yr`],
          ]}
          chart={<DistroChart data={m2Distro} fill="#14b8a6" anchor={kent.d2b.preActivated} unit="D2B min" />}
          outputs={[
            { label: 'P10', value: `${kent.d2b.preActivated.p10} min`, tone: 'info' },
            { label: 'P50', value: `${kent.d2b.preActivated.p50} min`, tone: 'ok' },
            { label: 'P90', value: `${kent.d2b.preActivated.p90} min`, tone: 'info' },
          ]}
          callouts={[
            { text: 'Prob D2B <60 min: 74%', tone: 'ok' },
          ]}
        />
      </div>

      <div className="col-span-12">
        <Panel title="FMC-to-Device Simulation · 1,000 Monte Carlo draws" accent="teal">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 lg:col-span-7">
              <DistroChart
                data={m3Distro}
                fill="#14b8a6"
                anchor={recommended.fmcToDevice}
                unit="FMC→Device min"
                refLine={90}
                height={220}
              />
            </div>
            <div className="col-span-12 lg:col-span-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Expected" value="87 min" tone="ok" />
                <Stat label="Prob <90 min" value="62%" tone="warn" />
                <Stat label="P10" value="73 min" tone="info" />
                <Stat label="P90" value="108 min" tone="info" />
              </div>
              <div className="bg-[#172033] border border-[#334155] rounded-md p-3">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  NCDR National Comparison
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="metric-num text-2xl text-slate-100 font-bold">87 min</span>
                  <span className="text-slate-400 text-xs">vs. national P50 <span className="metric-num">{NCDR_BENCHMARKS.national.fmcToDevice}</span> min</span>
                </div>
                <div className="mt-1 text-[#22c55e] text-sm flex items-center gap-1">
                  <TrendingDown size={14} /> 9 min vs. national median
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}

function ModelCard({ title, subtitle, color, inputs, chart, outputs, callouts }) {
  return (
    <Panel title={<div className="flex items-center gap-2"><BarChart2 size={16} style={{ color }} /><span>{title}</span></div>}>
      <div className="text-xs text-slate-400 -mt-1 mb-3">{subtitle}</div>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-5 text-xs">
          <table className="w-full">
            <tbody>
              {inputs.map(([k, v]) => (
                <tr key={k} className="border-b border-[#334155]/60">
                  <td className="py-1.5 text-slate-400 pr-2">{k}</td>
                  <td className="py-1.5 text-slate-100 text-right metric-num">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-span-12 md:col-span-7">
          {chart}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {outputs.map(o => <Stat key={o.label} label={o.label} value={o.value} tone={o.tone} compact />)}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {callouts.map((c, i) => (
          <span
            key={i}
            className={[
              'text-[11px] px-2 py-1 rounded border',
              c.tone === 'bad' && 'bg-[#7f1d1d]/40 border-[#ef4444]/40 text-[#fecaca]',
              c.tone === 'warn' && 'bg-[#78350f]/40 border-[#f59e0b]/40 text-[#fde68a]',
              c.tone === 'ok' && 'bg-[#14532d]/40 border-[#22c55e]/40 text-[#bbf7d0]',
            ].filter(Boolean).join(' ')}
          >
            {c.text}
          </span>
        ))}
      </div>
    </Panel>
  )
}

function DistroChart({ data, fill, anchor, unit, refLine, height = 160 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="x" tick={{ fill: '#94a3b8', fontSize: 10 }} stroke="#475569" label={{ value: unit, position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
          <YAxis hide />
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6 }} formatter={(v) => [`${v}`, 'density']} labelFormatter={(l) => `${l} min`} />
          <Bar dataKey="y" fill={fill} radius={[2, 2, 0, 0]} />
          {anchor && (
            <>
              <ReferenceLine x={anchor.p50} stroke="#e2e8f0" strokeDasharray="2 2" label={{ value: 'P50', fill: '#e2e8f0', fontSize: 10, position: 'top' }} />
              <ReferenceLine x={anchor.p10} stroke="#64748b" strokeDasharray="2 2" />
              <ReferenceLine x={anchor.p90} stroke="#64748b" strokeDasharray="2 2" />
            </>
          )}
          {refLine && (
            <ReferenceLine x={refLine} stroke="#ef4444" strokeDasharray="4 2" label={{ value: '90-min', fill: '#ef4444', fontSize: 10, position: 'top' }} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// LAYER 3 — Coverage
// ─────────────────────────────────────────────────────────────
function CoverageOptimizerLayer() {
  const ca = CENSUS_ACCESS
  const cur = ca.current
  const fmt = n => n.toLocaleString()

  // Cumulative drive-time access curve (current network only)
  const accessCurve = [
    { mins:  8, pct: cur.pctWithin8min },
    { mins: 15, pct: cur.pctWithin15min },
    { mins: 30, pct: cur.pctWithin30min },
    { mins: 45, pct: cur.pctWithin45min },
  ]

  // Rural / urban EMS-time disparity (Stopyra et al. Prehosp Emerg Care 2023)
  const ruralUrban = [
    { setting: 'Urban', median: 37.6 },
    { setting: 'Rural', median: 57.0 },
  ]

  // Catchment of the current 6-center network
  const catchment = ca.hubAssignmentCurrent

  // State-level investment framing (illustrative, anchored to MEXCLP siting)
  const opt = COVERAGE_DATA.optimizedState
  const stateInvest = [
    ['Statewide STEMI volume (annual)',         '~185 events'],
    ['Population beyond 30-min PCI access',     `${fmt(cur.residentsBeyond30min)} residents`],
    ['Estimated rural excess mortality',        '17.4% per Stopyra et al. 2023'],
    ['Modeled lives saved · 10-yr horizon',     '14 to 22 (illustrative)'],
    ['HRSA Federal Office of Rural Health',     '$300M annual rural-health envelope'],
    ['Section 1115 / CMS innovation pathways',  'Eligible'],
  ]

  return (
    <div className="layer-fade space-y-4">
      {/* Audience banner */}
      <div className="bg-[#172033] border border-[#334155] rounded px-4 py-3 flex flex-wrap gap-x-6 gap-y-1 text-[11px] text-slate-400">
        <span className="text-[#14b8a6] font-semibold uppercase tracking-wider">For State and Policy Stakeholders</span>
        <span><span className="text-slate-500">Source:</span> {ca.source}</span>
        <span><span className="text-slate-500">Block groups:</span> <span className="metric-num text-slate-200">{ca.blockGroups}</span></span>
        <span><span className="text-slate-500">Residents:</span> <span className="metric-num text-slate-200">{fmt(ca.totalResidents)}</span></span>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-12 gap-4">
        <StatBigCard
          col="col-span-12 md:col-span-4"
          label="Population beyond 30-min PCI access"
          big={fmt(cur.residentsBeyond30min)}
          unit="residents"
          sub={`${(100 - cur.pctWithin30min).toFixed(1)}% of state · current 6-center network`}
          accent="bad"
        />
        <StatBigCard
          col="col-span-12 md:col-span-4"
          label="Rural vs. urban EMS interval"
          big="+19.4"
          unit="min gap"
          sub="57.0 min rural vs. 37.6 min urban (Stopyra 2023, n=23,700)"
          accent="bad"
        />
        <StatBigCard
          col="col-span-12 md:col-span-4"
          label="Estimated excess rural STEMI mortality"
          big="17.4%"
          unit="annual"
          sub="Modifiable through network-aware EMS dispatch"
          accent="bad"
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 lg:col-span-7" title="Cumulative Drive-Time Access to PCI · Statewide">
          <div className="text-[11px] text-slate-500 mb-2">
            Share of Delaware residents reachable to the nearest PCI-capable hospital within each drive-time threshold. Current six-center network. The 30-minute threshold is the operational policy target for direct-to-PCI access.
          </div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={accessCurve} margin={{ top: 10, right: 25, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="mins" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#475569" label={{ value: 'Drive-time threshold (min)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#475569" domain={[40, 100]} label={{ value: '% pop. reachable', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6 }} formatter={(v) => [`${v}%`, '% pop.']} labelFormatter={l => `≤ ${l} min`} />
                <ReferenceLine x={30} stroke="#ef4444" strokeDasharray="4 2" label={{ value: '30-min policy target', fill: '#ef4444', fontSize: 10, position: 'top' }} />
                <Line type="monotone" dataKey="pct" name="Current network" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
            <span>Mean drive (population-weighted): <span className="metric-num text-slate-200">{cur.meanDriveMin} min</span></span>
            <span>Median: <span className="metric-num text-slate-200">{cur.medianDriveMin} min</span></span>
          </div>
        </Panel>

        <Panel className="col-span-12 lg:col-span-5" title="Rural vs. Urban Median EMS Interval">
          <div className="text-[11px] text-slate-500 mb-2">
            ESO Data Collaborative, 23,700 suspected STEMI responses across 1,366 EMS agencies. The disparity is structural, not geographic, and is modifiable through network-level dispatch optimization.
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={ruralUrban} layout="vertical" margin={{ top: 10, right: 30, left: 25, bottom: 5 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#475569" label={{ value: 'Median EMS interval (min)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
                <YAxis dataKey="setting" type="category" tick={{ fill: '#e2e8f0', fontSize: 12 }} stroke="#475569" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6 }} formatter={v => [`${v} min`, 'Median']} />
                <Bar dataKey="median" radius={[0, 4, 4, 0]}>
                  {ruralUrban.map((d, i) => (
                    <Cell key={i} fill={d.setting === 'Rural' ? '#ef4444' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Current PCI Hub Catchment · Population Served by Each Center">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500">
              <th className="text-left py-2">Hub</th>
              <th className="text-left py-2">City</th>
              <th className="text-right py-2">Population assigned</th>
              <th className="text-right py-2">% of state</th>
              <th className="py-2 w-1/3">Share</th>
            </tr>
          </thead>
          <tbody>
            {catchment.map(h => (
              <tr key={h.name} className="border-t border-[#334155]/60">
                <td className="py-2 text-slate-100 font-medium">
                  {h.name}
                  <span className={[
                    'ml-2 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border',
                    h.state === 'DE' ? 'border-[#38bdf8]/40 text-[#38bdf8]' : 'border-[#a855f7]/40 text-[#a855f7]',
                  ].join(' ')}>{h.state}</span>
                </td>
                <td className="py-2 text-slate-400">{h.city}</td>
                <td className="py-2 text-right metric-num text-slate-200">{fmt(h.pop)}</td>
                <td className="py-2 text-right metric-num text-slate-300">{h.pctOfState}%</td>
                <td className="py-2 pl-3">
                  <div className="h-2 bg-[#0b1322] rounded">
                    <div className="h-full rounded bg-[#14b8a6]" style={{ width: `${h.pctOfState}%` }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="State-Level Investment Framing" accent="teal">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7">
            <table className="w-full text-sm">
              <tbody>
                {stateInvest.map(([k, v]) => (
                  <tr key={k} className="border-b border-[#334155]/60">
                    <td className="py-2 text-slate-300">{k}</td>
                    <td className="py-2 text-right metric-num text-slate-100 font-semibold">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-span-12 md:col-span-5 text-[12px] text-slate-300 leading-relaxed bg-[#172033] border border-[#334155] rounded p-3">
            <div className="text-[#14b8a6] text-[10px] uppercase tracking-wider font-semibold mb-1.5">
              Policy framing
            </div>
            <p className="mb-2">
              The rural EMS time gap is not a geographic constant. It is a function of dispatch architecture, unit positioning, and routing intelligence. Each is independently improvable.
            </p>
            <p>
              State health departments and HRSA grantmakers can prioritize EMS optimization investment using the access curve and catchment data above. Capital scenarios are sized at the network level and aligned with Mission: Lifeline performance targets.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  )
}

function StatBigCard({ col, label, big, unit, sub, accent }) {
  const accentMap = {
    bad:  { border: 'border-l-[#ef4444]', tone: 'text-[#ef4444]' },
    ok:   { border: 'border-l-[#22c55e]', tone: 'text-[#22c55e]' },
    warn: { border: 'border-l-[#f59e0b]', tone: 'text-[#f59e0b]' },
    info: { border: 'border-l-[#475569]', tone: 'text-slate-200' },
  }
  const a = accentMap[accent] || accentMap.info
  return (
    <div className={[col, 'bg-[#1e293b] border border-[#334155] rounded-md p-4 border-l-4', a.border].join(' ')}>
      <div className="text-[11px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={['metric-num text-4xl font-bold', a.tone].join(' ')}>{big}</span>
        <span className="text-sm text-slate-400">{unit}</span>
      </div>
      <div className="mt-2 text-[11px] text-slate-400 leading-snug">{sub}</div>
    </div>
  )
}

function KPICard({ col, title, subtitle, current, optimized, delta, accent, big }) {
  return (
    <div className={[col, 'bg-[#1e293b] border border-[#334155] rounded-md p-4', STATUS_BORDER[accent === 'ok' ? 'ok' : 'info']].join(' ')}>
      <div className="text-[11px] uppercase tracking-wider text-slate-400">{title}</div>
      <div className="text-xs text-slate-500 mb-3">{subtitle}</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] uppercase text-slate-500">Current</div>
          <div className="metric-num text-2xl text-slate-200">{current}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase text-slate-500">Optimized</div>
          <div className={['metric-num font-bold', big ? 'text-3xl' : 'text-2xl', 'text-[#22c55e]'].join(' ')}>
            {optimized}
          </div>
        </div>
      </div>
      <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#22c55e]">
        <TrendingUp size={14} /> {delta}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// LAYER 4 — Role Dashboards
// ─────────────────────────────────────────────────────────────
const ROLE_META = {
  ems:      { id: 'ems',      label: 'EMS Crew',  icon: <Truck size={14} /> },
  spokeER:  { id: 'spokeER',  label: 'Spoke ER',  icon: <Building2 size={14} /> },
  pciHub:   { id: 'pciHub',   label: 'PCI Hub',   icon: <Stethoscope size={14} /> },
  stateDOH: { id: 'stateDOH', label: 'State DOH', icon: <MapPin size={14} /> },
  cfo:      { id: 'cfo',      label: 'CFO',       icon: <DollarSign size={14} /> },
  research: { id: 'research', label: 'Research',  icon: <Microscope size={14} /> },
}

function RoleDashboardsLayer() {
  const [role, setRole] = useState('ems')
  const data = ROLE_DASHBOARDS[role]
  const showSparkline = ['pciHub', 'research', 'cfo'].includes(role)

  return (
    <div className="layer-fade space-y-4">
      <div className="flex flex-wrap gap-1.5">
        {Object.values(ROLE_META).map(r => {
          const active = r.id === role
          return (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition',
                active
                  ? 'bg-[#14b8a6] text-slate-900 border-[#14b8a6]'
                  : 'bg-[#1e293b] text-slate-300 border-[#334155] hover:bg-[#243248]',
              ].join(' ')}
            >
              {r.icon} {r.label}
            </button>
          )
        })}
      </div>

      <Panel
        title={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span>{data.role}</span>
              <span className="text-[11px] text-slate-400 font-normal">· {data.persona}</span>
            </div>
            <span className="text-[11px] text-[#14b8a6] uppercase tracking-wider">{data.primaryMetric}</span>
          </div>
        }
        accent="teal"
      >
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-7 space-y-1.5">
            {data.widgets.map((w, i) => (
              <div
                key={i}
                className={[
                  'flex items-center justify-between bg-[#172033] rounded px-3 py-2.5',
                  STATUS_BORDER[w.status],
                  w.highlight ? 'ring-1 ring-[#14b8a6]/40' : '',
                ].join(' ')}
              >
                <div className="text-sm text-slate-300">{w.label}</div>
                <div className={['metric-num text-sm font-semibold', STATUS_TEXT[w.status]].join(' ')}>
                  {w.value}
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-12 lg:col-span-5 space-y-3">
            {showSparkline && (
              <div className="bg-[#172033] border border-[#334155] rounded p-3">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  FMC→Device · 12-mo trend vs. NCDR national
                </div>
                <Sparkline
                  data={TREND_DATA.monthlyFMCToDevice}
                  benchmark={TREND_DATA.ncdrNationalBenchmark.fmcToDevice}
                  color="#14b8a6"
                  unit="min"
                />
                <div className="mt-1 text-[11px] text-[#22c55e] flex items-center gap-1">
                  <TrendingDown size={12} /> Improving — 15 min below national P50
                </div>
              </div>
            )}
            {showSparkline && (
              <div className="bg-[#172033] border border-[#334155] rounded p-3">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Door-to-Balloon · 12-mo trend
                </div>
                <Sparkline
                  data={TREND_DATA.monthlyD2B}
                  benchmark={TREND_DATA.ncdrNationalBenchmark.d2b}
                  color="#22c55e"
                  unit="min"
                />
              </div>
            )}
            {!showSparkline && (
              <div className="bg-[#172033] border border-[#334155] rounded p-3 text-xs text-slate-400 leading-relaxed">
                <div className="text-slate-200 font-semibold mb-1.5">Where this view shines</div>
                {role === 'ems' && 'Action-first dispatcher view. Recommendation, expected times, and the pre-activation trigger sit at the top so the crew can act in seconds.'}
                {role === 'spokeER' && 'DIDO performance against NCDR national benchmarks, with the predicted bottleneck flagged so the medical director knows where to intervene.'}
                {role === 'stateDOH' && 'Population-level coverage and gap zones. Pairs with the Coverage layer to justify capital and grant requests.'}
              </div>
            )}
          </div>
        </div>
      </Panel>
    </div>
  )
}

function Sparkline({ data, benchmark, color, unit }) {
  return (
    <div style={{ width: '100%', height: 80 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 9 }} stroke="#475569" />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} stroke="#475569" domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6 }} formatter={v => [`${v} ${unit}`, '']} />
          <ReferenceLine y={benchmark} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: `NCDR ${benchmark}`, fill: '#94a3b8', fontSize: 9, position: 'right' }} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// LAYER 5 — Network State
// ─────────────────────────────────────────────────────────────
function NetworkStateLayer() {
  const ev = ACTIVE_EVENT
  return (
    <div className="layer-fade space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 lg:col-span-4" title={<div className="flex items-center gap-2"><Truck size={14} /><span>EMS Units · 5 active</span></div>}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500">
                <th className="text-left py-1.5">Unit</th>
                <th className="text-left py-1.5">Type</th>
                <th className="text-left py-1.5">Status</th>
                <th className="text-right py-1.5">Busy</th>
              </tr>
            </thead>
            <tbody>
              {NETWORK.emsUnits.map(u => {
                const assigned = ev.assignedUnit === u.id
                const statusColor = u.status === 'available' ? '#22c55e' : u.status === 'transporting' ? '#f59e0b' : '#38bdf8'
                return (
                  <tr key={u.id} className={['border-t border-[#334155]', assigned ? 'bg-[#14b8a6]/10' : ''].join(' ')}>
                    <td className="py-2">
                      <div className={['font-semibold', assigned ? 'text-[#14b8a6]' : 'text-slate-100'].join(' ')}>
                        {u.callSign}
                        {assigned && <span className="ml-1.5 text-[9px] uppercase tracking-wider bg-[#14b8a6] text-slate-900 px-1.5 py-0.5 rounded">Assigned</span>}
                      </div>
                      <div className="text-[10px] text-slate-500">{u.responseZone}</div>
                    </td>
                    <td className="py-2 text-xs">
                      {u.type === 'HEMS' ? <span className="inline-flex items-center gap-1 text-[#a855f7]"><Plane size={11} /> HEMS</span> : <span className="text-slate-300">{u.type}</span>}
                    </td>
                    <td className="py-2">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
                        <span style={{ color: statusColor }}>{u.status}</span>
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <div className="inline-block w-16">
                        <div className="h-1.5 bg-[#0b1322] rounded">
                          <div className="h-full rounded bg-[#94a3b8]" style={{ width: `${u.busyFraction * 100}%` }} />
                        </div>
                        <div className="text-[10px] text-slate-500 metric-num text-right">{(u.busyFraction * 100).toFixed(0)}%</div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Panel>

        <Panel className="col-span-12 lg:col-span-4" title={<div className="flex items-center gap-2"><Building2 size={14} /><span>Spoke ERs · 3</span></div>}>
          <div className="space-y-3">
            {NETWORK.spokeERs.map(s => {
              const adj = Math.round(s.dido.p50 * s.dido.timeOfDayFactors[ev.timeSlot])
              const load = s.erCensus.current / s.erCensus.capacity
              const loadColor = load > 0.75 ? '#ef4444' : load > 0.5 ? '#f59e0b' : '#22c55e'
              return (
                <div key={s.id} className="bg-[#172033] border border-[#334155] rounded p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-slate-100">{s.shortName}</div>
                      <div className="text-[11px] text-slate-500">{s.city}</div>
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">
                      NCDR DIDO p{s.ncdrPercentile.dido}
                    </div>
                  </div>
                  <div className="text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Census</span>
                      <span className="metric-num text-slate-200">{s.erCensus.current} / {s.erCensus.capacity}</span>
                    </div>
                    <div className="h-1.5 bg-[#0b1322] rounded">
                      <div className="h-full rounded" style={{ width: `${load * 100}%`, backgroundColor: loadColor }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">DIDO P50 (TOD-adj)</span>
                      <span className="metric-num text-slate-200">{adj} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Primary hub</span>
                      <span className="text-slate-200">{NETWORK.hubs.find(h => h.id === s.primaryTransferHub)?.shortName}</span>
                    </div>
                    <div className="text-[11px] text-[#f59e0b] flex items-center gap-1 mt-1">
                      <AlertTriangle size={11} /> {s.bottleneck}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

        <Panel className="col-span-12 lg:col-span-4" title={<div className="flex items-center gap-2"><Stethoscope size={14} /><span>PCI Hubs · 2</span></div>}>
          <div className="space-y-3">
            {NETWORK.hubs.map(h => (
              <div key={h.id} className="bg-[#172033] border border-[#334155] rounded p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-slate-100">{h.shortName}</div>
                    <div className="text-[11px] text-slate-500">{h.city}</div>
                  </div>
                  <span className={[
                    'text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-bold',
                    h.missionLifelineLevel === 'Platinum' ? 'bg-slate-300/20 text-slate-200' : 'bg-amber-500/20 text-amber-300',
                  ].join(' ')}>
                    {h.missionLifelineLevel}
                  </span>
                </div>
                <div className="text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cath labs</span>
                    <span className="metric-num text-slate-200">{h.cathLabsAvailable} avail · {h.cathLabQueue} queued</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">On-call team</span>
                    <span className={['text-xs font-medium', h.onCallTeamStatus === 'in_house' ? 'text-[#22c55e]' : 'text-[#f59e0b]'].join(' ')}>
                      {h.onCallTeamStatus === 'in_house' ? 'In-house' : 'Home call (+8 min)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">D2B P50 (pre-act)</span>
                    <span className="metric-num text-slate-200">{h.d2b.preActivated.p50} min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Annual PCI vol</span>
                    <span className="metric-num text-slate-200">{h.annualPciVolume}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>NCDR D2B p{h.ncdrPercentile.d2b}</span>
                    <span>FMC→D p{h.ncdrPercentile.fmcToDevice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="bg-[#172033] border border-[#334155] rounded px-4 py-2.5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400">
        <div><span className="text-slate-500 mr-1">System time:</span><span className="metric-num text-slate-200">{ev.timeLabel}</span></div>
        <div><span className="text-slate-500 mr-1">Time slot:</span>Morning Peak (06–12)</div>
        <div><span className="text-slate-500 mr-1">TOD factor:</span><span className="metric-num text-slate-200">×1.12</span> on DIDO</div>
        <div><span className="text-slate-500 mr-1">Network last updated:</span><span className="metric-num text-slate-200">47 sec ago</span></div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────────────────────
function Panel({ title, children, accent, className = '' }) {
  const accentClass = accent === 'red'   ? 'border-l-4 border-l-[#ef4444]'
                    : accent === 'green' ? 'border-l-4 border-l-[#22c55e]'
                    : accent === 'amber' ? 'border-l-4 border-l-[#f59e0b]'
                    : accent === 'teal'  ? 'border-l-4 border-l-[#14b8a6]'
                    : ''
  return (
    <div className={['bg-[#1e293b] border border-[#334155] rounded-md p-4', accentClass, className].join(' ')}>
      {title && <div className="text-sm font-semibold text-slate-100 mb-3">{title}</div>}
      {children}
    </div>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex items-center justify-between text-sm py-1 border-b border-[#334155]/40 last:border-b-0">
      <span className="text-slate-400">{k}</span>
      <span className="text-slate-100 metric-num">{v}</span>
    </div>
  )
}

function Stat({ label, value, tone = 'info', compact }) {
  const tones = {
    ok:   'text-[#22c55e]',
    warn: 'text-[#f59e0b]',
    bad:  'text-[#ef4444]',
    info: 'text-slate-200',
  }
  return (
    <div className={['bg-[#172033] border border-[#334155] rounded p-2.5', compact ? '' : ''].join(' ')}>
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className={['metric-num font-bold', compact ? 'text-base' : 'text-xl', tones[tone]].join(' ')}>
        {value}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [layer, setLayer] = useState('live_event')
  const [aboutOpen, setAboutOpen] = useState(false)

  // Esc returns to dashboard from the About page
  useEffect(() => {
    if (!aboutOpen) return
    const onKey = e => { if (e.key === 'Escape') setAboutOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [aboutOpen])

  if (aboutOpen) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
        <Header onAbout={() => setAboutOpen(false)} aboutActive />
        <main className="flex-1">
          <AboutPage onBack={() => setAboutOpen(false)} />
        </main>
        <footer className="border-t border-[#334155] bg-[#0b1322] px-6 py-2.5 text-[11px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1 justify-between">
          <span>Data source: NCDR ACTION + CathPCI · U.S. Census CenPop2020</span>
          <span>Architecture: stochastic shortest-path simulator</span>
          <span>© 2026 STEMI-NI</span>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      <Header onAbout={() => setAboutOpen(true)} />
      <LayerToggle active={layer} onChange={setLayer} />

      <main className="flex-1 px-6 py-5 max-w-[1400px] w-full mx-auto">
        {layer === 'live_event'         && <LiveEventLayer />}
        {layer === 'prediction_models'  && <PredictionModelsLayer />}
        {layer === 'coverage_optimizer' && <CoverageOptimizerLayer />}
        {layer === 'dashboards'         && <RoleDashboardsLayer />}
        {layer === 'network_state'      && <NetworkStateLayer />}
      </main>

      <footer className="border-t border-[#334155] bg-[#0b1322] px-6 py-2.5 text-[11px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1 justify-between">
        <span>Data source: NCDR ACTION + CathPCI · U.S. Census CenPop2020</span>
        <span>Architecture: stochastic shortest-path simulator</span>
        <span>© 2026 STEMI-NI</span>
      </footer>

    </div>
  )
}
