import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Clock } from 'lucide-react'
import api from '../api/client'
import ConfirmDialog from '../components/ConfirmDialog'

const INSTRUMENTS = ['Violão','Guitarra','Baixo','Bateria','Piano','Teclado','Flauta','Violino','Canto','Percussão','Outro']
const DAYS   = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
const STATUS = ['Aguardando','Contatado','Matriculado','Desistiu']
const empty  = { name:'', phone:'', email:'', instrument:'', preferredDay:'', preferredTime:'', notes:'' }

const statusBadge = s => ({
  Aguardando:  'badge-yellow',
  Contatado:   'badge-blue',
  Matriculado: 'badge-green',
  Desistiu:    'badge-gray',
}[s] ?? 'badge-gray')

export default function Waitlist() {
  const [list, setList]       = useState([])
  const [form, setForm]       = useState(empty)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [filter, setFilter]   = useState('Todos')
  const [open, setOpen]       = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await api.get('/waitlist'); setList(data)
  }

  async function save() {
    if (editing) await api.put(`/waitlist/${editing}`, form)
    else          await api.post('/waitlist', form)
    setForm(empty); setEditing(null); setOpen(false); load()
  }

  async function updateStatus(id, status) {
    await api.patch(`/waitlist/${id}/status`, { status }); load()
  }

  function startEdit(e) {
    setEditing(e.id)
    setForm({ name:e.name, phone:e.phone??'', email:e.email??'', instrument:e.instrument??'',
              preferredDay:e.preferredDay??'', preferredTime:e.preferredTime??'', notes:e.notes??'' })
    setOpen(true)
  }

  const inp = k => ({ value: form[k], onChange: ev => setForm(f => ({ ...f, [k]: ev.target.value })) })
  const filtered = filter === 'Todos' ? list : list.filter(e => e.status === filter)

  return (
    <div className="space-y-6">
      {confirm && <ConfirmDialog message="Remover desta fila?" onCancel={() => setConfirm(null)} onConfirm={async () => { await api.delete(`/waitlist/${confirm}`); setConfirm(null); load() }} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fila de Espera</h1>
          <p className="text-slate-500 text-sm mt-0.5">{list.filter(e => e.status === 'Aguardando').length} aguardando vaga</p>
        </div>
        <button onClick={() => { setEditing(null); setForm(empty); setOpen(true) }} className="btn-primary">
          <Plus size={16} /> Adicionar
        </button>
      </div>

      {/* Form panel */}
      {open && (
        <div className="card p-5 space-y-4 border-l-4 border-blue-500">
          <h3 className="font-semibold text-slate-700 text-sm">{editing ? 'Editar entrada' : 'Nova entrada'}</h3>
          <div className="grid grid-cols-4 gap-3">
            <input className="input" placeholder="Nome *" {...inp('name')} />
            <input className="input" placeholder="Telefone" {...inp('phone')} />
            <input className="input" placeholder="Email" {...inp('email')} />
            <select className="input" {...inp('instrument')}>
              <option value="">Instrumento</option>
              {INSTRUMENTS.map(i => <option key={i}>{i}</option>)}
            </select>
            <select className="input" {...inp('preferredDay')}>
              <option value="">Dia preferido</option>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
            <input className="input" placeholder="Horário preferido" {...inp('preferredTime')} />
            <input className="input col-span-2" placeholder="Observações" {...inp('notes')} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={save} disabled={!form.name} className="btn-primary disabled:opacity-40">
              {editing ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1">
        {['Todos', ...STATUS].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="th">Nome</th>
              <th className="th">Contato</th>
              <th className="th">Instrumento</th>
              <th className="th">Preferência</th>
              <th className="th">Status</th>
              <th className="th">Data</th>
              <th className="th text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(e => (
              <tr key={e.id} className="hover:bg-slate-50 transition-colors group">
                <td className="td font-semibold text-slate-800">{e.name}</td>
                <td className="td text-xs text-slate-500">
                  {e.phone && <p>{e.phone}</p>}
                  {e.email && <p className="text-slate-400">{e.email}</p>}
                </td>
                <td className="td">{e.instrument ? <span className="badge-blue">{e.instrument}</span> : <span className="text-slate-400">—</span>}</td>
                <td className="td text-xs text-slate-500">{e.preferredDay} {e.preferredTime}</td>
                <td className="td">
                  <select value={e.status} onChange={ev => updateStatus(e.id, ev.target.value)}
                    className="text-xs border-0 bg-transparent focus:ring-0 cursor-pointer font-medium text-slate-700 p-0">
                    {STATUS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="td text-xs text-slate-400">{e.requestDate}</td>
                <td className="td">
                  <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(e)} className="w-7 h-7 flex items-center justify-center rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => setConfirm(e.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
            <Clock size={32} className="text-slate-300" />
            <p className="text-sm">Fila vazia</p>
          </div>
        )}
      </div>
    </div>
  )
}
