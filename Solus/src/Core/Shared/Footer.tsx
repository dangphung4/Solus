import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Mail,
  Github,
  Info,
  Scale,
  Shield,
  Home,
} from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t bg-background relative overflow-hidden",
        className
      )}
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 -z-10" />

      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center shadow-md transition-all duration-300 group-hover:shadow-primary/20 group-hover:scale-110">
                <img src="/favicon.svg" alt="Solus Logo" className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold group-hover:text-primary transition-colors bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Solus
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-[300px] leading-relaxed">
              Singular clarity for every decision. AI-powered guidance to help
              you make better choices with confidence.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Link
                to="/privacy-policy"
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Privacy
                </div>
              </Link>
              <span className="text-muted-foreground/30">•</span>
              <Link
                to="/terms-of-service"
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                <div className="flex items-center gap-2">
                  <Scale className="h-3 w-3" />
                  Terms
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Navigation
            </h3>
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm text-muted-foreground group flex items-center gap-2 w-fit transition-colors hover:text-foreground"
              >
                <Home className="h-3 w-3" />
                <span className="group-hover:underline underline-offset-4">
                  Home
                </span>
                <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
              <Link
                to="/about-us"
                className="text-sm text-muted-foreground group flex items-center gap-2 w-fit transition-colors hover:text-foreground"
              >
                <Info className="h-3 w-3" />
                <span className="group-hover:underline underline-offset-4">
                  About Us
                </span>
                <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Get in Touch
            </h3>
            <a
              href="mailto:dangphung4@gmail.com"
              className="text-sm text-muted-foreground group flex items-center gap-2 w-fit transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              <span className="group-hover:underline underline-offset-4">
                dangphung4@gmail.com
              </span>
            </a>
            <div className="flex items-center gap-4 mt-2">
              <a
                href="https://github.com/dangphung4"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-16 pt-8 border-t border-muted">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-center text-sm text-muted-foreground">
              © {currentYear} Solus. All rights reserved.
            </p>

            <div className="text-xs text-muted-foreground/60 flex items-center gap-2">
              <span>Made with</span>
              <div className="relative">
                <span className="text-primary animate-pulse">♥</span>
              </div>
              <span>by Dang Phung</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
