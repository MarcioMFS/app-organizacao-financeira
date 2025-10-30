import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useDataStore } from './store/dataStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Reserves from './pages/Reserves'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, couple } = useAuthStore()
  const { fetchTransactions, fetchCategories, fetchReserves } = useDataStore()

  // Carregar dados quando o usuário está autenticado
  useEffect(() => {
    if (user && couple?.id) {
      fetchTransactions(couple.id)
      fetchCategories(couple.id)
      fetchReserves(couple.id)
    }
  }, [user, couple?.id, fetchTransactions, fetchCategories, fetchReserves])

  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />
}

function App() {
  const { user, initialized, initialize } = useAuthStore()

  // Inicializar autenticação ao montar o app
  useEffect(() => {
    initialize()
  }, [initialize])

  // Mostrar loading enquanto inicializa
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />

        <Route path="/transactions" element={
          <PrivateRoute><Transactions /></PrivateRoute>
        } />

        <Route path="/categories" element={
          <PrivateRoute><Categories /></PrivateRoute>
        } />

        <Route path="/reserves" element={
          <PrivateRoute><Reserves /></PrivateRoute>
        } />

        <Route path="/reports" element={
          <PrivateRoute><Reports /></PrivateRoute>
        } />

        <Route path="/settings" element={
          <PrivateRoute><Settings /></PrivateRoute>
        } />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}

export default App
