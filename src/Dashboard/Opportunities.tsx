import { DashboardLayout } from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, MapPin, DollarSign, Users, Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Opportunities() {
  const opportunities = [
    {
      id: 1,
      name: "E-commerce Platform Expansion",
      company: "Digital Commerce Nepal",
      category: "Technology",
      location: "Kathmandu",
      fundingGoal: 500000,
      fundingRaised: 350000,
      minInvestment: 10000,
      expectedROI: "15-20%",
      investors: 12,
      daysLeft: 15,
      image: "tech",
    },
    {
      id: 2,
      name: "Organic Tea Production",
      company: "Himalayan Tea Estates",
      category: "Agriculture",
      location: "Ilam",
      fundingGoal: 300000,
      fundingRaised: 180000,
      minInvestment: 5000,
      expectedROI: "12-18%",
      investors: 8,
      daysLeft: 22,
      image: "agriculture",
    },
    {
      id: 3,
      name: "Boutique Hotel Development",
      company: "Heritage Hospitality Group",
      category: "Tourism",
      location: "Pokhara",
      fundingGoal: 800000,
      fundingRaised: 600000,
      minInvestment: 25000,
      expectedROI: "18-25%",
      investors: 15,
      daysLeft: 8,
      image: "tourism",
    },
    {
      id: 4,
      name: "Solar Energy Installation",
      company: "Green Power Solutions",
      category: "Energy",
      location: "Bhaktapur",
      fundingGoal: 400000,
      fundingRaised: 120000,
      minInvestment: 15000,
      expectedROI: "10-15%",
      investors: 5,
      daysLeft: 30,
      image: "energy",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Investment Opportunities</h2>
          <p className="text-muted-foreground">
            Discover new businesses seeking investment
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search opportunities..."
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="tourism">Tourism</SelectItem>
              <SelectItem value="energy">Energy</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="kathmandu">Kathmandu</SelectItem>
              <SelectItem value="pokhara">Pokhara</SelectItem>
              <SelectItem value="ilam">Ilam</SelectItem>
              <SelectItem value="bhaktapur">Bhaktapur</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Opportunities Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {opportunities.map((opportunity) => {
            const fundingProgress = (opportunity.fundingRaised / opportunity.fundingGoal) * 100;

            return (
              <Card key={opportunity.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{opportunity.name}</CardTitle>
                      <CardDescription>{opportunity.company}</CardDescription>
                    </div>
                    <Badge variant="secondary">{opportunity.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{opportunity.location}</span>
                  </div>

                  {/* Funding Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Funding Progress</span>
                      <span className="font-medium">{fundingProgress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${fundingProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        NPR {opportunity.fundingRaised.toLocaleString()} raised
                      </span>
                      <span className="font-medium">
                        Goal: NPR {opportunity.fundingGoal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Min Investment</p>
                      <p className="font-medium">NPR {opportunity.minInvestment.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Expected ROI</p>
                      <p className="font-medium text-green-600">{opportunity.expectedROI}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Investors</p>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <p className="font-medium">{opportunity.investors}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Days Left</p>
                      <p className="font-medium">{opportunity.daysLeft} days</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" variant="hero">
                      Invest Now
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
