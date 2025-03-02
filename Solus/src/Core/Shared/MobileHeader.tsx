import { Link } from 'react-router-dom';
import SolusLogo from '@/assets/solus-logo.svg';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { cn } from '@/lib/utils';

/**
 * A functional component that renders a sticky header for the mobile version of the application.
 * The header changes its appearance based on the scroll position of the window.
 *
 * @returns {JSX.Element} The rendered header component.
 *
 * @example
 * // Usage in a React component
 * import MobileHeader from './MobileHeader';
 *
 * function App() {
 *   return (
 *     <div>
 *       <MobileHeader />
 *       {/* Other components */
export function MobileHeader() {
  return (
    <header 
      className="relative bg-background/95 backdrop-blur-sm border-b border-border/40 md:hidden overflow-hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      {/* Gradient decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-4 top-1/2 h-8 w-[200px] bg-primary/10 rounded-full -translate-y-1/2 blur-3xl" />
        <div className="absolute -right-4 top-1/2 h-8 w-[200px] bg-primary/10 rounded-full -translate-y-1/2 blur-3xl" />
      </div>

      <div className="container px-4 mx-auto relative">
        <div className="flex items-center justify-between py-3">
          {/* Logo with enhanced animations */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-xl blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img 
                src={SolusLogo} 
                alt="Solus Logo" 
                className={cn(
                  "w-8 h-8 relative transition-all duration-300 ease-out",
                  "group-hover:scale-110 group-active:scale-95",
                  "group-hover:rotate-[360deg]"
                )}
              />
            </div>
            <span className={cn(
              "text-xl font-bold tracking-tight",
              "bg-gradient-to-r from-primary to-primary/70",
              "bg-clip-text text-transparent",
              "transition-all duration-300",
              "group-hover:tracking-wide"
            )}>
                
            </span>
          </Link>

          {/* Theme Toggle with enhanced container */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-lg opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 