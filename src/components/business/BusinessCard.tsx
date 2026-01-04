import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, Building2, ArrowRight } from "lucide-react";

export interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  location: string;
  briefDescription: string;
  investmentCapacityMin: number;
  investmentCapacityMax: number;
  paidUpCapital: number;
  isFeatured?: boolean;
  status?: string;
}

interface BusinessCardProps {
  business: Business;
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(1)} Cr`;
  } else if (amount >= 100000) {
    return `${(amount / 100000).toFixed(1)} L`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return amount.toString();
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
      {business.isFeatured && (
        <div className="absolute right-0 top-0 rounded-bl-lg bg-gradient-hero px-3 py-1">
          <span className="text-xs font-semibold text-primary-foreground">
            Featured
          </span>
        </div>
      )}

      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary">
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={business.name}
              className="h-10 w-10 rounded object-contain"
            />
          ) : (
            <Building2 className="h-7 w-7 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate font-semibold text-foreground group-hover:text-primary transition-colors">
            {business.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{business.location}</span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="secondary" className="bg-teal-50 text-teal-700">
          {business.category.name}
        </Badge>
        {business.status === 'APPROVED' && (
          <Badge variant="secondary" className="bg-success/10 text-success">
            ✓ Verified
          </Badge>
        )}
      </div>

      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
        {business.briefDescription}
      </p>

      <div className="mb-4 space-y-2 rounded-lg bg-secondary/50 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary" />
            Investment
          </span>
          <span className="font-semibold text-foreground">
            NPR {formatCurrency(business.investmentCapacityMin)} -{" "}
            {formatCurrency(business.investmentCapacityMax)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Paid-Up Capital</span>
          <span className="font-medium text-foreground">
            NPR {formatCurrency(business.paidUpCapital)}
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
      >
        View Details
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </div>
  );
}
