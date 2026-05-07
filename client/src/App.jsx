import { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Dashboard from './components/Dashboard.jsx'
import UserProfile from './components/UserProfile.jsx'
import Team from './components/Team.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import SideNav from './components/SideNav.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { TaskProvider } from './context/TaskContext.jsx'
import api from './services/api'

function AppContent({ isAuthenticated, onLogin, onLogout }) {
  const location = useLocation()
  const hideSidebar = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <div className="min-h-screen flex bg-gray-100">
      {!hideSidebar && <SideNav onLogout={onLogout} />}

      <main className="flex-1 p-12">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Team />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => api.isAuthenticated())

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    api.logout()
    setIsAuthenticated(false)
  }

  return (
    <TaskProvider isAuthenticated={isAuthenticated}>
      <BrowserRouter>
        <AppContent isAuthenticated={isAuthenticated} onLogin={handleLogin} onLogout={handleLogout} />
      </BrowserRouter>
    </TaskProvider>
  )
}

export default App