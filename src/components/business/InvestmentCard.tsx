import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, CheckCircle } from "lucide-react";

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

interface InvestmentCardProps {
  business: Business;
}

export function InvestmentCard({ business }: InvestmentCardProps) {
  const isVerified = business.status === 'APPROVED';

  return (
    <div className="relative rounded-xl p-[2px] overflow-hidden group">
      {/* Rotating golden line border */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: 'conic-gradient(from var(--angle, 0deg), transparent 0%, transparent 70%, #FFD700 75%, #FFA500 80%, #FFD700 85%, transparent 90%, transparent 100%)',
          animation: 'border-rotate 2.5s linear infinite',
        }}
      />

      {/* Static border underneath */}
      <div className="absolute inset-0 rounded-xl border-2 border-primary/30" />

      {/* Inner card content */}
      <div className="relative rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg h-full">
        {/* Verified Badge - Top Right */}
        {isVerified && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 border border-[#BBF0D5] bg-[#BBF0D5] rounded-lg px-3 py-1">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">VERIFIED</span>
          </div>
        )}

        {/* Centered Logo */}
        <div className="flex justify-center mb-6 mt-2">
          <div className="flex h-36 w-36 items-center justify-center">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="max-h-36 max-w-36 object-contain"
              />
            ) : (
              <div className="flex h-36 w-36 items-center justify-center rounded-lg bg-secondary">
                <Building2 className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        {/* Sector Badge - Centered */}
        <div className="flex justify-center mb-4">
          <Badge
            variant="outline"
            className="border-gray-300 bg-white text-primary font-medium px-4 py-1.5 text-sm"
          >
            Sector: {business.category.name}
          </Badge>
        </div>

        {/* Description */}
        <p className="mb-6 text-sm text-gray-600 line-clamp-2 text-left">
          {business.briefDescription}
        </p>

        {/* View Investment Profile Button */}
        <div className="flex justify-center">
          <Button
            className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5"
          >
            View Investment Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* CSS for the animation */}
      <style>{`
        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes border-rotate {
          from {
            --angle: 0deg;
          }
          to {
            --angle: 360deg;
          }
        }
      `}</style>
    </div>
  );
}
