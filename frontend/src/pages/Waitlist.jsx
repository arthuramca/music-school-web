import { useState, useEffect } from 'react'
import api from '../api/client'
import ConfirmDialog from '../components/ConfirmDialog'

const INSTRUMENTS = ['Violão','Guitarra','Baixo','Bateria','Piano','Teclado',
  'Flauta','Violino','Canto','Percussão','Outro']
const DAYS = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado']
const STATUS = ['Aguardando','Contatado','Matriculado','Desistiu']

const empty = { name:'', phone:'', email:'', instrument:'', preferredDay:'', preferredTime:'', notes:'' }

const statusColor = s => ({
  Aguardando:  'bg-yellow-100 text-yellow-700',
  Contatado:   'bg-blue-100 text-blue-700',
  Matriculado: 'bg-green-100 text-green-700',
  Desistiu:    'bg-gray-100 text-gray-600',
}[s] ?? '')

export default function Waitlist() {
  const [list, setList]       = useState([])
  const [form, setForm]       = useState(empty)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [filter, setFilter]   = useState('Todos')

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await api.get('/waitlist')
    setList(data)
  }

  async function save() {
    if (editing) await api.put(`/waitlist/${editing}`, form)
    else          await api.post('/waitlist', form)
    setForm(empty); setEditing(null); load()
  }

  async function updateStatus(id, status) {
    await api.patch(`/waitlist/${id}/status`, { status }); load()
  }

  async function remove(id) {
    await api.delete(`/waitlist/${id}`); setConfirm(null); load()
  }

  function startEdit(e) {
    setEditing(e.id)
    setForm({ name: e.name, phone: e.phone ?? '', email: e.email ?? '',
              instrument: e.instrument ?? '', preferredDay: e.preferredDay ?? '',
              preferredTime: e.preferredTime ?? '', notes: e.notes ?? '' })
  }

  const inp = k => ({ value: form[k], onChange: ev => setForm(f => ({ ...f, [k]: ev.target.value })) })
  const cls = "border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"

  const filtered = filter === 'Todos' ? list : list.filter(e => e.status === filter)

  return (
    <div className="space-y-4">
      {confirm && <ConfirmDialog message="Remover da fila?" onCancel={() => setConfirm(null)} onConfirm={() => remove(confirm)} />}

      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-gray-800 flex-1">Fila de Espera</h2>
        <select className="border rounded-lg px-3 py-1.5 text-sm" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>Todos</option>
          {STATUS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl shadow p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-600">{editing ? 'Editar entrada' : 'Nova entrada'}</p>
        <div className="grid grid-cols-4 gap-3">
          <input className={cls} placeholder="Nome *" {...inp('name')} />
          <input className={cls} placeholder="Telefone" {...inp('phone')} />
          <input className={cls} placeholder="Email" {...inp('email')} />
          <select className={cls} {...inp('instrument')}>
            <option value="">Instrumento</option>
            {INSTRUMENTS.map(i => <option key={i}>{i}</option>)}
          </select>
          <select className={cls} {...inp('preferredDay')}>
            <option value="">Dia preferido</option>
            {DAYS.map(d => <option key={d}>{d}</option>)}
          </select>
          <input className={cls} placeholder="Horário preferido" {...inp('preferredTime')} />
          <input className={`${cls} col-span-2`} placeholder="Observações" {...inp('notes')} />
        </div>
        <div className="flex gap-2 justify-end">
          {editing && <button onClick={() => { setEditing(null); setForm(empty) }} className="border px-4 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>}
          <button onClick={save} disabled={!form.name} className="bg-blue-500 text-white px-5 py-1.5 rounded-lg text-sm hover:bg-blue-600 font-medium disabled:opacity-40">
            {editing ? 'Atualizar' : 'Adicionar'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#2c3e50] text-white">
            <tr>
              {['Nome','Contato','Instrumento','Dia/Hora','Status','Data','Ações'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => (
              <tr key={e.id} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-4 py-2 font-medium">{e.name}</td>
                <td className="px-4 py-2 text-xs text-gray-600">{e.phone}<br />{e.email}</td>
                <td className="px-4 py-2">{e.instrument || '-'}</td>
                <td className="px-4 py-2 text-xs">{e.preferredDay} {e.preferredTime}</td>
                <td className="px-4 py-2">
                  <select
                    value={e.status}
                    onChange={ev => updateStatus(e.id, ev.target.value)}
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border-0 focus:ring-1 ${statusColor(e.status)}`}
                  >
                    {STATUS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-2 text-xs text-gray-400">{e.requestDate}</td>
                <td className="px-4 py-2 flex gap-1">
                  <button onClick={() => startEdit(e)} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Editar</button>
                  <button onClick={() => setConfirm(e.id)} className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">Remover</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Fila vazia.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
