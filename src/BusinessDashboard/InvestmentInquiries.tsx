import { BusinessDashboardLayout } from "./BusinessDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, User, Calendar, ArrowUpRight } from "lucide-react";

export default function InvestmentInquiries() {
  return (
    <BusinessDashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Investment Inquiries</h2>
        <p className="text-muted-foreground">
          Manage inquiries and messages from potential investors
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Inquiries</TabsTrigger>
          <TabsTrigger value="unread">Unread (5)</TabsTrigger>
          <TabsTrigger value="responded">Responded</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Inquiry Item */}
                <div className="flex items-start justify-between rounded-lg border p-4">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">John Doe</h4>
                        <Badge>New</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MessageSquare className="h-3 w-3" />
                        Interested in NPR 500,000 investment opportunity
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        2 hours ago
                      </p>
                    </div>
                  </div>
                  <Button size="sm">
                    View Details
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Inquiry Item */}
                <div className="flex items-start justify-between rounded-lg border p-4">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Jane Smith</h4>
                        <Badge>New</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MessageSquare className="h-3 w-3" />
                        Question about business model and revenue streams
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        5 hours ago
                      </p>
                    </div>
                  </div>
                  <Button size="sm">
                    View Details
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Inquiry Item */}
                <div className="flex items-start justify-between rounded-lg border p-4 opacity-60">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Investment Group Ltd.</h4>
                        <Badge variant="outline">Responded</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MessageSquare className="h-3 w-3" />
                        Request for financial documents and business plan
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        1 day ago
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Inquiry Item */}
                <div className="flex items-start justify-between rounded-lg border p-4 opacity-60">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">Michael Chen</h4>
                        <Badge variant="outline">Responded</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MessageSquare className="h-3 w-3" />
                        Interest in partnership and collaboration
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        2 days ago
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Unread inquiries will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responded">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Responded inquiries will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+5 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Excellent response time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">Very responsive</p>
          </CardContent>
        </Card>
      </div>
    </BusinessDashboardLayout>
  );
}
