import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedUserTypes: ("business" | "admin" | "investor")[];
  redirectTo: string;
}

export function ProtectedRoute({ children, allowedUserTypes, redirectTo }: ProtectedRouteProps) {
  const { isAuthenticated, userType, isLoading } = useAuth();

  // Wait for auth state to load from localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // If authenticated but wrong user type, redirect to appropriate page
  if (userType && !allowedUserTypes.includes(userType)) {
    // Redirect to their correct dashboard
    if (userType === "business") {
      return <Navigate to="/business/dashboard" replace />;
    } else if (userType === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userType === "investor") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}

// Specific protected route components for convenience
export function BusinessProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedUserTypes={["business"]} redirectTo="/business/login">
      {children}
    </ProtectedRoute>
  );
}

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedUserTypes={["admin"]} redirectTo="/admin/login">
      {children}
    </ProtectedRoute>
  );
}

export function InvestorProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedUserTypes={["investor"]} redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}
