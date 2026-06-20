import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Clock } from 'lucide-react'
import api from '../api/client'
import ConfirmDialog from '../components/ConfirmDialog'

const INSTRUMENTS = ['Violão','Guitarra','Baixo','Bateria','Piano','Teclado','Flauta','Violino','Canto','Percussão','Outro']
const DAYS   = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
const STATUS = ['Aguardando','Contatado','Matriculado','Desistiu']
const empty  = { name:'', phone:'', email:'', instrument:'', preferredDay:'', preferredTime:'', notes:'' }
const statusBadge = s => ({'Aguardando':'badge-yellow','Contatado':'badge-blue','Matriculado':'badge-green','Desistiu':'badge-gray'}[s]??'badge-gray')

const rowStyle = {borderBottom:'1px solid rgba(255,255,255,0.04)'}

export default function Waitlist() {
  const [list, setList]       = useState([])
  const [form, setForm]       = useState(empty)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [filter, setFilter]   = useState('Todos')
  const [open, setOpen]       = useState(false)

  useEffect(()=>{load()},[])

  async function load() { const {data}=await api.get('/waitlist'); setList(data) }

  async function save() {
    if(editing) await api.put(`/waitlist/${editing}`,form)
    else        await api.post('/waitlist',form)
    setForm(empty); setEditing(null); setOpen(false); load()
  }

  function startEdit(e) {
    setEditing(e.id)
    setForm({name:e.name,phone:e.phone??'',email:e.email??'',instrument:e.instrument??'',
             preferredDay:e.preferredDay??'',preferredTime:e.preferredTime??'',notes:e.notes??''})
    setOpen(true)
  }

  const inp = k => ({value:form[k], onChange:ev=>setForm(f=>({...f,[k]:ev.target.value}))})
  const filtered = filter==='Todos'?list:list.filter(e=>e.status===filter)

  return (
    <div className="space-y-6">
      {confirm&&<ConfirmDialog message="Remover desta fila?" onCancel={()=>setConfirm(null)}
        onConfirm={async()=>{await api.delete(`/waitlist/${confirm}`);setConfirm(null);load()}}/>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Fila de Espera</h1>
          <p className="page-subtitle">{list.filter(e=>e.status==='Aguardando').length} aguardando vaga</p>
        </div>
        <button onClick={()=>{setEditing(null);setForm(empty);setOpen(true)}} className="btn-primary">
          <Plus size={15}/>Adicionar
        </button>
      </div>

      {/* Form panel */}
      {open&&(
        <div className="rounded-2xl p-5 space-y-4" style={{background:'rgba(124,58,237,0.06)',border:'1px solid rgba(124,58,237,0.2)'}}>
          <h3 className="font-semibold text-violet-300 text-sm">{editing?'Editar entrada':'Nova entrada'}</h3>
          <div className="grid grid-cols-4 gap-3">
            <input className="input" placeholder="Nome *" {...inp('name')}/>
            <input className="input" placeholder="Telefone" {...inp('phone')}/>
            <input className="input" placeholder="Email" {...inp('email')}/>
            <select className="input" {...inp('instrument')}>
              <option value="">Instrumento</option>
              {INSTRUMENTS.map(i=><option key={i}>{i}</option>)}
            </select>
            <select className="input" {...inp('preferredDay')}>
              <option value="">Dia preferido</option>
              {DAYS.map(d=><option key={d}>{d}</option>)}
            </select>
            <input className="input" placeholder="Horário preferido" {...inp('preferredTime')}/>
            <input className="input col-span-2" placeholder="Observações" {...inp('notes')}/>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={()=>setOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={save} disabled={!form.name} className="btn-primary disabled:opacity-40">
              {editing?'Atualizar':'Salvar'}
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['Todos',...STATUS].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={filter===s
              ? {background:'linear-gradient(135deg,#7c3aed,#2563eb)',color:'white',boxShadow:'0 2px 12px rgba(124,58,237,0.3)'}
              : {background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',color:'#64748b'}}>
            {s}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.03)'}}>
              <th className="th">Nome</th><th className="th">Contato</th>
              <th className="th">Instrumento</th><th className="th">Preferência</th>
              <th className="th">Status</th><th className="th">Data</th>
              <th className="th text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(e=>(
              <tr key={e.id} style={rowStyle} className="group"
                onMouseEnter={ev=>ev.currentTarget.style.background='rgba(255,255,255,0.02)'}
                onMouseLeave={ev=>ev.currentTarget.style.background=''}>
                <td className="td font-semibold text-white">{e.name}</td>
                <td className="td text-xs text-slate-500">
                  {e.phone&&<p>{e.phone}</p>}{e.email&&<p className="text-slate-600">{e.email}</p>}
                </td>
                <td className="td">{e.instrument?<span className="badge-blue">{e.instrument}</span>:<span className="text-slate-700">—</span>}</td>
                <td className="td text-xs text-slate-500">{e.preferredDay} {e.preferredTime}</td>
                <td className="td"><span className={statusBadge(e.status)}>{e.status}</span></td>
                <td className="td text-xs text-slate-600">{e.requestDate}</td>
                <td className="td">
                  <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={()=>startEdit(e)} className="w-7 h-7 flex items-center justify-center rounded-lg text-violet-400 hover:bg-violet-500/15 transition-all"><Pencil size={13}/></button>
                    <button onClick={()=>setConfirm(e.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-500/15 transition-all"><Trash2 size={13}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0&&(
          <div className="flex flex-col items-center justify-center py-16 text-slate-700 gap-3">
            <Clock size={36}/><p className="text-sm">Fila vazia</p>
          </div>
        )}
      </div>
    </div>
  )
}
