import { useState, useEffect } from 'react'
import api from '../api/client'

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const TIMES = ['07:00', '08:00', '09:00', '10:00', '11:00', '13:00', '14:00',
               '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']

export default function Agenda() {
  const [grid, setGrid] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const promises = DAYS.flatMap(day =>
        TIMES.map(time => api.get('/students/slot', { params: { day, time } })
          .then(r => ({ day, time, students: r.data })))
      )
      const results = await Promise.all(promises)
      const g = {}
      results.forEach(({ day, time, students }) => {
        if (students.length > 0) g[`${day}-${time}`] = students
      })
      setGrid(g)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p className="text-center py-12 text-gray-500">Carregando agenda...</p>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Agenda Semanal</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-sm">
          <thead className="bg-[#2c3e50] text-white">
            <tr>
              <th className="px-3 py-2 w-20">Hora</th>
              {DAYS.map(d => <th key={d} className="px-3 py-2">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {TIMES.map((time, ti) => (
              <tr key={time} className={ti % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2 font-medium text-gray-500 border-r">{time}</td>
                {DAYS.map(day => {
                  const key = `${day}-${time}`
                  const students = grid[key] || []
                  return (
                    <td key={day} className="px-2 py-1 border-l min-w-[120px] align-top">
                      {students.map(s => (
                        <div key={s.id} className="text-xs bg-blue-100 text-blue-800 rounded px-1.5 py-0.5 mb-0.5 truncate">
                          {s.name} <span className="text-blue-500">({s.instrument})</span>
                        </div>
                      ))}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
