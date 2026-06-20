import { useState, useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import api from '../api/client'

const DAYS  = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
const TIMES = ['07:00','08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00']
const CHIPS = ['bg-violet-500/20 text-violet-300','bg-blue-500/20 text-blue-300',
               'bg-emerald-500/20 text-emerald-300','bg-amber-500/20 text-amber-300',
               'bg-rose-500/20 text-rose-300','bg-cyan-500/20 text-cyan-300']

function chipColor(name) {
  return CHIPS[Math.abs([...name].reduce((a,c)=>a+c.charCodeAt(0),0)) % CHIPS.length]
}

export default function Agenda() {
  const [grid, setGrid]       = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load() {
      const results = await Promise.all(DAYS.flatMap(day=>TIMES.map(time=>
        api.get('/students/slot',{params:{day,time}}).then(r=>({day,time,students:r.data})))))
      const g = {}
      results.forEach(({day,time,students})=>{ if(students.length) g[`${day}-${time}`]=students })
      setGrid(g); setLoading(false)
    }
    load()
  },[])

  const rowStyle = {borderBottom:'1px solid rgba(255,255,255,0.04)'}
  const cellStyle = {borderLeft:'1px solid rgba(255,255,255,0.04)'}

  if (loading) return <div className="flex items-center justify-center h-64 text-slate-600 text-sm">Carregando...</div>

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Agenda Semanal</h1><p className="page-subtitle">Horários de todos os alunos ativos</p></div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.03)'}}>
                <th className="th w-20 text-center">Hora</th>
                {DAYS.map(d=><th key={d} className="th text-center px-4">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {TIMES.map(time=>{
                const hasAny = DAYS.some(d=>grid[`${d}-${time}`])
                if (!hasAny) return null
                return (
                  <tr key={time} style={rowStyle}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <td className="td text-center font-semibold text-slate-600 text-xs" style={cellStyle}>{time}</td>
                    {DAYS.map(day=>{
                      const students = grid[`${day}-${time}`]||[]
                      return (
                        <td key={day} className="px-2 py-1.5 align-top min-w-[130px]" style={cellStyle}>
                          {students.map(s=>(
                            <div key={s.id} className={`text-xs rounded-lg px-2.5 py-1 mb-1 font-medium truncate ${chipColor(s.name)}`}
                              title={`${s.name} — ${s.instrument}`}>
                              {s.name}
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
          {Object.keys(grid).length===0&&(
            <div className="flex flex-col items-center justify-center py-16 text-slate-700 gap-3">
              <CalendarDays size={36}/><p className="text-sm">Nenhum aluno agendado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
