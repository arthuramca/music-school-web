import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import api from '../api/client'

export default function Makeups() {
  const [makeups, setMakeups] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await api.get('/makeups/pending')
    setMakeups(data); setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function confirm(id) {
    await api.post(`/makeups/${id}/confirm`); load()
  }

  async function cancel(id) {
    if (window.confirm('Cancelar esta reposição?')) { await api.delete(`/makeups/${id}`); load() }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Reposições</h1>
        <p className="text-slate-500 text-sm mt-0.5">{makeups.length} reposição(ões) pendente(s)</p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">Carregando...</div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="th">Aluno</th>
                <th className="th">Data Agendada</th>
                <th className="th">Dia / Hora</th>
                <th className="th">Observações</th>
                <th className="th text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {makeups.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="td font-semibold text-slate-800">{m.student?.name}</td>
                  <td className="td text-slate-600">{m.scheduledDate || <span className="text-slate-400">—</span>}</td>
                  <td className="td">
                    <span className="badge-blue">{m.dayOfWeek} {m.slotTime}</span>
                  </td>
                  <td className="td text-slate-500 text-xs">{m.notes || '—'}</td>
                  <td className="td">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => confirm(m.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-medium transition-colors">
                        <CheckCircle size={13} /> Confirmar
                      </button>
                      <button onClick={() => cancel(m.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors">
                        <XCircle size={13} /> Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && makeups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
            <RefreshCw size={32} className="text-slate-300" />
            <p className="text-sm">Nenhuma reposição pendente</p>
          </div>
        )}
      </div>
    </div>
  )
}
