import { useState, useEffect } from 'react'
import { Search, Plus, FileSpreadsheet, Pencil, Trash2, CreditCard, BookOpen, FileText, X } from 'lucide-react'
import api from '../api/client'
import StudentForm from '../components/StudentForm'
import PaymentsModal from '../components/PaymentsModal'
import LessonsModal from '../components/LessonsModal'
import ConfirmDialog from '../components/ConfirmDialog'

const STATUS_OPTIONS = ['Todos', 'Ativo', 'Inativo', 'Trancado']

const statusBadge = s => ({
  Ativo:    'badge-green',
  Inativo:  'badge-gray',
  Trancado: 'badge-yellow',
}[s] ?? 'badge-gray')

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
    <div className="space-y-6">
      {form     && <StudentForm student={form === true ? null : form} onClose={() => setForm(null)} onSave={() => { setForm(null); load() }} />}
      {payments && <PaymentsModal student={payments} onClose={() => setPayments(null)} />}
      {lessons  && <LessonsModal  student={lessons}  onClose={() => setLessons(null)} />}
      {confirm  && <ConfirmDialog message="Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita." onCancel={() => setConfirm(null)} onConfirm={() => { deleteStudent(confirm); setConfirm(null) }} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Alunos</h1>
          <p className="text-slate-500 text-sm mt-0.5">{students.length} aluno(s) encontrado(s)</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportXlsx} className="btn-secondary">
            <FileSpreadsheet size={16} />
            Exportar .xlsx
          </button>
          <button onClick={() => setForm(true)} className="btn-primary">
            <Plus size={16} />
            Novo Aluno
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card p-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Buscar aluno, instrumento..."
            value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
        </div>
        <button onClick={load} className="btn-primary py-2">Buscar</button>
        {q && <button onClick={() => { setQ(''); load() }} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={16} /></button>}
        <div className="flex gap-1 ml-auto">
          {STATUS_OPTIONS.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                status === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 text-sm">Carregando...</div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="th">Nome</th>
                <th className="th">Instrumento</th>
                <th className="th">Nível</th>
                <th className="th">Professor</th>
                <th className="th">Horário</th>
                <th className="th">Status</th>
                <th className="th">Mensalidade</th>
                <th className="th text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="td font-semibold text-slate-800">{s.name}</td>
                  <td className="td">
                    <span className="text-slate-700">{s.instrument}</span>
                    {s.instrument2 && <span className="text-slate-400 text-xs"> / {s.instrument2}</span>}
                  </td>
                  <td className="td text-slate-500">{s.level}</td>
                  <td className="td text-slate-500">{s.teacher}</td>
                  <td className="td text-xs text-slate-500">
                    <span className="font-medium text-slate-600">{s.lessonDay}</span> {s.lessonTime}
                    {s.lessonDay2 && <><br /><span className="font-medium text-slate-600">{s.lessonDay2}</span> {s.lessonTime2}</>}
                  </td>
                  <td className="td"><span className={statusBadge(s.status)}>{s.status}</span></td>
                  <td className="td font-medium text-slate-700">
                    {s.monthlyFee != null ? `R$ ${s.monthlyFee.toFixed(2)}` : <span className="text-slate-400">—</span>}
                  </td>
                  <td className="td">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionBtn icon={Pencil}      color="blue"   title="Editar"      onClick={() => setForm(s)} />
                      <ActionBtn icon={CreditCard}  color="green"  title="Pagamentos"  onClick={() => setPayments(s)} />
                      <ActionBtn icon={BookOpen}    color="purple" title="Aulas"       onClick={() => setLessons(s)} />
                      <ActionBtn icon={FileText}    color="slate"  title="Gerar PDF"   onClick={() => downloadPdf(s.id)} />
                      <ActionBtn icon={Trash2}      color="red"    title="Excluir"     onClick={() => setConfirm(s.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && students.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-2">
            <Search size={32} className="text-slate-300" />
            <p className="text-sm">Nenhum aluno encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ActionBtn({ icon: Icon, color, title, onClick }) {
  const colors = {
    blue:   'text-blue-500 hover:bg-blue-50',
    green:  'text-emerald-500 hover:bg-emerald-50',
    purple: 'text-purple-500 hover:bg-purple-50',
    slate:  'text-slate-500 hover:bg-slate-100',
    red:    'text-red-500 hover:bg-red-50',
  }
  return (
    <button onClick={onClick} title={title}
      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${colors[color]}`}>
      <Icon size={14} />
    </button>
  )
}
