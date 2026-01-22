import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Home, Zap, Brain, LayoutDashboard, LogIn, PencilLine, HistoryIcon } from 'lucide-react';

/**
 * A functional component that renders a mobile navigation bar.
 * The navigation bar includes links to different sections of the application,
 * such as Home, Calendar, Dashboard, Settings, and Login/Sign In.
 * It also displays a theme toggle button and the user's avatar if logged in.
 *
 * @returns {JSX.Element} The rendered mobile navigation bar.
 *
 * @example
 * // Usage in a parent component
 * <MobileNav />
 *
 * @throws {Error} Throws an error if the user context is not available.
 */
export function MobileNavigation() {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  const isActive = (path: string) => location.pathname === path;

  // Get display name for avatar
  /**
   * Retrieves the display name of the current user.
   * If the user has a display name, it returns that.
   * Otherwise, it attempts to return the user's email prefix
   * (the part before the '@' symbol). If neither is available,
   * it defaults to returning 'User'.
   *
   * @returns {string} The display name of the user, or 'User' if not available.
   *
   * @example
   * const name = getDisplayName();
   * console.log(name); // Outputs the display name or 'User'
   *
   * @throws {Error} Throws an error if the currentUser is undefined.
   */
  const getDisplayName = () => {
    if (currentUser?.displayName) return currentUser.displayName;
    return currentUser?.email?.split('@')[0] || 'User';
  };

  // Get avatar initial
  /**
   * Retrieves the initial character for the user's avatar.
   *
   * The function checks if the current user has a display name.
   * If a display name exists, it returns the first character of the display name in uppercase.
   * If the display name does not exist, it checks the user's email and returns the first character of the email in uppercase.
   * If neither the display name nor the email is available, it defaults to returning 'U'.
   *
   * @returns {string} The uppercase initial character for the avatar, or 'U' if no valid initial can be determined.
   *
   * @example
   * // Assuming currentUser.displayName is 'John Doe'
   * getAvatarInitial(); // Returns 'J'
   *
   * @example
   * // Assuming currentUser.email is 'johndoe@example.com'
   * getAvatarInitial(); // Returns 'J'
   *
   * @example
   * // Assuming currentUser.displayName and currentUser.email are both undefined
   * getAvatarInitial(); // Returns 'U'
   */
  const getAvatarInitial = () => {
    if (currentUser?.displayName) return currentUser.displayName.charAt(0).toUpperCase();
    return currentUser?.email?.charAt(0).toUpperCase() || 'U';
  };

  const NavLink = ({ to, icon, label, isActive }: { to: string; icon: ReactNode; label: string; isActive: boolean }) => (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center justify-center w-full h-full text-xs transition-all duration-200 ease-in-out relative group",
        isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"
      )}
    >
      <div className={cn(
        "relative p-2 rounded-xl transition-all duration-200 ease-in-out transform group-hover:scale-110",
        isActive ? "bg-primary/10" : "group-hover:bg-primary/5"
      )}>
        {icon}
        {isActive && (
          <div className="absolute inset-0 rounded-xl bg-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
        )}
      </div>
      <span className={cn(
        "mt-1 font-medium tracking-wide transition-all duration-200",
        isActive ? "scale-105" : "group-hover:scale-105"
      )}>
        {label}
      </span>
      {isActive && (
        <div className="absolute -bottom-4 w-12 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full" />
      )}
    </Link>
  );

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border/50 z-40 md:hidden"
      style={{
        paddingBottom: 'max(5px, env(safe-area-inset-bottom))',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {currentUser ? (
          <>
            <NavLink 
              to="/quick-decisions"
              isActive={isActive('/quick-decisions')}
              label="Quick"
              icon={
                <Zap size={20} className="text-current" />
              }
            />

            <NavLink 
              to="/deep-reflections"
              isActive={isActive('/deep-reflections')}
              label="Deep"
              icon={
                <Brain size={20} className="text-current" />
              }
            />
            
            <NavLink 
              to="/reflections"
              isActive={isActive('/reflections')}
              label="Journal"
              icon={
                <PencilLine size={20} className="text-current" />
              }
            />
            
            <NavLink 
              to="/dashboard"
              isActive={isActive('/dashboard')}
              label="Dashboard"
              icon={
                <LayoutDashboard size={20} className="text-current" />
              }
            />

            <NavLink 
              to="/history"
              isActive={isActive('/history')}
              label="History"
              icon={
                <HistoryIcon size={20} className="text-current" />
              }
            />

            <NavLink 
              to="/profile"
              isActive={isActive('/profile')}
              label="Profile"
              icon={
                <div className="transform transition-transform duration-200 group-hover:scale-110">
                  <Avatar className="h-6 w-6 ring-2 ring-background">
                    {currentUser?.photoURL ? (
                      <AvatarImage 
                        src={currentUser.photoURL} 
                        alt={getDisplayName()} 
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getAvatarInitial()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
              }
            />
          </>
        ) : (
          <>
            <NavLink 
              to="/"
              isActive={isActive('/')}
              label="Home"
              icon={
                <Home size={20} className="text-current" />
              }
            />

            <NavLink 
              to="/login"
              isActive={isActive('/login')}
              label="Sign In"
              icon={
                <LogIn size={20} className="text-current" />
              }
            />
          </>
        )}
      </div>
    </div>
  );
} 