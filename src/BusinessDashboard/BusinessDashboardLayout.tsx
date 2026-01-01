import { ReactNode } from "react";
import { BusinessDashboardSidebar } from "./BusinessDashboardSidebar";
import { BusinessDashboardHeader } from "./BusinessDashboardHeader";

interface BusinessDashboardLayoutProps {
  children: ReactNode;
}

export function BusinessDashboardLayout({ children }: BusinessDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <BusinessDashboardSidebar />

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <BusinessDashboardHeader />

          {/* Page Content */}
          <main className="container py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
