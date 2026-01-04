import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  FolderOpen,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Overview", href: "/business/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/business/dashboard/profile", icon: User },
  { name: "Investment Inquiries", href: "/business/dashboard/inquiries", icon: MessageSquare },
  { name: "Materials & Media", href: "/business/dashboard/materials", icon: FolderOpen },
];

export function BusinessDashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">AQ</span>
          </div>
          <span className="font-bold text-lg">Aarthi<span className="text-green-600">Q</span></span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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

      {/* Bottom Section */}
      <div className="p-4 space-y-2">
        <Separator className="mb-4" />
        <Link to="/business/dashboard/settings">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
