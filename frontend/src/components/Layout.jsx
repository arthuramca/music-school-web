import { Outlet, NavLink, useNavigate } from 'react-router-dom'

const nav = [
  { to: '/students', label: 'Alunos' },
  { to: '/agenda',   label: 'Agenda' },
  { to: '/makeups',  label: 'Reposições' },
]

export default function Layout() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-[#2c3e50] text-white px-6 py-3 flex items-center gap-6">
        <span className="font-bold text-lg tracking-wide">🎵 Music School</span>
        <nav className="flex gap-1 flex-1">
          {nav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-500 text-white' : 'text-gray-300 hover:bg-white/10'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Sair
        </button>
      </header>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
