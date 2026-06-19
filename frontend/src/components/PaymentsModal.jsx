import { useState, useEffect } from 'react'
import Modal from './Modal'
import api from '../api/client'

const empty = { referenceMonth: '', amount: '', paidDate: '', status: 'Pendente', notes: '' }

export default function PaymentsModal({ student, onClose }) {
  const [payments, setPayments] = useState([])
  const [form, setForm]         = useState(empty)
  const [editing, setEditing]   = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await api.get(`/students/${student.id}/payments`)
    setPayments(data)
  }

  async function save() {
    const body = { ...form, amount: form.amount ? +form.amount : null }
    if (editing) await api.put(`/payments/${editing}`, body)
    else          await api.post(`/students/${student.id}/payments`, body)
    setForm(empty); setEditing(null); load()
  }

  async function remove(id) {
    if (window.confirm('Excluir pagamento?')) { await api.delete(`/payments/${id}`); load() }
  }

  function startEdit(p) {
    setEditing(p.id)
    setForm({ referenceMonth: p.referenceMonth, amount: p.amount ?? '', paidDate: p.paidDate ?? '',
              status: p.status, notes: p.notes ?? '' })
  }

  const inp = k => ({ value: form[k], onChange: e => setForm(f => ({ ...f, [k]: e.target.value })) })
  const cls = "border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"

  const statusBadge = s => s === 'Pago'
    ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'

  return (
    <Modal title={`Pagamentos — ${student.name}`} onClose={onClose} wide>
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-2 bg-gray-50 p-3 rounded-xl border">
          <input className={cls} placeholder="Referência (YYYY-MM)" {...inp('referenceMonth')} />
          <input className={cls} type="number" placeholder="Valor" step="0.01" {...inp('amount')} />
          <input className={cls} type="date" {...inp('paidDate')} />
          <select className={cls} {...inp('status')}>
            <option>Pendente</option><option>Pago</option><option>Isento</option>
          </select>
          <button onClick={save} className="bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 font-medium">
            {editing ? 'Atualizar' : '+ Adicionar'}
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-[#2c3e50] text-white">
            <tr>
              {['Referência','Valor','Pago em','Status',''].map(h =>
                <th key={h} className="px-3 py-2 text-left text-xs">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={p.id} className={`border-t ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-3 py-2">{p.referenceMonth}</td>
                <td className="px-3 py-2">{p.amount != null ? `R$ ${p.amount.toFixed(2)}` : '-'}</td>
                <td className="px-3 py-2">{p.paidDate || '-'}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-3 py-2 flex gap-1">
                  <button onClick={() => startEdit(p)} className="text-blue-500 hover:underline text-xs">Editar</button>
                  <button onClick={() => remove(p.id)} className="text-red-500 hover:underline text-xs">Excluir</button>
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-gray-400 text-sm">Nenhum pagamento.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}
