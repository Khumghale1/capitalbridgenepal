import { ReactNode } from "react";
import { BusinessDashboardSidebar } from "./BusinessDashboardSidebar";
import { BusinessDashboardHeader } from "./BusinessDashboardHeader";

interface BusinessDashboardLayoutProps {
  children: ReactNode;
}

export function BusinessDashboardLayout({ children }: BusinessDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <BusinessDashboardSidebar />

      {/* Main Content - Add left padding to account for fixed sidebar */}
      <div className="lg:pl-64">
        {/* Header */}
        <BusinessDashboardHeader />

        {/* Page Content */}
        <main className="container py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
