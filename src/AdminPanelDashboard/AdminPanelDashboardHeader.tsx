import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";

interface AdminUser {
  username: string;
  email: string;
  role: string;
}

export function AdminPanelDashboardHeader() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [adminData, setAdminData] = useState<AdminUser | null>(null);

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
      <div className="flex h-16 items-center gap-4 px-6 lg:ml-64">
        {/* Right Section */}
        <div className="ml-auto flex items-center gap-4">
         

          {/* User Menu */}
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
