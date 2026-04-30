import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid gap-4 md:grid-cols-3 text-sm text-slate-600 dark:text-slate-400">
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-100 mb-1">MediPredict</div>
          <p>AI-driven preliminary symptom analysis for educational use.</p>
        </div>
        <div>
          <div className="font-bold text-slate-900 dark:text-slate-100 mb-1">Disclaimer</div>
          <p>This system is for educational purposes only and not a substitute for professional medical advice.</p>
        </div>
        <div className="md:text-right">
          <div className="flex items-center gap-1 md:justify-end">
            Built with <Heart size={14} className="text-rose-500" /> using React &amp; scikit-learn
          </div>
          <div className="mt-1">© {new Date().getFullYear()} MediPredict</div>
        </div>
      </div>
    </footer>
  )
}
