import { AlertTriangle } from 'lucide-react'

export default function Disclaimer({ compact = false }) {
  return (
    <div
      className={`flex gap-3 rounded-2xl border ${
        compact ? 'p-3 text-xs' : 'p-4 text-sm'
      } border-amber-200 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200`}
    >
      <AlertTriangle size={compact ? 16 : 20} className="shrink-0 mt-0.5" />
      <p>
        <span className="font-semibold">Disclaimer: </span>
        This system is for educational purposes only and is not a substitute for professional medical advice,
        diagnosis, or treatment. Always seek the advice of a qualified healthcare provider.
      </p>
    </div>
  )
}
