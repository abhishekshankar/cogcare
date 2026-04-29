import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  [
    'shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors snap-start',
    isActive ? 'bg-forest text-white' : 'text-forest/70 hover:bg-surface',
  ].join(' ')

export function TabBar({ children }) {
  return (
    <div className="mx-auto max-w-5xl overflow-x-auto overscroll-x-contain px-4 pb-4 [-webkit-overflow-scrolling:touch] sm:px-6">
      <div className="flex w-max min-w-full flex-nowrap gap-2 pb-0.5 snap-x">{children}</div>
    </div>
  )
}

export function TabBarLink({ to, end, children }) {
  return (
    <NavLink to={to} end={end} className={linkClass}>
      {children}
    </NavLink>
  )
}
