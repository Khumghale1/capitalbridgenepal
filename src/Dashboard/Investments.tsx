import { DashboardLayout } from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Investments() {
  const investments = [
    {
      id: 1,
      name: "Tech Startup Nepal",
      category: "Technology",
      location: "Kathmandu",
      amount: 50000,
      date: "2024-12-15",
      status: "Active",
      roi: 12.5,
    },
    {
      id: 2,
      name: "Coffee Export Co.",
      category: "Agriculture",
      location: "Pokhara",
      amount: 30000,
      date: "2024-11-20",
      status: "Active",
      roi: 8.3,
    },
    {
      id: 3,
      name: "Organic Farming Initiative",
      category: "Agriculture",
      location: "Chitwan",
      amount: 25000,
      date: "2024-10-10",
      status: "Active",
      roi: 15.2,
    },
    {
      id: 4,
      name: "Tourism Venture Ltd.",
      category: "Tourism",
      location: "Lumbini",
      amount: 40000,
      date: "2024-09-05",
      status: "Completed",
      roi: 18.7,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Investments</h2>
            <p className="text-muted-foreground">
              Track and manage all your investment activities
            </p>
          </div>
          <Button variant="hero">
            <Building2 className="mr-2 h-4 w-4" />
            New Investment
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NPR 145,000</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">13.7%</div>
            </CardContent>
          </Card>
        </div>

        {/* Investments List */}
        <Card>
          <CardHeader>
            <CardTitle>Investment History</CardTitle>
            <CardDescription>View and manage your investment portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4 mt-4">
                {investments.map((investment) => (
                  <div
                    key={investment.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{investment.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{investment.category}</span>
                          <span>•</span>
                          <span>{investment.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-medium">NPR {investment.amount.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-sm text-green-600">
                          <TrendingUp className="h-3 w-3" />
                          <span>{investment.roi}% ROI</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={investment.status === "Active" ? "default" : "secondary"}
                        >
                          {investment.status}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{investment.date}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="active">
                <div className="text-center py-8 text-muted-foreground">
                  Active investments only
                </div>
              </TabsContent>
              <TabsContent value="completed">
                <div className="text-center py-8 text-muted-foreground">
                  Completed investments only
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
