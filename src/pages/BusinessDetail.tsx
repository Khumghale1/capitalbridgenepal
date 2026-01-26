import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  BarChart3,
  CircleDollarSign,
  RefreshCcw,
  TrendingUp,
  Users,
  Eye,
  FileText,
  FolderOpen,
  Play,
  ChevronRight,
  Lock,
  ArrowLeft,
  Globe,
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
  pricePerUnit?: number;
  expectedReturnOptions?: string;
  paidUpCapital: number;
  yearEstablished: number;
  ipoTimeHorizon?: string;
  businessType: string;
  teamSize: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  growthPlans?: string;
  isFeatured?: boolean;
  status?: string;
  mission?:string;
  vision?:string;
  minimumInvestmentUnits?:string;
  maximumInvestmentUnits?:string;
}

interface BusinessMedia {
  id: string;
  businessId: string;
  mediaType: 'PITCH_DECK' | 'VIDEO' | 'BROCHURE' | 'GALLERY' | 'COMPANY_LOGO' | 'YOUTUBE_VIDEO' | 'WEBSITE' | 'DOCUMENT';
  fileName: string;
  fileUrl: string;
  externalUrl?: string;
  fileSize: string;
  mimeType: string;
  title?: string;
  description?: string;
  displayOrder?: number;
}

function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `${(amount / 10000000).toFixed(1)} Crore`;
  } else if (amount >= 100000) {
    return `${(amount / 100000).toFixed(0)} Lakh`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return amount.toString();
}

function formatInvestmentRange(min: number, max: number): string {
  return `NPR ${formatCurrency(min)} - ${formatCurrency(max)}`;
}

