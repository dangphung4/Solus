import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/lib/ThemeProvider'

// Pages
import LandingPage from '@/Core/Landing/LandingPage'
import LoginPage from '@/Core/Auth/LoginPage'
import SignUpPage from '@/Core/Auth/SignUpPage'
import DashboardPage from '@/Core/Dashboard/DashboardPage'
import ProfilePage from '@/Core/Profile/ProfilePage'
import NotFoundPage from '@/Core/Shared/NotFoundPage'
import { ProtectedRoute } from '@/Core/Shared/ProtectedRoute'
import AboutUsPage from '@/Core/Landing/AboutUsPage'
import PrivacyPolicyPage from '@/Core/Landing/PrivacyPolicyPage'
import TermsOfService from '@/Core/Landing/TermsOfService'
import QuickDecisionsPage from '@/Core/QuickDecisions/QuickDecisionsPage'
import DeepReflectionsPage from '@/Core/DeepReflections/DeepReflectionsPage'

// PWA Badge
import PWABadge from '@/PWABadge'
import { useEffect } from 'react'
import { RootLayout } from '@/RootLayout'
import ReflectionsPage from '@/Core/Reflections/ReflectionsPage'
function App() {

  const ScrollToTop = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);
    
    return null;
  };
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="solus-theme">
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route element={<RootLayout />}>

            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/quick-decisions" element={<QuickDecisionsPage />} />
              <Route path="/deep-reflections" element={<DeepReflectionsPage />} />
              <Route path="/reflections" element={<ReflectionsPage />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
        
        {/* Toast notifications */}
        <Toaster position="top-right" />
        
        {/* PWA Installation Badge */}
        <PWABadge />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
