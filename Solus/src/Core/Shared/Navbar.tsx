import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, Zap, Brain, LayoutDashboard, PencilLine } from 'lucide-react';
import { toast } from 'sonner';
import SolusLogo from '@/assets/solus-logo.svg';

/**
 * Navbar component that renders the navigation bar for the application.
 * It includes links to different sections of the app, user authentication controls,
 * and a responsive design that adjusts based on the user's scroll position.
 *
 * @returns {JSX.Element} The rendered Navbar component.
 *
 * @example
 * // Usage in a React component
 * import { Navbar } from './Navbar';
 *
 * function App() {
 *   return (
 *     <div>
 *       <Navbar />
 *       {/* Other components */
export function Navbar() {
  const { currentUser, logOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await logOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  // Get display name
  const getDisplayName = () => {
    if (currentUser?.displayName) return currentUser.displayName;
    return currentUser?.email?.split('@')[0] || 'User';
  };

  // Get avatar initial
  const getAvatarInitial = () => {
    if (currentUser?.displayName) return currentUser.displayName.charAt(0).toUpperCase();
    return currentUser?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 hidden md:block ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-md border-b' 
          : 'bg-background border-b border-transparent'
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={SolusLogo} alt="Solus Logo" className="w-8 h-8" />
            <span className="text-xl font-bold transition-colors duration-200 group-hover:text-primary">
              Solus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              {currentUser && (
                <>
                  <Link to="/quick-decisions">
                    <Button variant="ghost" className="rounded-full transition-all hover:bg-primary/10">
                      <Zap className="mr-2 h-4 w-4" />
                      Quick Decisions
                    </Button>
                  </Link>   

                  <Link to="/deep-reflections">
                    <Button variant="ghost" className="rounded-full transition-all hover:bg-primary/10">
                      <Brain className="mr-2 h-4 w-4" />
                      Deep Reflections
                    </Button>
                  </Link>

                  <Link to="/dashboard">
                    <Button variant="ghost" className="rounded-full transition-all hover:bg-primary/10">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>

                  <Link to="/reflections">
                    <Button variant="ghost" className="rounded-full transition-all hover:bg-primary/10">
                      <PencilLine className="mr-2 h-4 w-4" />
                      Journal
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              {currentUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:bg-muted/50">
                      <Avatar className="h-10 w-10 border-2 border-primary/10">
                        {currentUser.photoURL ? (
                          <AvatarImage 
                            src={currentUser.photoURL} 
                            alt={getDisplayName()} 
                            className="object-cover"
                          />
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getAvatarInitial()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem className="cursor-pointer">
                      <Link to="/quick-decisions">
                        <div className="flex items-center">
                          <Zap className="mr-2 h-4 w-4" />
                          <span>Quick Decisions</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link to="/deep-reflections">
                        <div className="flex items-center">
                          <Brain className="mr-2 h-4 w-4" />
                          <span>Deep Reflections</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/dashboard')}>
                      <div className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/reflections')}>
                      <div className="flex items-center">
                        <PencilLine className="mr-2 h-4 w-4" />
                        <span>Journal</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                
                    
                    <DropdownMenuItem onClick={handleSignOut}>
                      <div className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/about-us"
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    About Us
                  </Link>
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="rounded-full transition-all hover:bg-primary/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                      </svg>
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button 
                      size="sm"
                      className="rounded-full shadow-sm hover:shadow-md transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                      </svg>
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
} 