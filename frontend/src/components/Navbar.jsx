import { Link, NavLink } from 'react-router-dom'
import { Activity, Moon, Sun, Stethoscope } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/symptoms', label: 'Predict' },
  { to: '/diseases', label: 'Diseases' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/60 dark:border-slate-700/60">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 grid place-items-center text-white">
            <Stethoscope size={18} />
          </span>
          <span className="bg-gradient-to-r from-brand-700 to-accent-600 dark:from-brand-300 dark:to-accent-400 bg-clip-text text-transparent">
            MediPredict
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 dark:bg-slate-700/60 dark:text-brand-200'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/symptoms" className="hidden sm:inline-flex btn-primary py-2 px-4 text-sm">
            <Activity size={16} /> Start
          </Link>
        </div>
      </nav>
    </header>
  )
}
