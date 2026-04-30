import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Mic, MicOff, Search, Sparkles, X } from 'lucide-react'
import { fetchSymptoms, predictDisease } from '../api/api.js'
import Spinner from '../components/Spinner.jsx'
import Disclaimer from '../components/Disclaimer.jsx'

export default function Symptoms() {
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [predicting, setPredicting] = useState(false)
  const [error, setError] = useState(null)
  const [listening, setListening] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchSymptoms()
      .then(setSymptoms)
      .catch(() =>
        setError('Could not reach the prediction server. Make sure the Flask backend is running on port 5000.'),
      )
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return symptoms
    const q = query.toLowerCase()
    return symptoms.filter((s) => s.label.toLowerCase().includes(q) || s.id.includes(q))
  }, [symptoms, query])

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser. Try Chrome or Edge.')
      return
    }
    const recog = new SpeechRecognition()
    recog.lang = 'en-US'
    recog.interimResults = false
    recog.continuous = false
    setListening(true)
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript.toLowerCase()
      // Try to match each spoken word against known symptoms
      const matches = symptoms.filter((s) => transcript.includes(s.label.toLowerCase()))
      if (matches.length) {
        setSelected((prev) => {
          const next = new Set(prev)
          matches.forEach((m) => next.add(m.id))
          return next
        })
      } else {
        setQuery(transcript)
      }
    }
    recog.onerror = () => setListening(false)
    recog.onend = () => setListening(false)
    recog.start()
  }

  const submit = async () => {
    if (selected.size === 0) {
      setError('Please select at least one symptom.')
      return
    }
    setError(null)
    setPredicting(true)
    try {
      const result = await predictDisease(Array.from(selected))
      // Persist for the result page and a small history feature
      sessionStorage.setItem('mp_last_result', JSON.stringify(result))
      const history = JSON.parse(localStorage.getItem('mp_history') || '[]')
      history.unshift({
        at: new Date().toISOString(),
        symptoms: Array.from(selected),
        disease: result.disease,
        confidence: result.confidence,
      })
      localStorage.setItem('mp_history', JSON.stringify(history.slice(0, 10)))
      navigate('/result')
    } catch (e) {
      setError('Prediction failed. Please verify the backend is running and try again.')
    } finally {
      setPredicting(false)
    }
  }

  if (loading) return <Spinner label="Loading symptom database…" />

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 card p-6">
        <header className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="text-accent-500" /> Tell us what you're feeling
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">
            Select all symptoms that apply. The more accurate your selection, the better the prediction.
          </p>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input-field pl-10"
              placeholder="Search symptoms (e.g. fever, headache)…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={startVoiceInput}
            className="btn-ghost border border-slate-200 dark:border-slate-700"
            aria-label="Voice input"
          >
            {listening ? <MicOff size={16} /> : <Mic size={16} />}
            {listening ? 'Listening…' : 'Voice'}
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 max-h-[28rem] overflow-y-auto scroll-soft pr-1">
          {filtered.map((s) => {
            const isOn = selected.has(s.id)
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 border text-left transition ${
                  isOn
                    ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-300 dark:border-brand-600 text-brand-800 dark:text-brand-200 shadow-sm'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-brand-300'
                }`}
              >
                <span className="font-medium">{s.label}</span>
                {isOn && <CheckCircle2 size={18} className="text-accent-500" />}
              </button>
            )
          })}
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-8">No symptoms match your search.</div>
          )}
        </div>
      </section>

      <aside className="card p-6 h-fit lg:sticky lg:top-24">
        <h2 className="font-semibold mb-3">Selected symptoms ({selected.size})</h2>
        {selected.size === 0 ? (
          <p className="text-sm text-slate-500">No symptoms selected yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-4">
            {Array.from(selected).map((id) => {
              const s = symptoms.find((x) => x.id === id)
              return (
                <span key={id} className="chip">
                  {s?.label || id}
                  <button onClick={() => toggle(id)} aria-label={`Remove ${s?.label}`}>
                    <X size={14} />
                  </button>
                </span>
              )
            })}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-200 dark:border-rose-700/40 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-200 text-sm p-3 mb-4">
            {error}
          </div>
        )}

        <button onClick={submit} disabled={predicting || selected.size === 0} className="btn-primary w-full">
          {predicting ? 'Predicting…' : 'Get Prediction'}
        </button>

        <button
          onClick={() => setSelected(new Set())}
          className="btn-ghost w-full mt-2"
          disabled={selected.size === 0}
        >
          Clear all
        </button>

        <div className="mt-5">
          <Disclaimer compact />
        </div>
      </aside>
    </div>
  )
}
