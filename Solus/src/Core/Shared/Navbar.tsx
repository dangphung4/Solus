import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { MobileNavigation } from "./MobileNavigation"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User } from "lucide-react"

export function Navbar() {
  const { user, signOut } = useAuth()
  
  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Solus Logo" className="w-8 h-8" />
            <span className="text-xl font-bold">Solus</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/features" className="text-sm font-medium hover:text-primary">
            Features
          </Link>
          <Link to="/how-it-works" className="text-sm font-medium hover:text-primary">
            How It Works
          </Link>
          <Link to="/pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
          {user && (
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                    <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.displayName && <p className="font-medium">{user.displayName}</p>}
                    {user.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}
