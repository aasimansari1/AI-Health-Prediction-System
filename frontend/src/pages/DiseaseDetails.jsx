import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Stethoscope } from 'lucide-react'
import { fetchDisease } from '../api/api.js'
import Spinner from '../components/Spinner.jsx'
import DiseaseIcon from '../components/DiseaseIcon.jsx'
import Disclaimer from '../components/Disclaimer.jsx'

export default function DiseaseDetails() {
  const { name } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchDisease(name)
      .then(setData)
      .catch(() => setError(`Could not load details for "${name}".`))
      .finally(() => setLoading(false))
  }, [name])

  if (loading) return <Spinner label="Loading details…" />
  if (error)
    return (
      <div className="card p-6 text-rose-700 dark:text-rose-300">
        {error}
        <div className="mt-3">
          <Link to="/diseases" className="btn-ghost">
            <ArrowLeft size={16} /> Back to catalogue
          </Link>
        </div>
      </div>
    )

  return (
    <div className="space-y-6">
      <Link to="/diseases" className="btn-ghost w-fit">
        <ArrowLeft size={16} /> Back to catalogue
      </Link>

      <section className="card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 grid place-items-center text-white shrink-0">
            <DiseaseIcon name={data.icon} size={28} />
          </span>
          <div>
            <h1 className="text-3xl font-bold">{data.disease}</h1>
            <span className="chip mt-2">{data.severity}</span>
          </div>
        </div>
        <p className="mt-5 text-slate-700 dark:text-slate-200 leading-relaxed">{data.description}</p>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="card p-6">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Stethoscope size={20} className="text-brand-600 dark:text-brand-300" /> Common symptoms
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.symptoms.map((s) => (
              <span key={s} className="chip">
                {s.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <ShieldCheck size={20} className="text-accent-500" /> Precautions
          </h2>
          <ul className="space-y-2">
            {data.precautions.map((p, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="mt-1 w-2 h-2 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 shrink-0" />
                <span className="text-slate-700 dark:text-slate-200">{p}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Disclaimer />
    </div>
  )
}
