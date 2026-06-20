import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, AlertCircle, DollarSign } from 'lucide-react'
import api from '../api/client'

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#64748b']

export default function Charts() {
  const [data, setData] = useState(null)

  useEffect(() => { api.get('/reports/dashboard').then(r => setData(r.data)) }, [])

  if (!data) return (
    <div className="flex items-center justify-center h-64 text-slate-400 text-sm">Carregando...</div>
  )

  const statusData = [
    { name: 'Ativos',    value: Number(data.activeStudents) },
    { name: 'Inativos',  value: Number(data.inactiveStudents) },
    { name: 'Trancados', value: Number(data.lockedStudents) },
  ].filter(d => d.value > 0)

  const payData = [
    { name: 'Pagos',     value: Number(data.paidPayments) },
    { name: 'Pendentes', value: Number(data.pendingPayments) },
  ].filter(d => d.value > 0)

  const instrData = data.byInstrument
    .filter(i => Number(i.count) > 0)
    .map(i => ({ name: i.instrument, alunos: Number(i.count) }))
    .sort((a, b) => b.alunos - a.alunos)

  const stats = [
    { label: 'Total de Alunos',      value: data.totalStudents,    icon: Users,         color: 'bg-blue-500',    light: 'bg-blue-50 text-blue-600' },
    { label: 'Alunos Ativos',        value: data.activeStudents,   icon: TrendingUp,    color: 'bg-emerald-500', light: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pag. Pendentes',       value: data.pendingPayments,  icon: AlertCircle,   color: 'bg-amber-500',   light: 'bg-amber-50 text-amber-600' },
    { label: 'Recebido este mês',    value: `R$ ${Number(data.receivedThisMonth).toFixed(2)}`, icon: DollarSign, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Relatórios</h1>
        <p className="text-slate-500 text-sm mt-0.5">Visão geral do sistema</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, light }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${light} flex-shrink-0`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Status pie */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-700 mb-4 text-sm">Status dos Alunos</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={80} innerRadius={40}
                label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payments pie */}
        <div className="card p-6">
          <h3 className="font-semibold text-slate-700 mb-4 text-sm">Situação dos Pagamentos</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={payData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={80} innerRadius={40}
                label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar chart */}
      <div className="card p-6">
        <h3 className="font-semibold text-slate-700 mb-4 text-sm">Alunos por Instrumento</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={instrData} barSize={32}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,.07)' }} />
            <Bar dataKey="alunos" radius={[6,6,0,0]}>
              {instrData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
