import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react'
import DiseaseIcon from '../components/DiseaseIcon.jsx'
import Disclaimer from '../components/Disclaimer.jsx'

const SEVERITY_COLOR = {
  Mild: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Mild to Moderate': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Moderate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'Moderate to Severe': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  Severe: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
  Chronic: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  Unknown: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}

const BAR_COLORS = ['#1976f7', '#10b981', '#8b5cf6']

export default function Result() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('mp_last_result')
    if (!raw) {
      navigate('/symptoms')
      return
    }
    setData(JSON.parse(raw))
  }, [navigate])

  if (!data) return null

  const confidencePct = (data.confidence * 100).toFixed(1)
  const chartData = data.top_predictions.map((p) => ({
    name: p.disease,
    confidence: +(p.confidence * 100).toFixed(2),
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Prediction Results</h1>
        <button onClick={() => navigate('/symptoms')} className="btn-ghost">
          <RefreshCw size={16} /> Try again
        </button>
      </div>

      <section className="card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-brand-300/30 to-accent-400/30 blur-3xl pointer-events-none" />

        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 grid place-items-center text-white">
                <DiseaseIcon name={data.icon} size={26} />
              </span>
              <div>
                <div className="text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Most likely
                </div>
                <h2 className="text-2xl font-bold">{data.disease}</h2>
              </div>
            </div>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${SEVERITY_COLOR[data.severity] || SEVERITY_COLOR.Unknown}`}>
              {data.severity}
            </span>
            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">{data.description}</p>
            <Link
              to={`/diseases/${encodeURIComponent(data.disease)}`}
              className="mt-4 inline-flex items-center gap-1 text-brand-700 dark:text-brand-300 font-semibold hover:underline"
            >
              View full details <ArrowRight size={16} />
            </Link>
          </div>

          <div className="text-center">
            <div className="relative w-44 h-44 mx-auto">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="12" fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="url(#grad)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - data.confidence)}
                />
                <defs>
                  <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1976f7" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div>
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-brand-700 to-accent-600 bg-clip-text text-transparent">
                    {confidencePct}%
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Confidence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="card p-6">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent-500" /> Recommended precautions
          </h3>
          <ul className="space-y-2">
            {data.precautions.map((p, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="mt-1 w-2 h-2 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-200">{p}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6">
          <h3 className="font-semibold text-lg mb-3">Top 3 possibilities</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                <YAxis unit="%" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: 'rgba(25,118,247,0.08)' }}
                  formatter={(v) => [`${v}%`, 'Confidence']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                />
                <Bar dataKey="confidence" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-2">
            {data.top_predictions.map((p, i) => (
              <li key={p.disease} className="flex justify-between text-sm">
                <Link to={`/diseases/${encodeURIComponent(p.disease)}`} className="hover:text-brand-700 dark:hover:text-brand-300 font-medium">
                  {i + 1}. {p.disease}
                </Link>
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {(p.confidence * 100).toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {data.unknown_symptoms?.length > 0 && (
        <div className="card p-4 text-sm">
          <span className="font-semibold">Note: </span>
          The following symptoms were not recognised and were ignored:{' '}
          <span className="text-slate-600 dark:text-slate-300">{data.unknown_symptoms.join(', ')}</span>
        </div>
      )}

      <div className="card p-5">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold">Symptoms analysed: </span>
          {data.input_symptoms.map((s) => s.replace(/_/g, ' ')).join(', ')}
        </div>
      </div>

      <Disclaimer />
    </div>
  )
}
