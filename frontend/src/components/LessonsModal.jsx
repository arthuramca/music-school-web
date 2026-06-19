import { useState, useEffect } from 'react'
import Modal from './Modal'
import api from '../api/client'

export default function LessonsModal({ student, onClose }) {
  const [lessons, setLessons] = useState([])
  const [stats, setStats]     = useState({})
  const [date, setDate]       = useState(new Date().toISOString().split('T')[0])
  const [attended, setAttended] = useState(true)
  const [notes, setNotes]     = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const [l, s] = await Promise.all([
      api.get(`/students/${student.id}/lessons`),
      api.get(`/students/${student.id}/lessons/stats`)
    ])
    setLessons(l.data); setStats(s.data)
  }

  async function add() {
    await api.post(`/students/${student.id}/lessons`, { lessonDate: date, attended, notes })
    setNotes(''); load()
  }

  async function remove(id) {
    if (window.confirm('Excluir aula?')) { await api.delete(`/lessons/${id}`); load() }
  }

  const cls = "border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"

  return (
    <Modal title={`Aulas — ${student.name}`} onClose={onClose} wide>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          {[['Total', stats.total], ['Presentes', stats.attended], ['Faltas', stats.missed]].map(([l, v]) => (
            <div key={l} className="bg-gray-50 border rounded-xl p-3">
              <p className="text-2xl font-bold text-[#2c3e50]">{v ?? 0}</p>
              <p className="text-xs text-gray-500">{l}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 items-end bg-gray-50 p-3 rounded-xl border">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500">Data</label>
            <input className={cls} type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Presença</label>
            <select className={cls} value={attended} onChange={e => setAttended(e.target.value === 'true')}>
              <option value="true">Presente</option>
              <option value="false">Faltou</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs text-gray-500">Observações</label>
            <input className={cls + " w-full"} value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <button onClick={add} className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-600 font-medium">
            + Registrar
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-[#2c3e50] text-white">
            <tr>
              {['Data','Presença','Observações',''].map(h =>
                <th key={h} className="px-3 py-2 text-left text-xs">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {lessons.map((l, i) => (
              <tr key={l.id} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-3 py-2">{l.lessonDate}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${l.attended ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {l.attended ? 'Presente' : 'Faltou'}
                  </span>
                </td>
                <td className="px-3 py-2 text-gray-500">{l.notes || '-'}</td>
                <td className="px-3 py-2">
                  <button onClick={() => remove(l.id)} className="text-red-500 hover:underline text-xs">Excluir</button>
                </td>
              </tr>
            ))}
            {lessons.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-gray-400">Nenhuma aula registrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}
