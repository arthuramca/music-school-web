import { useState, useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import api from '../api/client'

const DAYS  = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
const TIMES = ['07:00','08:00','09:00','10:00','11:00','13:00','14:00',
               '15:00','16:00','17:00','18:00','19:00','20:00','21:00']

const INSTR_COLORS = ['bg-blue-100 text-blue-700','bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700','bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700','bg-cyan-100 text-cyan-700']

export default function Agenda() {
  const [grid, setGrid]     = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const results = await Promise.all(
        DAYS.flatMap(day => TIMES.map(time =>
          api.get('/students/slot', { params: { day, time } }).then(r => ({ day, time, students: r.data }))
        ))
      )
      const g = {}
      results.forEach(({ day, time, students }) => { if (students.length) g[`${day}-${time}`] = students })
      setGrid(g); setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Carregando agenda...</div>
  )

  const colorFor = (name) => INSTR_COLORS[Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) % INSTR_COLORS.length]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Agenda Semanal</h1>
        <p className="text-slate-500 text-sm mt-0.5">Horários de todos os alunos ativos</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="th w-20">Hora</th>
                {DAYS.map(d => <th key={d} className="th text-center px-3">{d}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {TIMES.map(time => {
                const hasAny = DAYS.some(d => grid[`${d}-${time}`])
                if (!hasAny) return null
                return (
                  <tr key={time} className="hover:bg-slate-50/50">
                    <td className="td font-semibold text-slate-500 text-xs border-r border-slate-100">{time}</td>
                    {DAYS.map(day => {
                      const students = grid[`${day}-${time}`] || []
                      return (
                        <td key={day} className="px-2 py-2 border-l border-slate-100 align-top min-w-[130px]">
                          {students.map(s => (
                            <div key={s.id} className={`text-xs rounded-lg px-2 py-1 mb-1 font-medium truncate ${colorFor(s.name)}`} title={`${s.name} — ${s.instrument}`}>
                              {s.name}
                              <span className="font-normal opacity-70 ml-1 text-[10px]">{s.instrument}</span>
                            </div>
                          ))}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
          {Object.keys(grid).length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
              <CalendarDays size={32} className="text-slate-300" />
              <p className="text-sm">Nenhum aluno agendado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
