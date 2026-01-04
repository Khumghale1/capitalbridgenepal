import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  ArrowUpRight,
  FileText,
  Loader2,
} from "lucide-react";
import { BusinessDashboardLayout } from "./BusinessDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function BusinessDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState<any>(null);
  const [interests, setInterests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch business profile and interests in parallel
      const [profileResponse, interestsResponse] = await Promise.all([
        api.businessProfile.getOwnProfile(),
        api.businessProfile.getOwnInterests({ limit: 3 })
      ]);

      setBusinessData(profileResponse);
      setInterests(interestsResponse.data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <BusinessDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </BusinessDashboardLayout>
    );
  }

  return (
    <BusinessDashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.username || 'User'}!</h2>
        <p className="text-muted-foreground">
          Here's your business overview and latest updates.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profile Views
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessData?.viewCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total profile views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Investment Inquiries
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interests.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total inquiries received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Business Status
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {businessData?.status?.toLowerCase() || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Current approval status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Investment Needed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              NPR {businessData?.amountNeeded?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Target investment amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Inquiries */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Investment Inquiries</CardTitle>
            <CardDescription>
              Latest inquiries from potential investors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interests.length > 0 ? (
                interests.map((interest: any, index: number) => (
                  <div key={interest.id || index} className="flex items-center space-x-4 rounded-md border p-4">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Inquiry from {interest.investorName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {interest.email} • {interest.phoneNumber}
                      </p>
                      {interest.remarks && (
                        <p className="text-sm text-muted-foreground">
                          "{interest.remarks}"
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(interest.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No investment inquiries yet</p>
                  <p className="text-sm mt-2">Your profile is live and investors can submit inquiries</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your business profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="hero" onClick={() => navigate('/business/dashboard/profile')}>
              <FileText className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/business/dashboard/inquiries')}>
              <MessageSquare className="mr-2 h-4 w-4" />
              View Inquiries
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate('/business/dashboard/materials')}>
              <Users className="mr-2 h-4 w-4" />
              Upload Materials
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Profile Status */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your business details and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full ${businessData?.status === 'APPROVED' ? 'bg-green-500/10' : 'bg-yellow-500/10'} flex items-center justify-center`}>
                  <span className={`${businessData?.status === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'} font-bold`}>
                    {businessData?.status === 'APPROVED' ? '✓' : '!'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">Approval Status</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {businessData?.status?.toLowerCase() || 'N/A'}
                  </p>
                </div>
              </div>
              <span className={`text-sm font-medium ${businessData?.status === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                {businessData?.status === 'APPROVED' ? 'Approved' : 'Pending'}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full ${businessData?.businessName ? 'bg-green-500/10' : 'bg-yellow-500/10'} flex items-center justify-center`}>
                  <span className={`${businessData?.businessName ? 'text-green-600' : 'text-yellow-600'} font-bold`}>
                    {businessData?.businessName ? '✓' : '!'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">Business Information</p>
                  <p className="text-sm text-muted-foreground">
                    {businessData?.businessName || 'Not completed'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/business/dashboard/profile')}>
                {businessData?.businessName ? 'Update' : 'Complete'}
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full ${businessData?.description ? 'bg-green-500/10' : 'bg-yellow-500/10'} flex items-center justify-center`}>
                  <span className={`${businessData?.description ? 'text-green-600' : 'text-yellow-600'} font-bold`}>
                    {businessData?.description ? '✓' : '!'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">Business Description</p>
                  <p className="text-sm text-muted-foreground">
                    {businessData?.description ? 'Completed' : 'Add description'}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/business/dashboard/profile')}>
                {businessData?.description ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </BusinessDashboardLayout>
  );
}
