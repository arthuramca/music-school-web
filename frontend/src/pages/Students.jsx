import { useState, useEffect } from 'react'
import api from '../api/client'
import StudentForm from '../components/StudentForm'
import PaymentsModal from '../components/PaymentsModal'
import LessonsModal from '../components/LessonsModal'
import ConfirmDialog from '../components/ConfirmDialog'

const STATUS_OPTIONS = ['Todos', 'Ativo', 'Inativo', 'Trancado']

const statusBadge = s => ({
  Ativo:    'bg-green-100 text-green-700',
  Inativo:  'bg-gray-100 text-gray-600',
  Trancado: 'bg-yellow-100 text-yellow-700',
}[s] ?? '')

export default function Students() {
  const [students, setStudents] = useState([])
  const [q, setQ]               = useState('')
  const [status, setStatus]     = useState('Todos')
  const [loading, setLoading]   = useState(false)
  const [form, setForm]         = useState(null)
  const [payments, setPayments] = useState(null)
  const [lessons, setLessons]   = useState(null)
  const [confirm, setConfirm]   = useState(null)

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/students', {
        params: { q: q || undefined, status: status !== 'Todos' ? status : undefined }
      })
      setStudents(data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [status])

  async function deleteStudent(id) {
    await api.delete(`/students/${id}`)
    load()
  }

  async function exportXlsx() {
    const res = await api.get('/reports/export/xlsx', { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a'); a.href = url; a.download = 'alunos.xlsx'; a.click()
  }

  async function downloadPdf(id) {
    const res = await api.get(`/reports/students/${id}/pdf`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    window.open(url)
  }

  return (
    <div className="space-y-4">
      {form     && <StudentForm student={form === true ? null : form} onClose={() => setForm(null)} onSave={() => { setForm(null); load() }} />}
      {payments && <PaymentsModal student={payments} onClose={() => setPayments(null)} />}
      {lessons  && <LessonsModal  student={lessons}  onClose={() => setLessons(null)} />}
      {confirm  && <ConfirmDialog message="Excluir aluno?" onCancel={() => setConfirm(null)} onConfirm={() => { deleteStudent(confirm); setConfirm(null) }} />}

      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-gray-800 flex-1">Alunos</h2>
        <div className="flex gap-2">
          <input className="border rounded-lg px-3 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Buscar..." value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
          <button onClick={load} className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600">Buscar</button>
          <button onClick={() => setQ('') || setStatus('Todos')} className="border px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Limpar</button>
        </div>
        <select className="border rounded-lg px-3 py-1.5 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={exportXlsx} className="border border-green-500 text-green-600 px-3 py-1.5 rounded-lg text-sm hover:bg-green-50">
          Exportar .xlsx
        </button>
        <button onClick={() => setForm(true)} className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-600 font-medium">
          + Novo Aluno
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-10">Carregando...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#2c3e50] text-white">
              <tr>
                {['Nome','Instrumento','Nível','Professor','Dia/Hora','Status','Mensalidade','Ações'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id} className={`border-t hover:bg-blue-50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-2.5 font-medium text-blue-600">{s.name}</td>
                  <td className="px-4 py-2.5">{s.instrument}{s.instrument2 ? ` / ${s.instrument2}` : ''}</td>
                  <td className="px-4 py-2.5">{s.level}</td>
                  <td className="px-4 py-2.5">{s.teacher}</td>
                  <td className="px-4 py-2.5 text-xs text-gray-600">
                    {s.lessonDay} {s.lessonTime}
                    {s.lessonDay2 && <><br />{s.lessonDay2} {s.lessonTime2}</>}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(s.status)}`}>{s.status}</span>
                  </td>
                  <td className="px-4 py-2.5">{s.monthlyFee != null ? `R$ ${s.monthlyFee.toFixed(2)}` : '-'}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1 flex-wrap">
                      <button onClick={() => setForm(s)}         className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Editar</button>
                      <button onClick={() => setPayments(s)}     className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">Pag.</button>
                      <button onClick={() => setLessons(s)}      className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200">Aulas</button>
                      <button onClick={() => downloadPdf(s.id)}  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">PDF</button>
                      <button onClick={() => setConfirm(s.id)}   className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-400">Nenhum aluno encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-400">{students.length} aluno(s)</p>
    </div>
  )
}
