import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Navbar } from "./Navbar"

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold mt-6 mb-2">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </main>
    </div>
  )
} 