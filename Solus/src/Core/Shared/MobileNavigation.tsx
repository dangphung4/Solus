import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export function MobileNavigation() {
  const [open, setOpen] = useState(false)
  const { user, signOut } = useAuth()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b pb-4">
            <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <img src="/favicon.svg" alt="Solus Logo" className="w-6 h-6" />
              <span className="font-bold">Solus</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-4 py-6">
            <Link 
              to="/features" 
              className="text-lg font-medium hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-lg font-medium hover:text-primary"
              onClick={() => setOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/pricing" 
              className="text-lg font-medium hover:text-primary"
              onClick={() => setOpen(false)}
            >
              Pricing
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className="text-lg font-medium hover:text-primary"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </nav>
          <div className="mt-auto border-t pt-4">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  {user.displayName && <p className="font-medium">{user.displayName}</p>}
                  {user.email && <p className="text-sm text-muted-foreground">{user.email}</p>}
                </div>
                <Link 
                  to="/profile" 
                  className="text-lg font-medium hover:text-primary"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    signOut()
                    setOpen(false)
                  }}
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
