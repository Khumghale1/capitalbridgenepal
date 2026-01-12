import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BusinessCard } from "@/components/business/BusinessCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MapPin,
  Globe,
  Mail,
  Phone,
  Share2,
  Bookmark,
  FileText,
  Video,
  Image,
  Building2,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Info,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface Business {
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
  fullDescription?: string;
  investmentCapacityMin: number;
  investmentCapacityMax: number;
  minimumInvestmentUnits?: number;
  maximumInvestmentUnits?: number;
  pricePerUnit?: number;
  expectedReturnOptions?: string;
  estimatedMarketValuation?: number;
  ipoTimeHorizon?: string;
  paidUpCapital: number;
  yearEstablished: number;
  businessType: string;
  teamSize: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  growthPlans?: string;
  isFeatured?: boolean;
  status?: string;
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(1)} Crore`;
  } else if (amount >= 100000) {
    return `${(amount / 100000).toFixed(1)} Lakhs`;
  }
  return `${(amount / 1000).toFixed(0)}K`;
}

export default function BusinessDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pitch-deck");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [relatedBusinesses, setRelatedBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [interestFormData, setInterestFormData] = useState({
    investorName: "",
    email: "",
    phoneNumber: "",
    message: "",
    hasConsent: false,
  });

  useEffect(() => {
    if (id) {
      fetchBusinessDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.businesses.getById(id!);
      const businessData = response.business;
      setBusiness(businessData);

      // Fetch all businesses to find related ones
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allBusinessesResponse: any = await api.businesses.getAll();
      const allBusinesses = allBusinessesResponse.businesses || [];

      // Filter related businesses
      const related = allBusinesses
        .filter((b: Business) =>
          b.category.name === businessData.category.name &&
          b.id !== businessData.id
        )
        .slice(0, 3);

      setRelatedBusinesses(related);
    } catch (error) {
      console.error("Failed to fetch business details:", error);
      toast({
        title: "Error",
        description: "Failed to load business details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading business details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!business) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold">Business Not Found</h1>
          <Link to="/businesses">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Back to Businesses
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.interests.submit({
        businessId: id!,
        investorName: interestFormData.investorName,
        phoneNumber: interestFormData.phoneNumber,
        email: interestFormData.email,
        message: interestFormData.message || undefined,
        hasConsent: interestFormData.hasConsent,
      });

      toast({
        title: "Interest Submitted!",
        description: `Thank you! ${business.name} will be notified of your interest.`,
      });

      // Reset form
      setInterestFormData({
        investorName: "",
        email: "",
        phoneNumber: "",
        message: "",
        hasConsent: false,
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "pitch-deck", label: "Pitch Deck", icon: FileText },
    { id: "videos", label: "Videos", icon: Video },
    { id: "brochures", label: "Brochures", icon: FileText },
    { id: "gallery", label: "Gallery", icon: Image },
  ];

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="border-b border-border bg-secondary/30 py-4">
        <div className="container">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              to="/businesses"
              className="text-muted-foreground hover:text-primary"
            >
              Browse Businesses
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{business.name}</span>
          </nav>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Main Content */}
            <div className="flex-1">
              {/* Business Header */}
              <div className="mb-8 rounded-xl border border-border bg-card p-6 md:p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-secondary md:h-24 md:w-24 overflow-hidden">
                    {business.logoUrl ? (
                      <img
                        src={business.logoUrl}
                        alt={business.name}
                        className="h-16 w-16 md:h-20 md:w-20 rounded-lg object-contain"
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-muted-foreground md:h-12 md:w-12" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                        {business.name}
                      </h1>
                      {business.status === 'APPROVED' && (
                        <Badge
                          variant="secondary"
                          className="gap-1 bg-success/10 text-success"
                        >
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {business.location}
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-teal-50 text-teal-700"
                      >
                        {business.category.name}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{business.briefDescription}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-teal-50 p-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Investment Sought
                    </p>
                    <p className="font-bold text-foreground">
                      NPR {formatCurrency(business.investmentCapacityMin)} -{" "}
                      {formatCurrency(business.investmentCapacityMax)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Paid-Up Capital
                    </p>
                    <p className="font-bold text-foreground">
                      NPR {formatCurrency(business.paidUpCapital)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Established</p>
                    <p className="font-bold text-foreground">{business.yearEstablished}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-bold text-foreground">{business.teamSize}</p>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-8 rounded-xl border border-border bg-card p-6 md:p-8">
                <h2 className="mb-4 text-xl font-bold text-foreground">
                  About the Business
                </h2>
                <div className="prose prose-gray max-w-none text-muted-foreground">
                  <p>{business.briefDescription}</p>
                  {business.fullDescription && (
                    <p className="mt-4 whitespace-pre-wrap">{business.fullDescription}</p>
                  )}
                </div>
              </div>

              {/* Key Investment Parameters */}
              {(business.minimumInvestmentUnits || business.maximumInvestmentUnits || business.pricePerUnit || business.expectedReturnOptions || business.estimatedMarketValuation || business.ipoTimeHorizon) && (
                <div className="mb-8 rounded-xl border border-border bg-card p-6 md:p-8">
                  <h2 className="mb-4 text-xl font-bold text-foreground">
                    Key Investment Parameters
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Click on any parameter to view detailed information
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {business.minimumInvestmentUnits && (
                      <div
                        onClick={() => setOpenModal('minUnits')}
                        className="rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all hover:border-primary/40 hover:shadow-md cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-muted-foreground">Minimum Investment Units</p>
                          <Info className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-2xl font-bold text-primary">{business.minimumInvestmentUnits.toLocaleString()}</p>
                      </div>
                    )}
                    {business.maximumInvestmentUnits && (
                      <div
                        onClick={() => setOpenModal('maxUnits')}
                        className="rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all hover:border-primary/40 hover:shadow-md cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-muted-foreground">Maximum Investment Units</p>
                          <Info className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-2xl font-bold text-primary">{business.maximumInvestmentUnits.toLocaleString()}</p>
                      </div>
                    )}
                    {business.pricePerUnit && (
                      <div
                        onClick={() => setOpenModal('pricePerUnit')}
                        className="rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all hover:border-primary/40 hover:shadow-md cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-muted-foreground">Price per Unit</p>
                          <Info className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-2xl font-bold text-primary">NPR {formatCurrency(business.pricePerUnit)}</p>
                      </div>
                    )}
                    {business.expectedReturnOptions && (
                      <div
                        onClick={() => setOpenModal('expectedReturns')}
                        className="rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all hover:border-primary/40 hover:shadow-md cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-muted-foreground">Expected Return Options</p>
                          <Info className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-base font-semibold text-primary">{business.expectedReturnOptions}</p>
                      </div>
                    )}
                    {business.estimatedMarketValuation && (
                      <div
                        onClick={() => setOpenModal('valuation')}
                        className="rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all hover:border-primary/40 hover:shadow-md cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-muted-foreground">Estimated Market Valuation</p>
                          <Info className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-2xl font-bold text-primary">NPR {formatCurrency(business.estimatedMarketValuation)}</p>
                        <p className="mt-2 text-xs text-muted-foreground italic">*Based on information provided by the business</p>
                      </div>
                    )}
                    {business.ipoTimeHorizon && (
                      <div
                        onClick={() => setOpenModal('ipoTimeline')}
                        className="rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all hover:border-primary/40 hover:shadow-md cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-muted-foreground">Time Horizon for IPO</p>
                          <Info className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-base font-semibold text-primary">{business.ipoTimeHorizon}</p>
                      </div>
                    )}
                    {business.teamSize && (
                      <div
                        onClick={() => setOpenModal('teamSize')}
                        className="rounded-lg border border-primary/20 bg-primary/5 p-4 transition-all hover:border-primary/40 hover:shadow-md cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-muted-foreground">Team Size</p>
                          <Info className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="mt-1 text-base font-semibold text-primary">{business.teamSize}</p>
                      </div>
                    )}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    <ShieldCheck className="inline h-3 w-3 mr-1" />
                    Estimated valuation is based on information provided by the business. The platform does not influence investment decisions.
                  </p>
                </div>
              )}

              {/* Investment Parameter Modals */}
              <Dialog open={openModal === 'minUnits'} onOpenChange={() => setOpenModal(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Minimum Investment Units</DialogTitle>
                    <DialogDescription>
                      Understanding the minimum investment requirement
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                      <p className="text-3xl font-bold text-primary">{business?.minimumInvestmentUnits?.toLocaleString()} units</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">What does this mean?</h4>
                      <p className="text-sm text-muted-foreground">
                        This is the smallest number of investment units you can purchase from this business.
                        Each unit represents a share of ownership in the company.
                      </p>
                    </div>
                    {business?.pricePerUnit && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Minimum Investment Amount</h4>
                        <p className="text-sm text-muted-foreground">
                          At NPR {formatCurrency(business.pricePerUnit)} per unit, your minimum investment would be:
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          NPR {formatCurrency((business.minimumInvestmentUnits || 0) * business.pricePerUnit)}
                        </p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={openModal === 'maxUnits'} onOpenChange={() => setOpenModal(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Maximum Investment Units</DialogTitle>
                    <DialogDescription>
                      Understanding the maximum investment limit
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                      <p className="text-3xl font-bold text-primary">{business?.maximumInvestmentUnits?.toLocaleString()} units</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">What does this mean?</h4>
                      <p className="text-sm text-muted-foreground">
                        This is the maximum number of investment units a single investor can purchase from this business.
                        This limit helps ensure diverse ownership and prevents concentration of control.
                      </p>
                    </div>
                    {business?.pricePerUnit && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Maximum Investment Amount</h4>
                        <p className="text-sm text-muted-foreground">
                          At NPR {formatCurrency(business.pricePerUnit)} per unit, your maximum investment would be:
                        </p>
                        <p className="text-2xl font-bold text-primary">
                          NPR {formatCurrency((business.maximumInvestmentUnits || 0) * business.pricePerUnit)}
                        </p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={openModal === 'pricePerUnit'} onOpenChange={() => setOpenModal(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Price per Unit</DialogTitle>
                    <DialogDescription>
                      The cost of each investment unit
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                      <p className="text-3xl font-bold text-primary">NPR {business?.pricePerUnit ? formatCurrency(business.pricePerUnit) : 'N/A'}</p>
                      <p className="text-sm text-muted-foreground mt-1">per unit</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">What does this mean?</h4>
                      <p className="text-sm text-muted-foreground">
                        This is the price you pay for each investment unit. Multiply this by the number of units you want to purchase to calculate your total investment amount.
                      </p>
                    </div>
                    {business?.minimumInvestmentUnits && business?.maximumInvestmentUnits && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Investment Range</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-lg bg-secondary/50 p-3">
                            <p className="text-xs text-muted-foreground">Minimum</p>
                            <p className="text-lg font-bold text-foreground">
                              NPR {formatCurrency(business.minimumInvestmentUnits * (business.pricePerUnit || 0))}
                            </p>
                          </div>
                          <div className="rounded-lg bg-secondary/50 p-3">
                            <p className="text-xs text-muted-foreground">Maximum</p>
                            <p className="text-lg font-bold text-foreground">
                              NPR {formatCurrency(business.maximumInvestmentUnits * (business.pricePerUnit || 0))}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={openModal === 'expectedReturns'} onOpenChange={() => setOpenModal(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Expected Return Options</DialogTitle>
                    <DialogDescription>
                      Projected returns on your investment
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                      <p className="text-2xl font-bold text-primary">{business?.expectedReturnOptions}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">What does this mean?</h4>
                      <p className="text-sm text-muted-foreground">
                        This represents the anticipated financial return on your investment. Returns may come in the form of:
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li>Dividends (regular profit sharing)</li>
                        <li>Capital appreciation (increase in share value)</li>
                        <li>IPO exit (selling shares during public offering)</li>
                        <li>Buyback opportunities</li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                      <p className="text-xs text-yellow-800">
                        <ShieldCheck className="inline h-3 w-3 mr-1" />
                        <strong>Disclaimer:</strong> Expected returns are projections and not guarantees. Actual returns may vary based on business performance and market conditions.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={openModal === 'valuation'} onOpenChange={() => setOpenModal(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Estimated Market Valuation</DialogTitle>
                    <DialogDescription>
                      Current estimated worth of the business
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                      <p className="text-3xl font-bold text-primary">
                        NPR {business?.estimatedMarketValuation ? formatCurrency(business.estimatedMarketValuation) : 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">What does this mean?</h4>
                      <p className="text-sm text-muted-foreground">
                        This is the estimated total market value of the business based on various factors including:
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li>Current revenue and profitability</li>
                        <li>Growth potential and market size</li>
                        <li>Assets and intellectual property</li>
                        <li>Industry benchmarks and comparables</li>
                        <li>Future projections</li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                      <p className="text-xs text-yellow-800">
                        <ShieldCheck className="inline h-3 w-3 mr-1" />
                        <strong>Important:</strong> This valuation is based on information provided by the business.
                        The platform does not influence investment decisions. We recommend conducting your own due diligence
                        and consulting with financial advisors before investing.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={openModal === 'ipoTimeline'} onOpenChange={() => setOpenModal(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Time Horizon for IPO</DialogTitle>
                    <DialogDescription>
                      Expected timeline for public listing
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                      <p className="text-2xl font-bold text-primary">{business?.ipoTimeHorizon}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">What does this mean?</h4>
                      <p className="text-sm text-muted-foreground">
                        This is the estimated timeframe for the company to go public (Initial Public Offering).
                        An IPO is when a private company offers its shares to the public for the first time on a stock exchange.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Why is this important?</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li>IPO provides liquidity - you can sell your shares on the open market</li>
                        <li>Potentially realize capital gains from share price appreciation</li>
                        <li>Increased transparency through public reporting requirements</li>
                        <li>Greater visibility and credibility for the company</li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                      <p className="text-xs text-yellow-800">
                        <ShieldCheck className="inline h-3 w-3 mr-1" />
                        <strong>Note:</strong> IPO timelines are estimates and subject to change based on market conditions,
                        regulatory requirements, and company performance. There is no guarantee an IPO will occur.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={openModal === 'teamSize'} onOpenChange={() => setOpenModal(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Team Size</DialogTitle>
                    <DialogDescription>
                      Understanding the company's workforce
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                      <p className="text-3xl font-bold text-primary">{business?.teamSize}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">What does this mean?</h4>
                      <p className="text-sm text-muted-foreground">
                        This represents the current size of the company's team/workforce. Team size can be an indicator
                        of the company's operational scale and growth stage.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Why is this important?</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-2">
                        <li>Indicates the company's operational capacity and maturity</li>
                        <li>Helps assess scalability and growth potential</li>
                        <li>Provides context for revenue and valuation metrics</li>
                        <li>Shows the company's investment in human capital</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Investment Opportunity */}
              <div className="mb-8 rounded-xl border border-border bg-card p-6 md:p-8">
                <h2 className="mb-4 text-xl font-bold text-foreground">
                  Investment Opportunity
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">
                      Why Invest?
                    </h3>
                    <ul className="ml-5 list-disc space-y-1">
                      <li>Growing market with increasing demand</li>
                      <li>Experienced management team</li>
                      <li>Strong revenue growth trajectory</li>
                      <li>Clear path to profitability</li>
                    </ul>
                  </div>
                  {business.growthPlans && (
                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">
                        Use of Funds / Growth Plans
                      </h3>
                      <p className="whitespace-pre-wrap">{business.growthPlans}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Media Gallery */}
              <div className="mb-8 rounded-xl border border-border bg-card p-6 md:p-8">
                <h2 className="mb-4 text-xl font-bold text-foreground">
                  Materials & Media
                </h2>
                <div className="mb-4 flex gap-2 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground hover:bg-secondary/80"
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-8 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="mb-2 font-medium text-foreground">
                    {activeTab === "pitch-deck" && "Pitch Deck Available"}
                    {activeTab === "videos" && "Company Video"}
                    {activeTab === "brochures" && "Business Brochure"}
                    {activeTab === "gallery" && "Photo Gallery"}
                  </p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Submit your interest to request access to materials
                  </p>
                  <Button variant="outline">
                    <FileText className="h-4 w-4" />
                    Request Access
                  </Button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-8 rounded-xl border border-border bg-card p-6 md:p-8">
                <h2 className="mb-4 text-xl font-bold text-foreground">
                  Contact Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">
                        {business.contactEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">
                        {business.contactPhone}
                      </p>
                    </div>
                  </div>
                  {business.website && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a href={business.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                          {business.website}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">
                        {business.location}, Nepal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full shrink-0 lg:w-80 xl:w-96">
              <div className="sticky top-24 space-y-6">
                {/* Interest Form */}
                <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-teal-50 to-background p-6">
                  <h3 className="mb-4 text-lg font-bold text-foreground">
                    Interested in This Business?
                  </h3>
                  <form onSubmit={handleInterestSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={interestFormData.investorName}
                        onChange={(e) => setInterestFormData({ ...interestFormData, investorName: e.target.value })}
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Your name"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={interestFormData.email}
                        onChange={(e) => setInterestFormData({ ...interestFormData, email: e.target.value })}
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={interestFormData.phoneNumber}
                        onChange={(e) => setInterestFormData({ ...interestFormData, phoneNumber: e.target.value })}
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="+977 9XXXXXXXXX"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Message
                      </label>
                      <textarea
                        rows={3}
                        value={interestFormData.message}
                        onChange={(e) => setInterestFormData({ ...interestFormData, message: e.target.value })}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Tell us about your investment interest..."
                        disabled={isSubmitting}
                      />
                    </div>
                    <label className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        required
                        checked={interestFormData.hasConsent}
                        onChange={(e) => setInterestFormData({ ...interestFormData, hasConsent: e.target.checked })}
                        className="mt-1 rounded border-input"
                        disabled={isSubmitting}
                      />
                      <span className="text-muted-foreground">
                        I agree to the Terms & Conditions and Privacy Policy
                      </span>
                    </label>
                    <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Interest"}
                    </Button>
                  </form>
                  <p className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" />
                    Your information is kept private
                  </p>
                </div>

                {/* Quick Info */}
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="mb-4 text-lg font-bold text-foreground">
                    Quick Info
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reg. Number</span>
                      <span className="font-medium text-foreground">
                        {business.registrationNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Business Type
                      </span>
                      <span className="font-medium text-foreground">
                        {business.businessType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Year Established
                      </span>
                      <span className="font-medium text-foreground">{business.yearEstablished}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employees</span>
                      <span className="font-medium text-foreground">{business.teamSize}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* Related Businesses */}
          {relatedBusinesses.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Similar Opportunities You Might Like
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedBusinesses.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
