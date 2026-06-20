import { useState, useEffect } from 'react'
import { Search, Plus, FileSpreadsheet, Pencil, Trash2, CreditCard, BookOpen, FileText, X, Users } from 'lucide-react'
import api from '../api/client'
import StudentForm from '../components/StudentForm'
import PaymentsModal from '../components/PaymentsModal'
import LessonsModal from '../components/LessonsModal'
import ConfirmDialog from '../components/ConfirmDialog'

const STATUS_OPTIONS = ['Todos', 'Ativo', 'Inativo', 'Trancado']
const statusBadge = s => ({ Ativo:'badge-green', Inativo:'badge-gray', Trancado:'badge-yellow' }[s] ?? 'badge-gray')

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
      const { data } = await api.get('/students', { params: { q: q||undefined, status: status!=='Todos'?status:undefined } })
      setStudents(data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [status])

  async function exportXlsx() {
    const res = await api.get('/reports/export/xlsx', { responseType: 'blob' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([res.data])); a.download = 'alunos.xlsx'; a.click()
  }

  async function downloadPdf(id) {
    const res = await api.get(`/reports/students/${id}/pdf`, { responseType: 'blob' })
    window.open(URL.createObjectURL(new Blob([res.data], { type:'application/pdf' })))
  }

  return (
    <div className="space-y-6">
      {form     && <StudentForm student={form===true?null:form} onClose={()=>setForm(null)} onSave={()=>{setForm(null);load()}} />}
      {payments && <PaymentsModal student={payments} onClose={()=>setPayments(null)} />}
      {lessons  && <LessonsModal  student={lessons}  onClose={()=>setLessons(null)} />}
      {confirm  && <ConfirmDialog message="Excluir este aluno permanentemente?" onCancel={()=>setConfirm(null)}
          onConfirm={async()=>{await api.delete(`/students/${confirm}`);setConfirm(null);load()}} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Alunos</h1>
          <p className="page-subtitle">{students.length} aluno(s) encontrado(s)</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportXlsx} className="btn-secondary"><FileSpreadsheet size={15}/>Exportar .xlsx</button>
          <button onClick={()=>setForm(true)} className="btn-primary"><Plus size={15}/>Novo Aluno</button>
        </div>
      </div>

      {/* Filtros */}
      <div className="card p-3 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input className="input pl-9 h-9" placeholder="Buscar aluno, instrumento..."
            value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&load()} />
        </div>
        <button onClick={load} className="btn-primary h-9 px-3">Buscar</button>
        {q && <button onClick={()=>{setQ('');load()}} className="text-slate-600 hover:text-slate-300 transition-colors"><X size={15}/></button>}
        <div className="flex gap-1 ml-auto">
          {STATUS_OPTIONS.map(s=>(
            <button key={s} onClick={()=>setStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                status===s ? 'text-white' : 'text-slate-500 bg-white/[0.04] border border-white/[0.06] hover:text-slate-200'
              }`}
              style={status===s ? {background:'linear-gradient(135deg,#7c3aed,#2563eb)',boxShadow:'0 2px 12px rgba(124,58,237,0.3)'} : {}}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-600 text-sm">Carregando...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)', background:'rgba(255,255,255,0.02)'}}>
                <th className="th">Nome</th><th className="th">Instrumento</th>
                <th className="th">Nível</th><th className="th">Professor</th>
                <th className="th">Horário</th><th className="th">Status</th>
                <th className="th">Mensalidade</th><th className="th text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s,i)=>(
                <tr key={s.id} className="group transition-colors"
                  style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                  onMouseLeave={e=>e.currentTarget.style.background=''}>
                  <td className="td font-semibold text-white">{s.name}</td>
                  <td className="td"><span className="text-slate-300">{s.instrument}</span>{s.instrument2&&<span className="text-slate-600 text-xs"> / {s.instrument2}</span>}</td>
                  <td className="td text-slate-500">{s.level}</td>
                  <td className="td text-slate-500">{s.teacher}</td>
                  <td className="td text-xs text-slate-500">
                    <span className="text-slate-400 font-medium">{s.lessonDay}</span> {s.lessonTime}
                    {s.lessonDay2&&<><br /><span className="text-slate-400 font-medium">{s.lessonDay2}</span> {s.lessonTime2}</>}
                  </td>
                  <td className="td"><span className={statusBadge(s.status)}>{s.status}</span></td>
                  <td className="td font-medium text-slate-300">{s.monthlyFee!=null?`R$ ${s.monthlyFee.toFixed(2)}`:<span className="text-slate-700">—</span>}</td>
                  <td className="td">
                    <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Btn icon={Pencil}     c="violet" title="Editar"     onClick={()=>setForm(s)} />
                      <Btn icon={CreditCard} c="emerald"title="Pagamentos" onClick={()=>setPayments(s)} />
                      <Btn icon={BookOpen}   c="blue"   title="Aulas"      onClick={()=>setLessons(s)} />
                      <Btn icon={FileText}   c="slate"  title="PDF"        onClick={()=>downloadPdf(s.id)} />
                      <Btn icon={Trash2}     c="red"    title="Excluir"    onClick={()=>setConfirm(s.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading&&students.length===0&&(
          <div className="flex flex-col items-center justify-center py-16 text-slate-700 gap-3">
            <Users size={36}/>
            <p className="text-sm">Nenhum aluno encontrado</p>
          </div>
        )}
      </div>
    </div>
  )
}

const BTN_COLORS = {
  violet: 'hover:bg-violet-500/15 text-violet-400',
  emerald:'hover:bg-emerald-500/15 text-emerald-400',
  blue:   'hover:bg-blue-500/15 text-blue-400',
  slate:  'hover:bg-slate-500/15 text-slate-400',
  red:    'hover:bg-red-500/15 text-red-400',
}
function Btn({icon:Icon,c,title,onClick}){
  return(
    <button onClick={onClick} title={title}
      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${BTN_COLORS[c]}`}>
      <Icon size={13}/>
    </button>
  )
}
