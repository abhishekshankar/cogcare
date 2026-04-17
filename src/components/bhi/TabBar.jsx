import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors',
    isActive ? 'bg-[#3D4B3E] text-white' : 'text-[#3D4B3E]/70 hover:bg-[#F3EFE9]',
  ].join(' ')

export function TabBar({ children }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-wrap gap-2 px-4 pb-4 sm:px-6">{children}</div>
  )
}

export function TabBarLink({ to, end, children }) {
  return (
    <NavLink to={to} end={end} className={linkClass}>
      {children}
    </NavLink>
  )
}
