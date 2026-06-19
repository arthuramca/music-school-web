import { useState, useEffect } from 'react'
import Modal from './Modal'
import api from '../api/client'

const INSTRUMENTS = ['Violão', 'Guitarra', 'Baixo', 'Bateria', 'Piano', 'Teclado',
  'Flauta', 'Violino', 'Viola', 'Cello', 'Cavaquinho', 'Ukulele', 'Saxofone',
  'Trompete', 'Canto', 'Percussão', 'Teoria Musical']
const LEVELS   = ['Iniciante', 'Intermediário', 'Avançado']
const STATUSES = ['Ativo', 'Inativo', 'Trancado']
const DAYS     = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const TIMES    = ['07:00','08:00','09:00','10:00','11:00','13:00','14:00',
                  '15:00','16:00','17:00','18:00','19:00','20:00','21:00']

const empty = {
  name:'', cpf:'', phone:'', email:'', address:'', birthDate:'',
  instrument:'', instrument2:'', level:'Iniciante', teacher:'',
  startDate:'', monthlyFee:'', paymentDueDay:'', status:'Ativo', notes:'',
  lessonDay:'', lessonTime:'', lessonDay2:'', lessonTime2:''
}

export default function StudentForm({ student, onSave, onClose }) {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (student) {
      setForm({
        ...empty, ...student,
        birthDate:  student.birthDate  || '',
        startDate:  student.startDate  || '',
        monthlyFee: student.monthlyFee ?? '',
        paymentDueDay: student.paymentDueDay ?? '',
      })
    }
  }, [student])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const inp  = k => ({ value: form[k] ?? '', onChange: e => set(k, e.target.value) })
  const sel  = k => ({ value: form[k] ?? '', onChange: e => set(k, e.target.value) })

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const body = { ...form, monthlyFee: form.monthlyFee ? +form.monthlyFee : null,
                               paymentDueDay: form.paymentDueDay ? +form.paymentDueDay : null }
      if (student?.id) await api.put(`/students/${student.id}`, body)
      else             await api.post('/students', body)
      onSave()
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ label, children }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
  const cls = "border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"

  return (
    <Modal title={student?.id ? 'Editar Aluno' : 'Novo Aluno'} onClose={onClose} wide>
      <form onSubmit={submit} className="space-y-5">
        <section>
          <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Dados Pessoais</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome *"><input required className={cls} {...inp('name')} /></Field>
            <Field label="CPF"><input className={cls} {...inp('cpf')} /></Field>
            <Field label="Telefone"><input className={cls} {...inp('phone')} /></Field>
            <Field label="Email"><input className={cls} type="email" {...inp('email')} /></Field>
            <Field label="Nascimento"><input className={cls} type="date" {...inp('birthDate')} /></Field>
            <div className="col-span-2">
              <Field label="Endereço"><input className={cls} {...inp('address')} /></Field>
            </div>
          </div>
        </section>

        <section>
          <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Aula — 1º Instrumento</p>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Instrumento">
              <select className={cls} {...sel('instrument')}>
                <option value="">Selecione</option>
                {INSTRUMENTS.map(i => <option key={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Nível">
              <select className={cls} {...sel('level')}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Professor"><input className={cls} {...inp('teacher')} /></Field>
            <Field label="Dia">
              <select className={cls} {...sel('lessonDay')}>
                <option value="">Selecione</option>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Horário">
              <select className={cls} {...sel('lessonTime')}>
                <option value="">Selecione</option>
                {TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
        </section>

        <section>
          <p className="text-xs font-bold text-purple-400 uppercase mb-3 tracking-widest">2º Instrumento / Horário (opcional)</p>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Instrumento 2">
              <select className={cls} {...sel('instrument2')}>
                <option value="">Nenhum</option>
                {INSTRUMENTS.map(i => <option key={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Dia 2">
              <select className={cls} {...sel('lessonDay2')}>
                <option value="">Selecione</option>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Horário 2">
              <select className={cls} {...sel('lessonTime2')}>
                <option value="">Selecione</option>
                {TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>
        </section>

        <section>
          <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Financeiro</p>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Mensalidade (R$)"><input className={cls} type="number" step="0.01" {...inp('monthlyFee')} /></Field>
            <Field label="Vencimento (dia)"><input className={cls} type="number" min="1" max="31" {...inp('paymentDueDay')} /></Field>
            <Field label="Início">          <input className={cls} type="date" {...inp('startDate')} /></Field>
          </div>
        </section>

        <section>
          <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Status & Observações</p>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Status">
              <select className={cls} {...sel('status')}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <div className="col-span-2">
              <Field label="Observações"><input className={cls} {...inp('notes')} /></Field>
            </div>
          </div>
        </section>

        <div className="flex gap-3 justify-end pt-2 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
            Cancelar
          </button>
          <button type="submit" disabled={saving}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium disabled:opacity-50">
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
