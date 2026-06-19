import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import api from '../api/client'

const COLORS = ['#3498db','#e74c3c','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#34495e']

export default function Charts() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/reports/dashboard').then(r => setData(r.data))
  }, [])

  if (!data) return <p className="text-center py-12 text-gray-400">Carregando...</p>

  const statusData = [
    { name: 'Ativos',    value: Number(data.activeStudents) },
    { name: 'Inativos',  value: Number(data.inactiveStudents) },
    { name: 'Trancados', value: Number(data.lockedStudents) },
  ]

  const payData = [
    { name: 'Pagos',     value: Number(data.paidPayments) },
    { name: 'Pendentes', value: Number(data.pendingPayments) },
  ]

  const instrData = data.byInstrument.map(i => ({ name: i.instrument, alunos: Number(i.count) }))

  const Card = ({ label, value, color }) => (
    <div className={`bg-white border-l-4 rounded-xl shadow p-4 ${color}`}>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Relatórios & Gráficos</h2>

      <div className="grid grid-cols-4 gap-4">
        <Card label="Total de Alunos"     value={data.totalStudents}    color="border-blue-500" />
        <Card label="Alunos Ativos"       value={data.activeStudents}   color="border-green-500" />
        <Card label="Pagamentos Pendentes" value={data.pendingPayments} color="border-yellow-500" />
        <Card label="Recebido este mês"   value={`R$ ${Number(data.receivedThisMonth).toFixed(2)}`} color="border-purple-500" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Status dos Alunos</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Pagamentos do Mês</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={payData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                <Cell fill="#2ecc71" />
                <Cell fill="#e74c3c" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Alunos por Instrumento</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={instrData} margin={{ left: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="alunos" radius={[4,4,0,0]}>
              {instrData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
