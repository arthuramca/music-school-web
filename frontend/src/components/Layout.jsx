import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Music, Users, CalendarDays, RefreshCw, Clock, BarChart3, LogOut, ChevronRight } from 'lucide-react'

const nav = [
  { to: '/students', label: 'Alunos',         icon: Users },
  { to: '/agenda',   label: 'Agenda',          icon: CalendarDays },
  { to: '/makeups',  label: 'Reposições',      icon: RefreshCw },
  { to: '/waitlist', label: 'Fila de Espera',  icon: Clock },
  { to: '/charts',   label: 'Relatórios',      icon: BarChart3 },
]

export default function Layout() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Music size={18} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Music School</p>
              <p className="text-slate-500 text-xs mt-0.5">Gestão completa</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }>
              {({ isActive }) => (
                <>
                  <Icon size={17} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={14} className="text-blue-300" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800">
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-all w-full group">
            <LogOut size={17} className="text-slate-500 group-hover:text-slate-300" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-screen-xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
