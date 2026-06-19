import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Layout from './components/Layout'
import Students from './pages/Students'
import Agenda from './pages/Agenda'
import Makeups from './pages/Makeups'

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/students" replace />} />
        <Route path="students" element={<Students />} />
        <Route path="agenda"   element={<Agenda />} />
        <Route path="makeups"  element={<Makeups />} />
      </Route>
    </Routes>
  )
}
