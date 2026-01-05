import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building2,
  Users,
  CheckCircle,
  MessageSquare,
  ArrowUpRight,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalBusinesses: number;
  pendingApprovals: number;
  newInquiries: number;
  totalInterests: number;
}

interface PendingBusiness {
  id: string;
  businessName: string;
  sector: string;
  submittedAt: string;
}

export default function AdminPanelDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalBusinesses: 0,
    pendingApprovals: 0,
    newInquiries: 0,
    totalInterests: 0,
  });
  const [pendingBusinesses, setPendingBusinesses] = useState<PendingBusiness[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [businessesData, pendingData, inquiriesData, interestsData] = await Promise.all([
        api.businesses.getActive({ limit: 1 }),
        api.businesses.getPending({ limit: 3 }),
        api.onboarding.getAll({ limit: 1, status: 'PENDING' }),
        api.interests.getAll({ limit: 1 }),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const businesses = businessesData as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pending = pendingData as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inquiries = inquiriesData as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const interests = interestsData as any;

      setStats({
        totalBusinesses: businesses.pagination?.total || 0,
        pendingApprovals: pending.pagination?.total || 0,
        newInquiries: inquiries.pagination?.total || 0,
        totalInterests: interests.pagination?.total || 0,
      });

      setPendingBusinesses(pending.businesses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminPanelDashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Manage businesses, approvals, and platform operations
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading ? (
        <Card className="mb-8">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Businesses
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBusinesses}</div>
                <p className="text-xs text-muted-foreground">
                  Active on platform
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Approvals
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  New Inquiries
                </CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.newInquiries}</div>
                <p className="text-xs text-muted-foreground">
                  Pending onboarding
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Interests
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInterests}</div>
                <p className="text-xs text-muted-foreground">
                  Investor inquiries
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Main Content */}
      {!isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Pending Approvals */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Businesses waiting for review and approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingBusinesses.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No pending approvals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingBusinesses.map((business) => {
                    const isRecent = (new Date().getTime() - new Date(business.submittedAt).getTime()) / 3600000 < 24;

                    return (
                      <div key={business.id} className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium leading-none">
                              {business.businessName}
                            </p>
                            {isRecent && <Badge>New</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {business.sector} • Submitted {formatDate(business.submittedAt)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('/admin/dashboard/approvals')}
                        >
                          Review
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                variant="hero"
                onClick={() => navigate('/admin/dashboard/approvals')}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Review Approvals
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate('/admin/dashboard/businesses')}
              >
                <Building2 className="mr-2 h-4 w-4" />
                View All Businesses
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => navigate('/admin/dashboard/inquiries')}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Check Inquiries
              </Button>
              
            </CardContent>
          </Card>
        </div>
      )}
    </AdminPanelDashboardLayout>
  );
}
