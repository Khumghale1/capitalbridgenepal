import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";



export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container relative flex h-16 items-center justify-center md:h-18">
        {/* Logo */}
        <Link
          to="/"
          className="absolute left-0 flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <img
            src="/images/mainlogo.png"
            alt="AarthiQ Logo"
            className="h-26 w-26 md:h-32 md:w-35"
          />
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link to="/businesses">
            <Button
              variant="ghost"
              className={isActive("/businesses") ? "bg-secondary" : ""}
            >
              Browse Businesses
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="animate-fade-in border-t border-border bg-background lg:hidden">
          <nav className="container flex flex-col gap-2 py-4">
            <Link
              to="/businesses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium transition-colors hover:bg-secondary"
            >
              Browse Businesses
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
