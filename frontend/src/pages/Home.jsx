import { Link } from 'react-router-dom'
import {
  Activity,
  BrainCircuit,
  ChevronRight,
  ListChecks,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react'
import Disclaimer from '../components/Disclaimer.jsx'

const features = [
  {
    icon: BrainCircuit,
    title: 'ML-Powered Predictions',
    desc: 'Random Forest classifier trained on a curated symptom-disease dataset.',
  },
  {
    icon: ListChecks,
    title: 'Top 3 Possibilities',
    desc: 'See the most likely conditions ranked by confidence with a probability chart.',
  },
  {
    icon: ShieldCheck,
    title: 'Precaution Guidance',
    desc: 'Each prediction includes a description and recommended precautions.',
  },
  {
    icon: Sparkles,
    title: 'Modern Experience',
    desc: 'Responsive design, dark mode, searchable symptoms, and instant results.',
  },
]

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden card p-8 sm:p-12">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-brand-300/40 to-accent-400/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-accent-400/30 to-brand-500/30 blur-3xl pointer-events-none" />

        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="chip mb-4">
              <Sparkles size={14} /> AI · Healthcare · Education
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-brand-700 to-accent-600 dark:from-brand-300 dark:to-accent-400 bg-clip-text text-transparent">
                Predict possible diseases
              </span>
              <br />
              from your symptoms.
            </h1>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-xl">
              MediPredict uses a trained machine-learning model to analyse your selected symptoms and
              suggest likely conditions, complete with a confidence score and recommended precautions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/symptoms" className="btn-primary">
                <Activity size={18} /> Start Diagnosis <ChevronRight size={18} />
              </Link>
              <Link to="/diseases" className="btn-ghost">
                Browse diseases
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="card p-6 rotate-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 grid place-items-center text-white">
                  <Stethoscope size={20} />
                </span>
                <div>
                  <div className="font-semibold">Symptom Analysis</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Sample preview</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Influenza (Flu)', pct: 87 },
                  { name: 'Common Cold', pct: 64 },
                  { name: 'COVID-19', pct: 41 },
                ].map((row) => (
                  <div key={row.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{row.name}</span>
                      <span className="text-brand-700 dark:text-brand-300 font-semibold">{row.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-accent-500"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold">Why MediPredict?</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Built end-to-end with a Python ML backend and a polished React UI.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card p-6 hover:scale-[1.02] transition">
              <span className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-slate-700/60 grid place-items-center text-brand-700 dark:text-brand-300 mb-4">
                <f.icon size={22} />
              </span>
              <div className="font-semibold mb-1">{f.title}</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Disclaimer />
    </div>
  )
}
