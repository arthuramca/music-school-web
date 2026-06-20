import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, AlertCircle, DollarSign } from 'lucide-react'
import api from '../api/client'

const COLORS = ['#7c3aed','#2563eb','#06b6d4','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-xl text-sm text-white" style={{ background:'#0d0d22', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'0 4px 20px rgba(0,0,0,0.5)' }}>
      {label && <p className="text-slate-400 text-xs mb-1">{label}</p>}
      {payload.map((p,i) => <p key={i}><span style={{color:p.color}}>{p.name||p.dataKey}: </span>{p.value}</p>)}
    </div>
  )
}

export default function Charts() {
  const [data, setData] = useState(null)
  useEffect(()=>{ api.get('/reports/dashboard').then(r=>setData(r.data)) },[])

  if (!data) return <div className="flex items-center justify-center h-64 text-slate-600 text-sm">Carregando...</div>

  const statusData = [
    {name:'Ativos',    value:+data.activeStudents},
    {name:'Inativos',  value:+data.inactiveStudents},
    {name:'Trancados', value:+data.lockedStudents},
  ].filter(d=>d.value>0)

  const payData = [
    {name:'Pagos',    value:+data.paidPayments},
    {name:'Pendentes',value:+data.pendingPayments},
  ].filter(d=>d.value>0)

  const instrData = data.byInstrument.filter(i=>+i.count>0)
    .map(i=>({name:i.instrument, alunos:+i.count})).sort((a,b)=>b.alunos-a.alunos)

  const stats = [
    {label:'Total de Alunos',    value:data.totalStudents,   icon:Users,        grad:'from-violet-600 to-violet-800',glow:'rgba(124,58,237,0.3)'},
    {label:'Alunos Ativos',      value:data.activeStudents,  icon:TrendingUp,   grad:'from-emerald-600 to-emerald-800',glow:'rgba(16,185,129,0.3)'},
    {label:'Pag. Pendentes',     value:data.pendingPayments, icon:AlertCircle,  grad:'from-amber-500 to-amber-700',glow:'rgba(245,158,11,0.3)'},
    {label:'Recebido este mês',  value:`R$ ${(+data.receivedThisMonth).toFixed(2)}`, icon:DollarSign, grad:'from-blue-600 to-blue-800',glow:'rgba(37,99,235,0.3)'},
  ]

  const cardStyle = { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.05)' }
  const chartBg   = { background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Relatórios</h1><p className="page-subtitle">Visão geral do sistema</p></div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map(({label,value,icon:Icon,grad,glow})=>(
          <div key={label} className="rounded-2xl p-5 flex items-center gap-4" style={cardStyle}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${grad}`}
              style={{boxShadow:`0 4px 20px ${glow}`}}>
              <Icon size={20} className="text-white"/>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={chartBg}>
          <h3 className="font-semibold text-slate-300 mb-4 text-sm">Status dos Alunos</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%"
              outerRadius={80} innerRadius={50} paddingAngle={3}
              label={({name,value})=>`${name} (${value})`} labelLine={false}>
              {statusData.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
            </Pie><Tooltip content={<CustomTooltip/>}/></PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-6" style={chartBg}>
          <h3 className="font-semibold text-slate-300 mb-4 text-sm">Situação dos Pagamentos</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart><Pie data={payData} dataKey="value" nameKey="name" cx="50%" cy="50%"
              outerRadius={80} innerRadius={50} paddingAngle={3}
              label={({name,value})=>`${name} (${value})`} labelLine={false}>
              <Cell fill="#10b981"/><Cell fill="#f59e0b"/>
            </Pie><Tooltip content={<CustomTooltip/>}/></PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl p-6" style={chartBg}>
        <h3 className="font-semibold text-slate-300 mb-4 text-sm">Alunos por Instrumento</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={instrData} barSize={28}>
            <XAxis dataKey="name" tick={{fontSize:12,fill:'#64748b'}} axisLine={false} tickLine={false}/>
            <YAxis allowDecimals={false} tick={{fontSize:12,fill:'#475569'}} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip/>} cursor={{fill:'rgba(255,255,255,0.03)'}}/>
            <Bar dataKey="alunos" radius={[6,6,0,0]}>
              {instrData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
