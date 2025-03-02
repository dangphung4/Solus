import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { currentUser, logOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Solus Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">Solus</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {currentUser && (
              <>
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {currentUser.email}
                </span>
                <Button variant="outline" size="sm" onClick={logOut}>
                  Log Out
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Solus
        </div>
      </footer>
    </div>
  );
} 