export default function BusinessDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [media, setMedia] = useState<BusinessMedia[]>([]);
  const [interestFormData, setInterestFormData] = useState({
    investorName: "",
    email: "",
    phoneNumber: "",
    message: "",
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

      // Fetch media for this business
      await fetchBusinessMedia(id!);
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

  const fetchBusinessMedia = async (businessId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.upload.getMedia(businessId);
      const mediaData = response.media || response || [];
      setMedia(Array.isArray(mediaData) ? mediaData : []);
    } catch (error) {
      console.error("Failed to fetch business media:", error);
      setMedia([]);
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
              <ArrowLeft className="h-4 w-4 mr-2" />
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
        email: interestFormData.email || undefined,
        message: interestFormData.message || undefined,
      });

      toast({
        title: "Interest Submitted!",
        description: `Your interest has been successfully submitted. A representative from ${business.name} will contact you within two business days.`,
      });

      // Reset form
      setInterestFormData({
        investorName: "",
        email: "",
        phoneNumber: "",
        message: "",
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

  // Get stage label from status
  const getStageLabel = (status?: string) => {
    if (status === 'APPROVED') return 'Operational';
    if (status === 'PENDING') return 'Pending';
    return 'Operational';
  };

  // Get media by type
  const pitchDeck = media.find(m => m.mediaType === 'PITCH_DECK');
  const applicationForm = media.find(m => m.mediaType === 'DOCUMENT');
  const video = media.find(m => m.mediaType === 'VIDEO' || m.mediaType === 'YOUTUBE_VIDEO');

  return (
    <Layout>
      <div className="bg-[#F4F4F4] min-h-screen">
        <div className="container py-8 md:py-12">

          {/* Header Section - Centered Logo, Name, Badges */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="h-40 w-40 flex items-center justify-center">
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt={business.name}
                    className="max-h-40 max-w-40 object-contain"
                  />
                ) : (
                  <div className="h-40 w-40 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Building2 className="h-20 w-20 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Business Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {business.name}
            </h1>

            {/* Badges */}
            <div className="flex items-center justify-center gap-3">
              <Badge variant="outline" className="border-gray-300 bg-white text-primary  font-medium px-4 py-1.5">
                Sector: {business.category.name}
              </Badge>
              <Badge variant="outline" className="border-gray-300 bg-white text-primary font-medium px-4 py-1.5">
                Stage: {getStageLabel(business.status)}
              </Badge>
            </div>
          </div>

          {/* Stats Row - 5 Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {/* Investment Range */}
            <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-primary/20">
              <BarChart3 className="h-6 w-6 mx-auto mb-2 text-primary " />
              <p className="text-xs text-muted-foreground mb-1">Investment Range</p>
              <p className="text-sm font-bold text-primary">
                 NPR {business.minimumInvestmentUnits} - NPR {business.maximumInvestmentUnits || 'Unlimited'}
              </p>
             
            </div>

            {/* Entry Price */}
            <div className="bg-white rounded-xl p-5 text-center shadow-sm border border-primary/20 ">
              <CircleDollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground mb-1">Entry Price</p>
              <p className="text-sm font-bold text-primary">
                NPR {business.pricePerUnit ? business.pricePerUnit.toLocaleString() : '100'}
              </p>
            </div>

            {/* Return Options */}
            <div className="bg-white rounded-xl p-5 text-center shadow-sm border-2 border-primary/20">
              <RefreshCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground mb-1">Return Options</p>
              <p className="text-sm font-bold text-primary">
                {business.expectedReturnOptions || 'IPO Upside'}
              </p>
            </div>

            {/* Ipo time horizon */}
            <div className="bg-white rounded-xl p-5 text-center shadow-sm border-2 border-primary/20">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground mb-1">IPO Time Horizon</p>
              <p className="text-sm font-bold text-primary">{business.ipoTimeHorizon} </p>
            </div>

            {/* Promoter Profile */}
            <div className="bg-white rounded-xl p-5 text-center shadow-sm col-span-2 md:col-span-1 border-2 border-primary/20">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground mb-1">Promoter Profile</p>
              <p className="text-sm font-bold text-primary">{business.name}</p>
              {/* <p className="text-sm font-bold text-primary">Trade Tower Group</p> */}
            </div>
          </div>

          {/* Two Column Layout - About, Materials & Form */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10 px-4 py-2">
            {/* Left Column - About, Mission, Vision (3/5 width) */}
            <div className="lg:col-span-3 order-1">
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
                {/* About Section */}
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    About {business.name}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {business.fullDescription }
                  </p>
                   
                </div>

                {/* Mission Card */}
                <div className="bg-[#EFFEF4] rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Our Mission</h3>
                      <p className="text-sm text-muted-foreground">
                        {business.mission}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vision Card */}
                <div className="bg-[#EFFEF4] rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Eye className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Our Vision</h3>
                      <p className="text-sm text-muted-foreground">
                        {business.vision}
                      </p>
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-foreground mb-4">Description</h2>

                 <p className="text-muted-foreground leading-relaxed mt-2">
                    {business.briefDescription }
                  </p>
              </div>
            </div>

            {/* Investment Materials & Resources Section - Shows before form on mobile */}
            <div className="order-2 lg:order-3 lg:col-span-5">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Investment Materials & Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pitch Deck */}
                <a
                  href={pitchDeck?.fileUrl || '#'}
                  target={pitchDeck ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`bg-[#F8F8F8] rounded-xl p-5 flex items-center justify-between transition-all hover:bg-gray-100 ${!pitchDeck ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={(e) => !pitchDeck && e.preventDefault()}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Pitch Deck</h3>
                      <p className="text-xs text-muted-foreground">View Pitch Deck</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </a>

                {/* Application Form */}
                <a
                  href={applicationForm?.fileUrl || '#'}
                  target={applicationForm ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`bg-[#F8F8F8] rounded-xl p-5 flex items-center justify-between transition-all hover:bg-gray-100 ${!applicationForm ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={(e) => !applicationForm && e.preventDefault()}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Application Form</h3>
                      <p className="text-xs text-muted-foreground">View Application Form</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </a>

                {/* Video Introduction */}
                <a
                  href={video?.fileUrl || video?.externalUrl || '#'}
                  target={video ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`bg-[#F8F8F8] rounded-xl p-5 flex items-center justify-between transition-all hover:bg-gray-100 ${!video ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={(e) => !video && e.preventDefault()}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Play className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Video Introduction</h3>
                      <p className="text-xs text-muted-foreground">View Video</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </a>
                </div>
              </div>
            </div>

            {/* Right Column - Interest Form (2/5 width) - Shows last on mobile */}
            <div className="lg:col-span-2 order-3 lg:order-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-5">
                  Interested in this Business?
                </h3>
                <form onSubmit={handleInterestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={interestFormData.investorName}
                      onChange={(e) => setInterestFormData({ ...interestFormData, investorName: e.target.value })}
                      className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Your name"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email
                    </label>
                    <input
                      type="text"
                      value={interestFormData.email}
                      onChange={(e) => setInterestFormData({ ...interestFormData, email: e.target.value })}
                      className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={interestFormData.phoneNumber}
                      onChange={(e) => setInterestFormData({ ...interestFormData, phoneNumber: e.target.value })}
                      className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="+977 9XXXXXXXXX"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      value={interestFormData.message}
                      onChange={(e) => setInterestFormData({ ...interestFormData, message: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      placeholder="Tell us about your interest..."
                      disabled={isSubmitting}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Interest"}
                  </Button>
                </form>
                <p className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  YOUR INFORMATION IS KEPT PRIVATE
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center px-4 pb-4">
            <p className="text-xs text-muted-foreground">
              Information shown is indicative only. Investments in unlisted companies involve risk and limited liquidity. Investors should conduct their own due diligence and seek independent advice before investing.
            </p>
          </div>

        </div>
      </div>
    </Layout>
  );
}