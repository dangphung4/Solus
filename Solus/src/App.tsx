import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { Toaster } from 'sonner'

// Pages
import LandingPage from './Core/Landing/LandingPage'
import LoginPage from './Core/Auth/LoginPage'
import SignUpPage from './Core/Auth/SignUpPage'
import DashboardPage from './Core/Dashboard/DashboardPage'
import ProfilePage from './Core/Profile/ProfilePage'
import NotFoundPage from './Core/Shared/NotFoundPage'
import { ProtectedRoute } from './Core/Shared/ProtectedRoute'

// PWA Badge
import PWABadge from './PWABadge'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      
      {/* Toast notifications */}
      <Toaster position="top-right" />
      
      {/* PWA Installation Badge */}
      <PWABadge />
    </AuthProvider>
  )
}

export default App
