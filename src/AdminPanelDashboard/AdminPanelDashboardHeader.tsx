import { useState, useEffect } from "react";
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
  Building2,
  CheckCircle,
  MessageSquare,
  LogOut,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AdminUser {
  username: string;
  email: string;
  role: string;
}

const navigation = [
  { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Business Inquiries", href: "/admin/dashboard/inquiries", icon: MessageSquare },
  { name: "Investment CRM", href: "/admin/dashboard/investment-inquiries", icon: Users },
  { name: "Pending Approvals", href: "/admin/dashboard/approvals", icon: CheckCircle },
  { name: "Active Businesses", href: "/admin/dashboard/businesses", icon: Building2 },
];

export function AdminPanelDashboardHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch admin data from localStorage
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
      try {
        const userData: AdminUser = JSON.parse(userDataString);
        setAdminData(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Generate initials from username
  const getInitials = (name: string) => {
    if (!name) return 'AD';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Handle logout
  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.clear(); // Clear any other localStorage items

    // Clear session storage as well
    sessionStorage.clear();

    // Call logout from auth context
    logout();

    // Redirect to home page
    navigate('/');
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
                  <span className="font-bold text-lg">Admin <span className="text-green-600">Panel</span></span>
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
                  <AvatarImage src="" alt={adminData?.username || "Admin"} />
                  <AvatarFallback>{adminData ? getInitials(adminData.username) : 'AD'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{adminData?.username || 'Admin User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{adminData?.email || 'admin@aarthiq.com'}</p>
                </div>
              </div>
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
          <span className="font-bold text-sm">Admin <span className="text-green-600">Panel</span></span>
        </Link>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-4">
          {/* User Menu (visible on larger screens) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="" alt={adminData?.username || "Admin"} />
                  <AvatarFallback>{adminData ? getInitials(adminData.username) : 'AD'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{adminData?.username || 'Admin User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {adminData?.email || 'admin@aarthiq.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
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
