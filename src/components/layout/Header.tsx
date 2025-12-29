import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  "Tech Company",
  "Hydropower",
  "Fintech",
  "Edtech",
  "Manufacturing",
  "Tourism & Hospitality",
  "Agriculture",
  "Real Estate",
  "Healthcare",
  "Food & Beverage",
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between md:h-18">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">InvestNepal</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link to="/businesses">
            <Button
              variant="ghost"
              className={isActive("/businesses") ? "bg-secondary" : ""}
            >
              Browse Businesses
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-1">
                Categories <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 bg-popover">
              {categories.map((category) => (
                <DropdownMenuItem key={category} asChild>
                  <Link
                    to={`/businesses?category=${encodeURIComponent(category)}`}
                  >
                    {category}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/for-businesses">
            <Button
              variant="ghost"
              className={isActive("/for-businesses") ? "bg-secondary" : ""}
            >
              For Businesses
            </Button>
          </Link>

          <Link to="/how-it-works">
            <Button
              variant="ghost"
              className={isActive("/how-it-works") ? "bg-secondary" : ""}
            >
              How It Works
            </Button>
          </Link>

          <Link to="/about">
            <Button
              variant="ghost"
              className={isActive("/about") ? "bg-secondary" : ""}
            >
              About Us
            </Button>
          </Link>
        </nav>

        {/* Right Side Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/Login">
            <Button variant="outline" size="default">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="hero" size="default">
              List Your Business
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
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
            <Link
              to="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium transition-colors hover:bg-secondary"
            >
              Categories
            </Link>
            <Link
              to="/for-businesses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium transition-colors hover:bg-secondary"
            >
              For Businesses
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium transition-colors hover:bg-secondary"
            >
              How It Works
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium transition-colors hover:bg-secondary"
            >
              About Us
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              <Link to="/Login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="hero" className="w-full">
                  List Your Business
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
