import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BusinessProtectedRoute, AdminProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Businesses from "./pages/Businesses";
import BusinessDetail from "./pages/BusinessDetail";
import ForBusinesses from "./pages/ForBusinesses";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Categories from "./pages/Categories";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

// Business Dashboard
import BusinessDashboard from "./BusinessDashboard";
import BusinessProfile from "./BusinessDashboard/Profile";
import BusinessInquiries from "./BusinessDashboard/InvestmentInquiries";
import BusinessMaterials from "./BusinessDashboard/Materials";
import BusinessSettings from "./BusinessDashboard/Settings";

// Admin Panel Dashboard
import AdminPanelDashboard from "./AdminPanelDashboard";
import AdminBusinessInquiries from "./AdminPanelDashboard/BusinessInquiries";
import AdminPendingApprovals from "./AdminPanelDashboard/PendingApprovals";
import AdminActiveBusinesses from "./AdminPanelDashboard/ActiveBusinesses";
import AdminRemovalRequests from "./AdminPanelDashboard/RemovalRequests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/businesses" element={<Businesses />} />
          <Route path="/businesses/:id" element={<BusinessDetail />} />
          <Route path="/for-businesses" element={<ForBusinesses />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/business/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />

          {/* Business Dashboard Routes */}
          <Route path="/business/dashboard" element={<BusinessProtectedRoute><BusinessDashboard /></BusinessProtectedRoute>} />
          <Route path="/business/dashboard/profile" element={<BusinessProtectedRoute><BusinessProfile /></BusinessProtectedRoute>} />
          <Route path="/business/dashboard/inquiries" element={<BusinessProtectedRoute><BusinessInquiries /></BusinessProtectedRoute>} />
          <Route path="/business/dashboard/materials" element={<BusinessProtectedRoute><BusinessMaterials /></BusinessProtectedRoute>} />
          <Route path="/business/dashboard/settings" element={<BusinessProtectedRoute><BusinessSettings /></BusinessProtectedRoute>} />

          {/* Admin Panel Dashboard Routes */}
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminPanelDashboard /></AdminProtectedRoute>} />
          <Route path="/admin/dashboard/inquiries" element={<AdminProtectedRoute><AdminBusinessInquiries /></AdminProtectedRoute>} />
          <Route path="/admin/dashboard/approvals" element={<AdminProtectedRoute><AdminPendingApprovals /></AdminProtectedRoute>} />
          <Route path="/admin/dashboard/businesses" element={<AdminProtectedRoute><AdminActiveBusinesses /></AdminProtectedRoute>} />
          <Route path="/admin/dashboard/RemovalRequests" element={<AdminProtectedRoute><AdminRemovalRequests /></AdminProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
