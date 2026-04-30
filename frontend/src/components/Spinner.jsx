export default function Spinner({ label = 'Analyzing symptoms…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100 dark:border-slate-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-600 border-r-accent-500 animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</p>
    </div>
  )
}
