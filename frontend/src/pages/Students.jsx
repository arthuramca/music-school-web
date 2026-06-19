import { useState, useEffect } from 'react'
import api from '../api/client'

const STATUS_OPTIONS = ['Todos', 'Ativo', 'Inativo', 'Trancado']

export default function Students() {
  const [students, setStudents] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('Todos')
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/students', { params: { q: q || undefined, status: status !== 'Todos' ? status : undefined } })
      setStudents(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [status])

  const statusColor = s => ({
    Ativo: 'bg-green-100 text-green-700',
    Inativo: 'bg-gray-100 text-gray-600',
    Trancado: 'bg-yellow-100 text-yellow-700',
  }[s] ?? '')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-gray-800 flex-1">Alunos</h2>
        <div className="flex gap-2">
          <input
            className="border rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar aluno, instrumento..."
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load()}
          />
          <button onClick={load} className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600">
            Buscar
          </button>
        </div>
        <select
          className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
        <button className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-600 font-medium">
          + Novo Aluno
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Carregando...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#2c3e50] text-white">
              <tr>
                {['Nome', 'Instrumento', 'Nível', 'Professor', 'Dia/Hora', 'Status', 'Mensalidade'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id} className={`border-t hover:bg-blue-50 cursor-pointer transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-2.5 font-medium text-blue-600">{s.name}</td>
                  <td className="px-4 py-2.5">{s.instrument}{s.instrument2 ? ` / ${s.instrument2}` : ''}</td>
                  <td className="px-4 py-2.5">{s.level}</td>
                  <td className="px-4 py-2.5">{s.teacher}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-600">
                    {s.lessonDay} {s.lessonTime}
                    {s.lessonDay2 && <><br />{s.lessonDay2} {s.lessonTime2}</>}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(s.status)}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    {s.monthlyFee != null ? `R$ ${s.monthlyFee.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Nenhum aluno encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
