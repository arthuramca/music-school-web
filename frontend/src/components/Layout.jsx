import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Music2, Users, CalendarDays, RefreshCw, Clock, BarChart3, LogOut } from 'lucide-react'

const nav = [
  { to: '/students', label: 'Alunos',        icon: Users },
  { to: '/agenda',   label: 'Agenda',         icon: CalendarDays },
  { to: '/makeups',  label: 'Reposições',     icon: RefreshCw },
  { to: '/waitlist', label: 'Fila de Espera', icon: Clock },
  { to: '/charts',   label: 'Relatórios',     icon: BarChart3 },
]

export default function Layout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex bg-stage-950">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col relative"
        style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #08082a 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Subtle glow top */}
        <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.15), transparent 70%)' }} />

        {/* Logo */}
        <div className="px-5 py-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
              <Music2 size={17} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">Music School</p>
              <p className="text-slate-600 text-xs mt-0.5">Gestão</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px bg-white/[0.05] mb-3" />

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 relative">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative group ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(37,99,235,0.15))',
                border: '1px solid rgba(124,58,237,0.2)',
                boxShadow: '0 0 20px rgba(124,58,237,0.1)'
              } : {}}>
              {({ isActive }) => (
                <>
                  <Icon size={16} className={isActive ? 'text-violet-400' : 'text-slate-600 group-hover:text-slate-400'} />
                  {label}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" style={{ boxShadow: '0 0 6px rgba(167,139,250,0.8)' }} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/[0.05]">
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-slate-200 hover:bg-white/[0.05] transition-all w-full">
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top accent line */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(37,99,235,0.4), transparent)' }} />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-screen-xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
