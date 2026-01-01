import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  CheckCircle,
  XCircle,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";

export default function AdminPanelDashboard() {
  return (
    <AdminPanelDashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">
          Manage businesses, approvals, and platform operations
        </p>
      </div>

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
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 this month
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
            <div className="text-2xl font-bold">8</div>
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
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              +5 this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">
              +45 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
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
            <div className="space-y-4">
              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">
                      Tech Innovations Nepal
                    </p>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Technology • Submitted 2 hours ago
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Review
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none">
                      Organic Farms Co.
                    </p>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Agriculture • Submitted 5 hours ago
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Review
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Himalayan Textiles
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Manufacturing • Submitted 1 day ago
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Review
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
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="hero">
              <CheckCircle className="mr-2 h-4 w-4" />
              Review Approvals
            </Button>
            <Button className="w-full" variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              View All Businesses
            </Button>
            <Button className="w-full" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Check Inquiries
            </Button>
            <Button className="w-full" variant="outline">
              <XCircle className="mr-2 h-4 w-4" />
              Removal Requests
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Stats */}
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest platform activities and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">Business Approved</p>
                  <p className="text-muted-foreground">Tech Startup Nepal - 1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Building2 className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">New Business Inquiry</p>
                  <p className="text-muted-foreground">Coffee Export Co. - 3 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <XCircle className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="font-medium">Removal Request</p>
                  <p className="text-muted-foreground">Local Handicrafts - 5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Users className="h-4 w-4 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium">New Admin Added</p>
                  <p className="text-muted-foreground">John Doe - 1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Statistics</CardTitle>
            <CardDescription>
              Overview of platform performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Active Businesses</span>
                </div>
                <div className="text-sm font-medium">148</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  <span className="text-sm">Pending Approval</span>
                </div>
                <div className="text-sm font-medium">8</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm">Total Investors</span>
                </div>
                <div className="text-sm font-medium">892</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span className="text-sm">Total Inquiries</span>
                </div>
                <div className="text-sm font-medium">1,284</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="text-sm">Active Sectors</span>
                </div>
                <div className="text-sm font-medium">12</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPanelDashboardLayout>
  );
}
