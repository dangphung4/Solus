import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Render the protected content
  return <Outlet />
} 