import type { ReactNode } from "react";
import { AdminPanelDashboardSidebar } from "./AdminPanelDashboardSidebar";
import { AdminPanelDashboardHeader } from "./AdminPanelDashboardHeader";

interface AdminPanelDashboardLayoutProps {
  children: ReactNode;
}

export function AdminPanelDashboardLayout({ children }: AdminPanelDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <AdminPanelDashboardSidebar />

      {/* Main Content - Add left padding to account for fixed sidebar */}
      <div className="lg:pl-64">
        {/* Header */}
        <AdminPanelDashboardHeader />

        {/* Page Content */}
        <main className="container py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
