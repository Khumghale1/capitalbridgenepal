import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  MessageSquare,
  Eye,
  FileText,
  Loader2,
  Banknote,
} from "lucide-react";
import { BusinessDashboardLayout } from "./BusinessDashboardLayout";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function BusinessDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [businessData, setBusinessData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [interests, setInterests] = useState<any[]>([]);
  const [totalInterests, setTotalInterests] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch business profile and interests in parallel
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [profileResponse, interestsResponse]: any[] = await Promise.all([
        api.businessProfile.getOwnProfile(),
        api.businessProfile.getOwnInterests({ limit: 5 })
      ]);

      // Handle both wrapped and unwrapped response
      const profile = profileResponse?.business || profileResponse;
      setBusinessData(profile);

      setInterests(interestsResponse?.data || []);
      setTotalInterests(interestsResponse?.pagination?.total || interestsResponse?.data?.length || 0);
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
       <div className="mb-2">
  <h2 className="text-3xl font-bold tracking-tight">
    Welcome,
  </h2>

  <div className="flex items-center gap-3 mt-1">
    <h2 className="text-3xl font-bold tracking-tight">
      {businessData?.name || 'Company'}
    </h2>

    {businessData?.status && (
      <Badge
        variant={
          businessData.status === 'APPROVED'
            ? 'default'
            : businessData.status === 'REJECTED'
            ? 'destructive'
            : 'secondary'
        }
      >
        {businessData.status}
      </Badge>
    )}

    {businessData?.isActive !== undefined && (
      <Badge variant={businessData.isActive ? 'outline' : 'destructive'}>
        {businessData.isActive ? 'Active' : 'Inactive'}
      </Badge>
    )}
  </div>
</div>

        <p className="text-muted-foreground">
          {businessData?.location || 'Nepal'}
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
            <div className="text-2xl font-bold">{totalInterests}</div>
            <p className="text-xs text-muted-foreground">
              Total inquiries received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Price Per Unit
            </CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businessData?.pricePerUnit ? `NPR ${Number(businessData.pricePerUnit).toLocaleString()}` : 'Not set'}
            </div>
            <p className="text-xs text-muted-foreground">
              Investment unit price
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Valuation
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businessData?.estimatedMarketValuation
                ? `NPR ${Number(businessData.estimatedMarketValuation).toLocaleString()}`
                : 'Not set'}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated market value
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
                interests.map((interest, index) => (
                  <div key={interest.id || index} className="flex items-center space-x-4 rounded-md border p-4">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {interest.investorName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {interest.email} • {interest.phoneNumber}
                      </p>
                      {interest.message && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          "{interest.message}"
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        interest.status === 'INTERESTED' ? 'default' :
                        interest.status === 'NOT_INTERESTED' ? 'destructive' : 'secondary'
                      }>
                        {interest.status?.replace('_', ' ') || 'NEW'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(interest.submittedAt || interest.createdAt).toLocaleDateString()}
                      </p>
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
              {interests.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => navigate('/business/dashboard/inquiries')}
                >
                  View All Inquiries
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Investment Info */}
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
              View Inquiries ({totalInterests})
            </Button>
          </CardContent>

          {/* Investment Parameters Summary */}
          {(businessData?.minimumInvestmentUnits || businessData?.maximumInvestmentUnits || businessData?.paidUpCapital) && (
            <>
              <CardHeader className="pt-2">
                <CardTitle className="text-base">Investment Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {businessData?.minimumInvestmentUnits && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Units:</span>
                    <span className="font-medium">{businessData.minimumInvestmentUnits}</span>
                  </div>
                )}
                {businessData?.maximumInvestmentUnits && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Units:</span>
                    <span className="font-medium">{businessData.maximumInvestmentUnits}</span>
                  </div>
                )}
                {businessData?.paidUpCapital && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid Up Capital:</span>
                    <span className="font-medium">{businessData.paidUpCapital}</span>
                  </div>
                )}
                {businessData?.expectedReturnOptions && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Returns:</span>
                    <span className="font-medium">{businessData.expectedReturnOptions}</span>
                  </div>
                )}
                {businessData?.ipoTimeHorizon && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IPO Timeline:</span>
                    <span className="font-medium">{businessData.ipoTimeHorizon}</span>
                  </div>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </BusinessDashboardLayout>
  );
}
