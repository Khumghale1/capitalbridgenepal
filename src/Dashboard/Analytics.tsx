import { DashboardLayout } from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Analytics() {
  const performanceMetrics = [
    { label: "Total ROI", value: "27.75%", change: 5.2, isPositive: true },
    { label: "Avg Monthly Return", value: "NPR 8,941", change: 12.3, isPositive: true },
    { label: "Best Performing", value: "Energy", change: 15.7, isPositive: true },
    { label: "Portfolio Volatility", value: "Low", change: -2.1, isPositive: true },
  ];

  const monthlyPerformance = [
    { month: "Jul", value: 5200 },
    { month: "Aug", value: 6800 },
    { month: "Sep", value: 7500 },
    { month: "Oct", value: 8200 },
    { month: "Nov", value: 9100 },
    { month: "Dec", value: 8941 },
  ];

  const categoryPerformance = [
    { category: "Technology", roi: 12.5, invested: 50000, returns: 6250 },
    { category: "Agriculture", roi: 11.6, invested: 55000, returns: 6380 },
    { category: "Tourism", roi: -2.08, invested: 40000, returns: -832 },
    { category: "Energy", roi: 15.7, invested: 40234, returns: 6316 },
  ];

  const topPerformers = [
    { name: "Green Power Solutions", roi: 15.7, value: 46547 },
    { name: "Organic Farming Initiative", roi: 15.2, value: 28800 },
    { name: "Tech Startup Nepal", roi: 12.5, value: 56250 },
    { name: "Coffee Export Co.", roi: 8.3, value: 32490 },
  ];

  const maxValue = Math.max(...monthlyPerformance.map((m) => m.value));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">
              Detailed insights into your investment performance
            </p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="6m">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              Export Data
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          {performanceMetrics.map((metric) => (
            <Card key={metric.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div
                  className={`flex items-center gap-1 text-xs mt-1 ${
                    metric.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  <span>{Math.abs(metric.change)}% from last period</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Monthly Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Returns</CardTitle>
              <CardDescription>Your returns over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyPerformance.map((month) => {
                  const percentage = (month.value / maxValue) * 100;
                  return (
                    <div key={month.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{month.month}</span>
                        <span className="text-muted-foreground">
                          NPR {month.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-8 rounded-lg bg-secondary relative overflow-hidden">
                        <div
                          className="h-full rounded-lg bg-primary/80 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>ROI by investment category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryPerformance.map((category) => (
                  <div
                    key={category.category}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{category.category}</p>
                      <p className="text-sm text-muted-foreground">
                        NPR {category.invested.toLocaleString()} invested
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <div
                        className={`flex items-center gap-1 font-medium ${
                          category.roi >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {category.roi >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span>{category.roi}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.roi >= 0 ? "+" : ""}NPR{" "}
                        {category.returns.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Investments</CardTitle>
            <CardDescription>Your best investments ranked by ROI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPerformers.map((performer, index) => (
                <div
                  key={performer.name}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{performer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Current Value: NPR {performer.value.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-600 font-medium">
                        <TrendingUp className="h-4 w-4" />
                        <span>{performer.roi}% ROI</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Investment Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Timeline</CardTitle>
            <CardDescription>Track your investment activity over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 relative pl-6 pb-6 border-l-2 border-border">
                <div className="absolute left-0 top-0 -translate-x-1/2 h-3 w-3 rounded-full bg-primary" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">December 2024</p>
                    <span className="text-sm text-muted-foreground">2 activities</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Invested NPR 40,000 • Received NPR 8,740 in returns
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 relative pl-6 pb-6 border-l-2 border-border">
                <div className="absolute left-0 top-0 -translate-x-1/2 h-3 w-3 rounded-full bg-primary" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">November 2024</p>
                    <span className="text-sm text-muted-foreground">3 activities</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Invested NPR 55,000 • Received NPR 9,100 in returns
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 relative pl-6">
                <div className="absolute left-0 top-0 -translate-x-1/2 h-3 w-3 rounded-full bg-muted" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">October 2024</p>
                    <span className="text-sm text-muted-foreground">4 activities</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Invested NPR 50,000 • Received NPR 8,200 in returns
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
