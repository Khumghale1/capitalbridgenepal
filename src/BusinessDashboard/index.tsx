import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  ArrowUpRight,
  FileText,
} from "lucide-react";
import { BusinessDashboardLayout } from "./BusinessDashboardLayout";

export default function BusinessDashboard() {
  return (
    <BusinessDashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
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
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
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
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +5 new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Interested Investors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +8 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profile Completion
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Complete your profile
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
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Investment inquiry from John Doe
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Interested in NPR 500,000 investment - 2 hours ago
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  View
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-4 rounded-md border p-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Question about business model
                  </p>
                  <p className="text-sm text-muted-foreground">
                    From Jane Smith - 5 hours ago
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  View
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-4 rounded-md border p-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Request for financial documents
                  </p>
                  <p className="text-sm text-muted-foreground">
                    From Investment Group - 1 day ago
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  View
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
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
            <Button className="w-full" variant="hero">
              <FileText className="mr-2 h-4 w-4" />
              Update Profile
            </Button>
            <Button className="w-full" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              View Inquiries
            </Button>
            <Button className="w-full" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Upload Materials
            </Button>
            <Button className="w-full" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Profile Status */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Profile Status</CardTitle>
          <CardDescription>
            Complete your profile to attract more investors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <p className="font-medium">Basic Information</p>
                  <p className="text-sm text-muted-foreground">Company details completed</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">Complete</span>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">!</span>
                </div>
                <div>
                  <p className="font-medium">Financial Documents</p>
                  <p className="text-sm text-muted-foreground">Upload business plan and financials</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Complete</Button>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">!</span>
                </div>
                <div>
                  <p className="font-medium">Media Gallery</p>
                  <p className="text-sm text-muted-foreground">Add photos and videos of your business</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Complete</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </BusinessDashboardLayout>
  );
}
