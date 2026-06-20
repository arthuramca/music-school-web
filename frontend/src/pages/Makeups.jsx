import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import api from '../api/client'

export default function Makeups() {
  const [makeups, setMakeups] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() { const {data}=await api.get('/makeups/pending'); setMakeups(data); setLoading(false) }
  useEffect(()=>{load()},[])

  async function confirm(id) { await api.post(`/makeups/${id}/confirm`); load() }
  async function cancel(id)  { if(window.confirm('Cancelar reposição?')){ await api.delete(`/makeups/${id}`); load() } }

  const rowStyle = {borderBottom:'1px solid rgba(255,255,255,0.04)'}

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Reposições</h1><p className="page-subtitle">{makeups.length} pendente(s)</p></div>

      <div className="card overflow-hidden">
        {loading?(
          <div className="flex items-center justify-center py-16 text-slate-600 text-sm">Carregando...</div>
        ):(
          <table className="w-full">
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.03)'}}>
                <th className="th">Aluno</th><th className="th">Data</th>
                <th className="th">Dia / Hora</th><th className="th">Observações</th>
                <th className="th text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {makeups.map(m=>(
                <tr key={m.id} style={rowStyle}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                  onMouseLeave={e=>e.currentTarget.style.background=''}>
                  <td className="td font-semibold text-white">{m.student?.name}</td>
                  <td className="td text-slate-400">{m.scheduledDate||'—'}</td>
                  <td className="td"><span className="badge-blue">{m.dayOfWeek} {m.slotTime}</span></td>
                  <td className="td text-slate-500 text-xs">{m.notes||'—'}</td>
                  <td className="td">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={()=>confirm(m.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all border border-emerald-500/20">
                        <CheckCircle size={12}/>Confirmar
                      </button>
                      <button onClick={()=>cancel(m.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20">
                        <XCircle size={12}/>Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading&&makeups.length===0&&(
          <div className="flex flex-col items-center justify-center py-16 text-slate-700 gap-3">
            <RefreshCw size={36}/><p className="text-sm">Nenhuma reposição pendente</p>
          </div>
        )}
      </div>
    </div>
  )
}
