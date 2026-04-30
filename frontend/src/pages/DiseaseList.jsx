import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { fetchDiseases } from '../api/api.js'
import Spinner from '../components/Spinner.jsx'
import DiseaseIcon from '../components/DiseaseIcon.jsx'

export default function DiseaseList() {
  const [diseases, setDiseases] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDiseases()
      .then(setDiseases)
      .catch(() => setError('Could not load disease list. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return diseases
    const q = query.toLowerCase()
    return diseases.filter(
      (d) => d.disease.toLowerCase().includes(q) || d.description.toLowerCase().includes(q),
    )
  }, [diseases, query])

  if (loading) return <Spinner label="Loading disease catalogue…" />
  if (error)
    return (
      <div className="card p-6 text-rose-700 dark:text-rose-300">{error}</div>
    )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Disease catalogue</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-1">
          {diseases.length} conditions covered by the model. Click any card for details.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="input-field pl-10"
          placeholder="Search diseases…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((d) => (
          <Link
            key={d.disease}
            to={`/diseases/${encodeURIComponent(d.disease)}`}
            className="card p-5 hover:scale-[1.02] transition group"
          >
            <div className="flex items-start gap-3">
              <span className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-slate-700/60 grid place-items-center text-brand-700 dark:text-brand-300 group-hover:bg-gradient-to-br group-hover:from-brand-600 group-hover:to-accent-500 group-hover:text-white transition">
                <DiseaseIcon name={d.icon} size={22} />
              </span>
              <div className="flex-1">
                <div className="font-semibold">{d.disease}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{d.severity}</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 line-clamp-3">
              {d.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
