import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Menu,
  LayoutDashboard,
  User,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { name: "Overview", href: "/business/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/business/dashboard/profile", icon: User },
  { name: "Investment Inquiries", href: "/business/dashboard/inquiries", icon: MessageSquare },
];

export function BusinessDashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Generate initials from username
  const getInitials = (name: string) => {
    if (!name) return 'BN';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0" aria-describedby={undefined}>
            <SheetHeader className="border-b px-6 py-4">
              <SheetTitle>
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <img
                    src="/images/mainlogo.png"
                    alt="aarthiQ Logo"
                    className="h-10 w-10"
                  />
                  <span className="font-bold text-lg">Business <span className="text-green-600">Dashboard</span></span>
                </Link>
              </SheetTitle>
            </SheetHeader>

            {/* Mobile Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
              <Separator className="mb-4" />
              <div className="flex items-center gap-3 mb-4 px-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={user?.username || "Business"} />
                  <AvatarFallback>{user ? getInitials(user.username) : 'BN'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.username || 'Business Name'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email || 'business@example.com'}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground mb-1"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/business/dashboard/settings");
                }}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-muted-foreground"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile Logo (visible on small screens) */}
        <Link to="/" className="flex items-center gap-2 lg:hidden">
          <img
            src="/images/mainlogo.png"
            alt="aarthiQ Logo"
            className="h-8 w-8"
          />
          <span className="font-bold text-sm">Business <span className="text-green-600">Dashboard</span></span>
        </Link>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-4">
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="" alt={user?.username || "Business"} />
                  <AvatarFallback>
                    {user ? getInitials(user.username) : "BN"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.username || "Business Name"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "business@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/business/dashboard/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/business/dashboard/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
