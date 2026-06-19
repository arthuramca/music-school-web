import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const nav = [
  { to: '/students', label: 'Alunos' },
  { to: '/agenda',   label: 'Agenda' },
  { to: '/makeups',  label: 'Reposições' },
  { to: '/waitlist', label: 'Fila de Espera' },
  { to: '/charts',   label: 'Relatórios' },
]

export default function Layout() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#2c3e50] text-white px-6 py-3 flex items-center gap-4">
        <span className="font-bold text-base tracking-wide whitespace-nowrap">🎵 Music School</span>
        <nav className="flex gap-1 flex-1 flex-wrap">
          {nav.map(n => (
            <NavLink key={n.to} to={n.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
                }`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="text-sm text-gray-300 hover:text-white transition-colors whitespace-nowrap">
          Sair
        </button>
      </header>
      <main className="flex-1 p-6 max-w-screen-2xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
