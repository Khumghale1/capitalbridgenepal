import { DashboardLayout } from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function Portfolio() {
  const portfolioData = {
    totalValue: 185234,
    totalInvested: 145000,
    totalReturns: 40234,
    returnPercentage: 27.75,
  };

  const assetAllocation = [
    { category: "Technology", value: 50000, percentage: 27, change: 12.5 },
    { category: "Agriculture", value: 55000, percentage: 30, change: 8.3 },
    { category: "Tourism", value: 40000, percentage: 22, change: -2.1 },
    { category: "Energy", value: 40234, percentage: 21, change: 15.7 },
  ];

  const recentTransactions = [
    {
      id: 1,
      type: "Return",
      business: "Tech Startup Nepal",
      amount: 6250,
      date: "2024-12-20",
      status: "Completed",
    },
    {
      id: 2,
      type: "Investment",
      business: "Green Power Solutions",
      amount: -15000,
      date: "2024-12-18",
      status: "Completed",
    },
    {
      id: 3,
      type: "Return",
      business: "Coffee Export Co.",
      amount: 2490,
      date: "2024-12-15",
      status: "Completed",
    },
    {
      id: 4,
      type: "Investment",
      business: "Organic Farming Initiative",
      amount: -25000,
      date: "2024-12-10",
      status: "Completed",
    },
  ];

  const holdings = [
    {
      name: "Tech Startup Nepal",
      shares: 5,
      currentValue: 56250,
      invested: 50000,
      return: 6250,
      returnPercent: 12.5,
    },
    {
      name: "Coffee Export Co.",
      shares: 3,
      currentValue: 32490,
      invested: 30000,
      return: 2490,
      returnPercent: 8.3,
    },
    {
      name: "Organic Farming Initiative",
      shares: 2,
      currentValue: 28800,
      invested: 25000,
      return: 3800,
      returnPercent: 15.2,
    },
    {
      name: "Tourism Venture Ltd.",
      shares: 4,
      currentValue: 39168,
      invested: 40000,
      return: -832,
      returnPercent: -2.08,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Portfolio</h2>
            <p className="text-muted-foreground">
              Track your investment performance and asset allocation
            </p>
          </div>
          <Button variant="outline">
            Download Report
          </Button>
        </div>

        {/* Portfolio Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                NPR {portfolioData.totalValue.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+{portfolioData.returnPercentage}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                NPR {portfolioData.totalInvested.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                NPR {portfolioData.totalReturns.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROI</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {portfolioData.returnPercentage}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
            <CardDescription>Distribution of your investments by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assetAllocation.map((asset) => (
                <div key={asset.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{asset.category}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        NPR {asset.value.toLocaleString()}
                      </span>
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          asset.change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {asset.change >= 0 ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        <span>{Math.abs(asset.change)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${asset.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {asset.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Holdings and Transactions */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Holdings */}
          <Card>
            <CardHeader>
              <CardTitle>Holdings</CardTitle>
              <CardDescription>Your current investment positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding) => (
                  <div
                    key={holding.name}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{holding.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {holding.shares} shares
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-medium text-sm">
                        NPR {holding.currentValue.toLocaleString()}
                      </p>
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          holding.return >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {holding.return >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{holding.returnPercent}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest portfolio activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            transaction.type === "Return" ? "default" : "secondary"
                          }
                        >
                          {transaction.type}
                        </Badge>
                        <p className="font-medium text-sm">{transaction.business}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium text-sm ${
                          transaction.amount >= 0 ? "text-green-600" : "text-foreground"
                        }`}
                      >
                        {transaction.amount >= 0 ? "+" : ""}NPR{" "}
                        {Math.abs(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
