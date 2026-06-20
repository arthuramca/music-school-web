import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Music, Lock, User, AlertCircle } from 'lucide-react'
import api from '../api/client'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem('token', data.token)
      navigate('/')
    } catch {
      setError('Usuário ou senha incorretos.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-slate-900">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gradient-to-br from-slate-800 to-blue-900 p-12">
        <div className="text-center text-white space-y-4">
          <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Music size={40} className="text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold">Music School</h1>
          <p className="text-slate-400 text-lg max-w-xs">Sistema de gestão completo para escolas de música</p>
          <div className="pt-8 space-y-3 text-left">
            {['Controle de alunos e matrículas','Agenda semanal de aulas','Gestão de pagamentos','Relatórios e gráficos'].map(f => (
              <div key={f} className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <div className="lg:hidden w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Music size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Bem-vindo de volta</h2>
            <p className="text-slate-400 text-sm mt-1">Entre com suas credenciais</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500"
                placeholder="Usuário"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500"
                placeholder="Senha"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
