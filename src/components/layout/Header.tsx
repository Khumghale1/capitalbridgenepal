import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search } from "lucide-react";



export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/businesses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      {/* Desktop Header */}
      <div className="container relative flex h-16 items-center justify-between gap-4 md:h-18">
        {/* Logo - Left on Desktop, Centered on Mobile/Tablet */}
        <div className="flex-1 lg:flex-none">
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80 lg:justify-start justify-center"
          >
            <img
              src="/images/510be80db44060f3131651fdf4d26c58e86d4442.png"
              alt="aarthiQ Logo"
              className="h-10 w-10 md:h-12 md:w-12"
            />
            <span className="text-lg font-bold text-foreground md:text-xl">
              aarthi
              <span className="text-primary">Q</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/businesses">
            <Button variant="ghost">Browse Businesses</Button>
          </Link>
        </nav>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearch}
          className="relative hidden flex-1 lg:flex lg:max-w-md"
        >
          <input
            type="text"
            placeholder="Search businesses here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-full border border-gray-300 bg-white pl-6 pr-12 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary/90 transition-colors"
          >
            <Search className="h-4 w-4 text-white" />
          </button>
        </form>

        {/* Login Button - Desktop */}
        <div className="hidden lg:block">
          <Link to="/business/login">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Business Login
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

      {/* Mobile/Tablet Search Bar */}
      <div className="container pb-3 pt-2 lg:hidden">
        <form onSubmit={handleSearch} className="relative mx-auto w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search businesses here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-full border border-gray-300 bg-white pl-6 pr-12 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary hover:bg-primary/90 transition-colors"
          >
            <Search className="h-4 w-4 text-white" />
          </button>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="animate-fade-in border-t border-border bg-background lg:hidden">
          <nav className="container flex flex-col gap-2 py-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium transition-colors hover:bg-secondary"
            >
              Home
            </Link>
            <Link
              to="/businesses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 font-medium transition-colors hover:bg-secondary"
            >
              Browse Businesses
            </Link>
            <div className="mt-2 border-t border-border pt-4">
              <Link to="/business/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Business Login
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
