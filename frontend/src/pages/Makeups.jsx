import { useState, useEffect } from 'react'
import api from '../api/client'

export default function Makeups() {
  const [makeups, setMakeups] = useState([])

  async function load() {
    const { data } = await api.get('/makeups/pending')
    setMakeups(data)
  }

  useEffect(() => { load() }, [])

  async function confirm(id) {
    await api.post(`/makeups/${id}/confirm`)
    load()
  }

  async function cancel(id) {
    if (confirm('Cancelar reposição?')) {
      await api.delete(`/makeups/${id}`)
      load()
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Reposições Pendentes</h2>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#2c3e50] text-white">
            <tr>
              {['Aluno', 'Data', 'Dia/Hora', 'Observações', 'Ações'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {makeups.map((m, i) => (
              <tr key={m.id} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-4 py-2.5 font-medium">{m.student?.name}</td>
                <td className="px-4 py-2.5">{m.scheduledDate}</td>
                <td className="px-4 py-2.5">{m.dayOfWeek} {m.slotTime}</td>
                <td className="px-4 py-2.5 text-gray-500">{m.notes || '-'}</td>
                <td className="px-4 py-2.5 flex gap-2">
                  <button
                    onClick={() => confirm(m.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => cancel(m.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
            {makeups.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhuma reposição pendente.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
