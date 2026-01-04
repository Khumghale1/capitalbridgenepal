import type { ReactNode } from "react";
import { AdminPanelDashboardSidebar } from "./AdminPanelDashboardSidebar";
import { AdminPanelDashboardHeader } from "./AdminPanelDashboardHeader";

interface AdminPanelDashboardLayoutProps {
  children: ReactNode;
}

export function AdminPanelDashboardLayout({ children }: AdminPanelDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <AdminPanelDashboardSidebar />

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <AdminPanelDashboardHeader />

          {/* Page Content */}
          <main className="container py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
