import { useState, useEffect, useMemo } from 'react'
import {
  Activity, MapPin, Zap, Users, BarChart2, Radio, Heart, Truck, Building2,
  Plane, AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, DollarSign,
  Microscope, Stethoscope, Clock, Send, ChevronRight,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine, Legend, Area, AreaChart, Cell,
} from 'recharts'
import {
  NETWORK, ACTIVE_EVENT, COVERAGE_DATA, NCDR_BENCHMARKS,
  ROLE_DASHBOARDS, TREND_DATA, LAYERS,
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
function Header() {
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
              Powered by NCDR ACTION + CathPCI Registry · Bayhealth Pilot · v1.0
            </div>
          </div>
        </div>
        <div className="flex items-center gap-5 text-xs text-slate-300">
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-[#172033] border border-[#334155]">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulseDot inline-block" />
            <span>Live: Delaware Network</span>
          </div>
          <div className="metric-num">
            <span className="text-slate-100 font-semibold">{time}</span>
            <span className="ml-2 text-slate-400">{date}</span>
          </div>
        </div>
      </div>
    </header>
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
          <div className="text-lg font-semibold text-slate-100">Direct → Bayhealth Kent PCI</div>
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
          title="Model M1 · DIDO Prediction"
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
          title="Model M2 · D2B Prediction"
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
        <Panel title="Model M3 · FMC-to-Device Simulation (1,000 Monte Carlo draws)" accent="teal">
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
// LAYER 3 — Coverage Optimizer
// ─────────────────────────────────────────────────────────────
function CoverageOptimizerLayer() {
  const cur = COVERAGE_DATA.currentState
  const opt = COVERAGE_DATA.optimizedState

  // Build investment return chart: month 0..36
  // Cumulative net = (revenueMonthly - opexMonthly) * month - capital
  const revMo = opt.annualRevenueCapture / 12
  const opexMo = opt.annualOpEx / 12
  const cap = opt.capitalCost
  const investment = []
  for (let m = 0; m <= 36; m++) {
    investment.push({
      month: m,
      revenue: +((revMo * m) / 1000).toFixed(1),         // $K cumulative
      opex: +((opexMo * m + cap) / 1000).toFixed(1),     // $K cumulative
      net: +((((revMo - opexMo) * m) - cap) / 1000).toFixed(1),
    })
  }

  return (
    <div className="layer-fade space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <KPICard
          col="col-span-12 md:col-span-4"
          title="Population Coverage"
          subtitle="Within 8-min ALS"
          current={`${(cur.populationCovered8min * 100).toFixed(0)}%`}
          optimized={`${(opt.populationCovered8min * 100).toFixed(0)}%`}
          delta="+17pp"
          accent="ok"
        />
        <KPICard
          col="col-span-12 md:col-span-4"
          title="STEMI Target Achievement"
          subtitle="FMC→Device <90 min"
          current={`${(cur.stemisMeetingFMC90 * 100).toFixed(0)}%`}
          optimized={`${(opt.stemisMeetingFMC90 * 100).toFixed(0)}%`}
          delta="+21pp"
          accent="ok"
        />
        <KPICard
          col="col-span-12 md:col-span-4"
          title="Lives Saved (annual)"
          subtitle="Excess deaths averted"
          current={`${cur.annualExcessDeaths}/yr deaths`}
          optimized={`${opt.annualExcessDeaths}/yr deaths`}
          delta={`+${opt.annualLivesSaved} saved`}
          accent="ok"
          big
        />
      </div>

      <Panel title="Identified Gap Zones · MEXCLP Output">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-slate-400">
              <th className="text-left py-2">Zone</th>
              <th className="text-right py-2">Population</th>
              <th className="text-right py-2">Current EMS</th>
              <th className="text-right py-2">Optimized</th>
              <th className="text-right py-2">Annual STEMIs</th>
              <th className="text-right py-2">Recommended Station</th>
              <th className="text-right py-2">Priority</th>
            </tr>
          </thead>
          <tbody>
            {COVERAGE_DATA.gapZones.map(z => (
              <tr key={z.id} className="border-t border-[#334155]">
                <td className="py-2.5 text-slate-100 font-medium">{z.label}</td>
                <td className="py-2.5 text-right metric-num">{z.population.toLocaleString()}</td>
                <td className="py-2.5 text-right metric-num text-[#ef4444]">{z.currentResponseMin} min</td>
                <td className="py-2.5 text-right metric-num text-[#22c55e]">{z.optimizedResponseMin} min</td>
                <td className="py-2.5 text-right metric-num">{z.annualSTEMIs}</td>
                <td className="py-2.5 text-right text-slate-300">{z.recommendedStation}</td>
                <td className="py-2.5 text-right">
                  <span className={[
                    'text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold',
                    z.priority === 'CRITICAL' ? 'bg-[#7f1d1d]/60 text-[#fecaca] border border-[#ef4444]/50' : 'bg-[#78350f]/60 text-[#fde68a] border border-[#f59e0b]/50',
                  ].join(' ')}>
                    {z.priority === 'CRITICAL' ? '🔴' : '🟠'} {z.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 lg:col-span-5" title="Investment Return · 2-Unit Expansion" accent="teal">
          <table className="w-full text-sm">
            <tbody>
              {[
                ['Capital investment (2 units)', `$${(opt.capitalCost / 1000).toFixed(0)}K`],
                ['Annual operating cost', `$${(opt.annualOpEx / 1000).toFixed(0)}K`],
                ['Annual revenue capture', `$${(opt.annualRevenueCapture / 1000).toFixed(0)}K`],
                ['Net annual contribution', `+$${(opt.netContribution / 1000).toFixed(0)}K`],
                ['Payback period', `${opt.paybackMonths} months`],
                ['Estimated lives saved (10yr)', '14–22'],
              ].map(([k, v]) => (
                <tr key={k} className="border-b border-[#334155]/60">
                  <td className="py-2 text-slate-300">{k}</td>
                  <td className="py-2 text-right metric-num text-slate-100 font-semibold">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel className="col-span-12 lg:col-span-7" title="36-Month Cumulative Cash Flow">
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={investment} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#475569" label={{ value: 'Month', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} stroke="#475569" label={{ value: '$K', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6 }}
                  formatter={(v, n) => [`$${v}K`, n]}
                  labelFormatter={(m) => `Month ${m}`}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
                <ReferenceLine x={24} stroke="#22c55e" strokeDasharray="4 2" label={{ value: 'Payback (m24)', fill: '#22c55e', fontSize: 10, position: 'top' }} />
                <ReferenceLine y={0} stroke="#475569" />
                <Line type="monotone" dataKey="revenue" name="Revenue capture" stroke="#22c55e" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="opex" name="Cumulative OpEx + Cap" stroke="#ef4444" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="net" name="Net (cumulative)" stroke="#14b8a6" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
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
                {role === 'stateDOH' && 'Population-level coverage and gap zones. Pairs with the Coverage Optimizer to justify capital and grant requests.'}
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

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col">
      <Header />
      <LayerToggle active={layer} onChange={setLayer} />

      <main className="flex-1 px-6 py-5 max-w-[1400px] w-full mx-auto">
        {layer === 'live_event'         && <LiveEventLayer />}
        {layer === 'prediction_models'  && <PredictionModelsLayer />}
        {layer === 'coverage_optimizer' && <CoverageOptimizerLayer />}
        {layer === 'dashboards'         && <RoleDashboardsLayer />}
        {layer === 'network_state'      && <NetworkStateLayer />}
      </main>

      <footer className="border-t border-[#334155] bg-[#0b1322] px-6 py-2.5 text-[11px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1 justify-between">
        <span>Data source: NCDR ACTION Registry + CathPCI</span>
        <span>Architecture: Stochastic Shortest-Path (M3)</span>
        <span>© 2026 STEMI-NI</span>
      </footer>
    </div>
  )
}
