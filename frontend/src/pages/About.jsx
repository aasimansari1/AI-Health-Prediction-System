import { BrainCircuit, Code2, Database, Github, Server, Shield } from 'lucide-react'
import Disclaimer from '../components/Disclaimer.jsx'

const stack = [
  { icon: Code2, title: 'React + Vite + Tailwind', desc: 'Modern, responsive UI with dark mode and React Router navigation.' },
  { icon: Server, title: 'Flask REST API', desc: 'Lightweight Python backend exposing /predict, /symptoms, /diseases.' },
  { icon: BrainCircuit, title: 'Random Forest Classifier', desc: 'Trained with scikit-learn on a curated symptom-disease dataset.' },
  { icon: Database, title: 'Synthetic Training Data', desc: 'Generated from a disease-symptom mapping with controlled noise for robustness.' },
  { icon: Shield, title: 'Privacy-Friendly', desc: 'No personal data is stored on a server. History is kept in your browser only.' },
  { icon: Github, title: 'Open Source Friendly', desc: 'Clean, modular code and easy local setup — perfect for portfolios.' },
]

export default function About() {
  return (
    <div className="space-y-10">
      <section className="card p-8 sm:p-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          About <span className="bg-gradient-to-r from-brand-700 to-accent-600 dark:from-brand-300 dark:to-accent-400 bg-clip-text text-transparent">MediPredict</span>
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          MediPredict is an end-to-end demonstration of how machine learning can power preliminary
          health screening. A user selects symptoms; the trained model returns the most likely
          conditions ranked by confidence, along with descriptions and recommended precautions.
        </p>
        <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          The project covers the full stack — data preparation, model training, REST API, and a
          modern, accessible React user interface — and is intentionally simple to run locally.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-5">Tech stack</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stack.map((s) => (
            <div key={s.title} className="card p-6">
              <span className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-slate-700/60 grid place-items-center text-brand-700 dark:text-brand-300 mb-3">
                <s.icon size={22} />
              </span>
              <div className="font-semibold mb-1">{s.title}</div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-3">How predictions work</h2>
        <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-200">
          <li>The disease-symptom mapping is used to generate a synthetic training set with realistic noise.</li>
          <li>A Random Forest classifier is trained and persisted with joblib.</li>
          <li>When the user submits symptoms, the backend builds a binary feature vector and calls <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">predict_proba</code>.</li>
          <li>The top three classes by probability are returned, along with the description and precautions for the top match.</li>
        </ol>
      </section>

      <Disclaimer />
    </div>
  )
}
