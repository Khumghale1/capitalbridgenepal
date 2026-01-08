import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/business/BusinessCard";
import { CategoryCard } from "@/components/business/CategoryCard";
import { stats } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  ArrowRight,
  Building2,
  Monitor,
  Droplets,
  Wallet,
  GraduationCap,
  Factory,
  Plane,
  Sprout,
  Home,
  Heart,
  UtensilsCrossed,
  ShoppingBag,
  Layers,
  HelpCircle,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryIcons: Record<string, any> = {
  "Tech Company": Monitor,
  Hydropower: Droplets,
  Fintech: Wallet,
  Edtech: GraduationCap,
  Manufacturing: Factory,
  "Tourism & Hospitality": Plane,
  Agriculture: Sprout,
  "Real Estate": Home,
  Healthcare: Heart,
  "Food & Beverage": UtensilsCrossed,
  Retail: ShoppingBag,
  Others: Layers,
};

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
  investmentCapacityMin: number;
  investmentCapacityMax: number;
  paidUpCapital: number;
  isFeatured?: boolean;
  status?: string;
}

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Real businesses data
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Array<{ name: string; slug: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Modal state for Business Onboarding form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [phoneError, setPhoneError] = useState("");

  // Fetch businesses from API
  useEffect(() => {
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.businesses.getAll();
      const businessData = response.businesses || [];
      setBusinesses(businessData);

      // Extract unique categories with counts
      const categoryMap = new Map<string, number>();
      businessData.forEach((business: Business) => {
        const catName = business.category.name;
        categoryMap.set(catName, (categoryMap.get(catName) || 0) + 1);
      });

      const categoriesData = Array.from(categoryMap.entries()).map(([name, count]) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        count
      }));

      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
      toast({
        title: "Error",
        description: "Failed to load businesses. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validatePhoneNumber = (phone: string): string => {
    if (!phone) {
      return "Phone number is required";
    }

    // Remove all spaces, hyphens, and other formatting characters
    const cleanedPhone = phone.replace(/[\s\-()]/g, "");

    // Check if it contains only numbers and optional + at the start
    if (!/^\+?[0-9]+$/.test(cleanedPhone)) {
      return "Phone number can only contain numbers and an optional + at the start";
    }

    // Extract only digits
    const digitsOnly = cleanedPhone.replace(/\+/g, "");

    // Valid Nepali phone number patterns:
    // 1. 9XXXXXXXXX (10 digits starting with 9)
    // 2. 9779XXXXXXXXX (13 digits with country code)

    if (digitsOnly.length === 10) {
      // Must start with 9 (Nepali mobile numbers)
      if (!digitsOnly.startsWith("9")) {
        return "Nepali mobile numbers must start with 9";
      }
    } else if (digitsOnly.length === 13) {
      // Must start with 977 (Nepal country code) followed by 9
      if (!digitsOnly.startsWith("977")) {
        return "Country code must be 977 for Nepal";
      }
      if (digitsOnly[3] !== "9") {
        return "Nepali mobile numbers must start with 9 after country code";
      }
    } else {
      return "Nepali mobile number must be 10 digits (e.g., 9841234567) or 13 digits with country code (e.g., 9779841234567)";
    }

    return "";
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phoneNumber: value });
    const error = validatePhoneNumber(value);
    setPhoneError(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number before submission
    const phoneValidationError = validatePhoneNumber(formData.phoneNumber);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      toast({
        title: "Validation Error",
        description: phoneValidationError,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.onboarding.submit({
        businessName: formData.businessName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        message: formData.message || undefined,
      });

      setIsSubmitted(true);

      toast({
        title: "Request Submitted!",
        description: "Thank you! Our team will contact you shortly.",
      });

      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setIsSubmitted(false);
        setIsModalOpen(false);
        setFormData({
          businessName: "",
          email: "",
          phoneNumber: "",
          message: ""
        });
        setPhoneError("");
      }, 3000);
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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (selectedCategory) params.append("category", selectedCategory);
    navigate(`/businesses?${params.toString()}`);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle min-h-screen flex items-center">
        <div className="container relative py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Side - Text and Buttons */}
            <div className="animate-fade-up">
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Unlock Early Access to High-Growth Companies Before They Go Public
              </h1>
              <p
                className="animate-fade-up mb-8 text-lg text-muted-foreground md:text-xl"
                style={{ animationDelay: "0.1s" }}
              >
                Explore top unlisted companies and build long-term wealth through informed decision
              </p>
              <div
                className="animate-fade-up flex flex-col items-start gap-4 sm:flex-row"
                style={{ animationDelay: "0.2s" }}
              >
                <Link to="/businesses">
                  <Button variant="hero" size="xl">
                    Browse Businesses
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="hero-outline"
                  size="xl"
                >
                  List Your Business
                </Button>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <img
                src="/images/HeroImage-website.png"
                alt="Hero"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="border-b border-border bg-card py-6">
        <div className="container">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search businesses by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-12 w-full rounded-lg border border-input bg-background pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 rounded-lg border border-input bg-background px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Button variant="default" size="lg" onClick={handleSearch}>
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* All Business Listings */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                Investment Opportunities
              </h2>
              <p className="text-muted-foreground">
                Browse all businesses actively seeking investment
              </p>
            </div>
          </div>

          {/* 2 columns layout, vertically scrollable */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-muted-foreground">Loading businesses...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {businesses.slice(0, 6).map((business) => (
                <div
                  key={business.id}
                  onClick={() => navigate(`/businesses/${business.id}`)}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <BusinessCard business={business} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section >
        <div
          className="animate-fade-up mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8"
          style={{ animationDelay: "0.3s" }}
        >
          {[
            { value: `${stats.totalBusinesses}+`, label: "Businesses" },
            { value: `${stats.totalCategories}`, label: "Categories" },
            { value: `${stats.connectionsMade}+`, label: "Connections Made" },
            {
              value: stats.investmentFacilitated,
              label: "Investment Facilitated",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card/50 p-4 text-center backdrop-blur-sm md:p-6"
            >
              <p className="text-2xl font-bold text-primary md:text-3xl">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sectors Section */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              Explore Our Sectors
            </h2>
            <p className="text-muted-foreground">
              Find investment opportunities in your preferred sector
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                icon={categoryIcons[category.name] || Building2}
                count={category.count}
                href={`/businesses?category=${category.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="overflow-hidden rounded-2xl bg-gradient-hero p-8 text-center md:p-16">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Find Your Next Investment?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/90">
              Join hundreds of investors discovering opportunities in Nepal's
              growing economy. Start exploring today.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/businesses">
                <Button
                  variant="secondary"
                  size="xl"
                  className="bg-background text-foreground hover:bg-background/90"
                >
                  Browse Businesses
                </Button>
              </Link>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                size="xl"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                List Your Business
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about Aarthiq
              </p>
            </div>

            {/* FAQ Accordion */}
            <Accordion type="single" collapsible className="space-y-4">
              {/* Question 1 */}
              <AccordionItem value="item-1" className="rounded-lg border border-border bg-card px-6 shadow-sm">
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline">
                  What is Aarthiq?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-base text-muted-foreground">
                  <p className="mb-4">
                    Aarthiq is Nepal's premier digital platform connecting investors with high-growth, pre-IPO companies. We provide a transparent marketplace where unlisted businesses can showcase their investment opportunities, and investors can discover promising ventures before they go public. Our platform facilitates the initial connection between investors and businesses, making pre-IPO investing accessible to everyone.
                  </p>
                  <div className="rounded-lg bg-mint-green p-4">
                    <p className="font-semibold text-foreground">In simple terms:</p>
                    <p className="mt-2 text-foreground">
                      We bridge the gap between growing Nepali businesses seeking capital and investors looking for early-stage investment opportunities.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Question 2 */}
              <AccordionItem value="item-2" className="rounded-lg border border-border bg-card px-6 shadow-sm">
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline">
                  How do I invest in businesses through Aarthiq?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-base text-muted-foreground">
                  <p className="mb-4 font-semibold text-foreground">Simple 5-Step Process:</p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</div>
                      <div>
                        <p className="font-semibold text-foreground">Browse</p>
                        <p>Visit Aarthiq.com and explore businesses. Use filters to find companies in sectors you're interested in (Tech, Hydropower, Healthcare, etc.)</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</div>
                      <div>
                        <p className="font-semibold text-foreground">Research</p>
                        <p>Click on any business to view detailed information. Review investment parameters, download pitch decks, watch videos, and check the team & financials.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</div>
                      <div>
                        <p className="font-semibold text-foreground">Submit Interest</p>
                        <p>Fill out the simple interest form on the business page. Your information is kept private and only shared with that specific business.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">4</div>
                      <div>
                        <p className="font-semibold text-foreground">Get Contacted</p>
                        <p>The business receives your inquiry immediately and will contact you directly within 3-5 business days to discuss investment terms.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">5</div>
                      <div>
                        <p className="font-semibold text-foreground">Invest Directly</p>
                        <p>Complete the investment process directly with the business. Sign legal agreements outside the platform.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg bg-mint-green p-4">
                    <p className="font-semibold text-foreground">
                      Note: Investing through Aarthiq is completely free for investors. We charge no fees at any stage.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Question 3 */}
              <AccordionItem value="item-3" className="rounded-lg border border-border bg-card px-6 shadow-sm">
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline">
                  How can my business get listed on Aarthiq?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-base text-muted-foreground">
                  <p className="mb-4 font-semibold text-foreground">Easy 6-Step Registration Process:</p>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</div>
                      <div>
                        <p className="font-semibold text-foreground">Express Interest</p>
                        <p>Click "List Your Business" button and fill the quick form</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</div>
                      <div>
                        <p className="font-semibold text-foreground">Admin Review</p>
                        <p>Our team reviews your inquiry within 1-2 business days</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</div>
                      <div>
                        <p className="font-semibold text-foreground">Receive Registration Link</p>
                        <p>If approved, we email you a unique registration link (valid for 7 days)</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">4</div>
                      <div>
                        <p className="font-semibold text-foreground">Complete Full Registration</p>
                        <p>Fill out detailed business information, upload materials, and submit required documents</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">5</div>
                      <div>
                        <p className="font-semibold text-foreground">Verification & Approval</p>
                        <p>Our admin team reviews your complete profile (2-3 business days)</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">6</div>
                      <div>
                        <p className="font-semibold text-foreground">Go Live!</p>
                        <p>Your business is now visible to all investors on Aarthiq</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="font-semibold text-foreground">Requirements:</p>
                    <ul className="ml-4 mt-2 list-disc space-y-1">
                      <li>Valid business registration certificate</li>
                      <li>PAN/VAT number</li>
                      <li>Professional pitch deck or business plan</li>
                      <li>Clear investment terms and use of funds</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Question 4 */}
              <AccordionItem value="item-4" className="rounded-lg border border-border bg-card px-6 shadow-sm">
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline">
                  What does "kitta" mean and how do investment parameters work?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-base text-muted-foreground">
                  <p className="mb-4">
                    <span className="font-semibold text-foreground">Understanding Kitta:</span> "Kitta" is the Nepali term for shares or stock units.
                  </p>
                  <div className="mb-4 rounded-lg border border-border bg-muted p-4">
                    <p className="mb-2 font-semibold text-foreground">Example Business Profile:</p>
                    <ul className="space-y-1">
                      <li><span className="font-medium">Minimum Kitta:</span> 10</li>
                      <li><span className="font-medium">Maximum Kitta:</span> 100</li>
                      <li><span className="font-medium">Per Kitta Price:</span> NPR 1,000</li>
                      <li><span className="font-medium">Estimated Market Value:</span> &gt;NPR 50,000</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p><span className="font-semibold text-foreground">Minimum Investment:</span> 10 kitta × NPR 1,000 = NPR 10,000</p>
                    <p><span className="font-semibold text-foreground">Maximum Investment:</span> 100 kitta × NPR 1,000 = NPR 100,000</p>
                  </div>
                  <div className="mt-4 rounded-lg bg-mint-green p-4">
                    <p className="font-semibold text-foreground">Exit Options Explained:</p>
                    <ul className="ml-4 mt-2 list-disc space-y-1">
                      <li><span className="font-medium">IPO Exit:</span> Sell shares when company lists on NEPSE (typically 3-7 years)</li>
                      <li><span className="font-medium">Dividend:</span> Receive regular profit distributions</li>
                      <li><span className="font-medium">Buyback:</span> Company may buy back your shares at agreed price</li>
                      <li><span className="font-medium">Revenue Share:</span> Receive percentage of company revenue</li>
                    </ul>
                  </div>
                  <div className="mt-4 rounded-lg border-l-4 border-primary bg-primary/5 p-4">
                    <p className="font-semibold text-primary">Pro Tip:</p>
                    <p className="mt-1 text-foreground">Start with minimum kitta for your first investment to understand the process!</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Question 5 */}
              <AccordionItem value="item-5" className="rounded-lg border border-border bg-card px-6 shadow-sm">
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline">
                  Is my investment safe? What are the risks?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-base text-muted-foreground">
                  <p className="mb-4 text-lg font-semibold text-foreground">Transparency First - Here's the Truth:</p>

                  <div className="mb-4 rounded-lg bg-green-50 p-4">
                    <p className="mb-2 font-semibold text-foreground">What Aarthiq Does: ✅</p>
                    <ul className="ml-4 space-y-1">
                      <li className="flex gap-2"><Check className="h-5 w-5 flex-shrink-0 text-green-600" /> Verifies business registration documents</li>
                      <li className="flex gap-2"><Check className="h-5 w-5 flex-shrink-0 text-green-600" /> Checks company information for accuracy</li>
                      <li className="flex gap-2"><Check className="h-5 w-5 flex-shrink-0 text-green-600" /> Reviews content for appropriateness</li>
                      <li className="flex gap-2"><Check className="h-5 w-5 flex-shrink-0 text-green-600" /> Provides platform for connection only</li>
                    </ul>
                  </div>

                  <div className="mb-4 rounded-lg bg-red-50 p-4">
                    <p className="mb-2 font-semibold text-foreground">What Aarthiq Does NOT Do: ❌</p>
                    <ul className="ml-4 space-y-1">
                      <li className="flex gap-2"><X className="h-5 w-5 flex-shrink-0 text-red-600" /> Guarantee investment returns</li>
                      <li className="flex gap-2"><X className="h-5 w-5 flex-shrink-0 text-red-600" /> Provide investment advice or recommendations</li>
                      <li className="flex gap-2"><X className="h-5 w-5 flex-shrink-0 text-red-600" /> Conduct financial audits or valuations</li>
                      <li className="flex gap-2"><X className="h-5 w-5 flex-shrink-0 text-red-600" /> Hold or manage your investment funds</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <p className="mb-2 font-semibold text-foreground">Key Investment Risks:</p>
                    <div className="space-y-2">
                      <p><span className="font-medium">1. Liquidity Risk:</span> Pre-IPO shares cannot be easily sold. You may need to hold investment for 3-7 years or longer.</p>
                      <p><span className="font-medium">2. Business Risk:</span> Company may not achieve projected growth or could become unprofitable.</p>
                      <p><span className="font-medium">3. Market Risk:</span> Economic conditions, industry disruption, or regulatory changes may impact returns.</p>
                      <p><span className="font-medium">4. IPO Risk:</span> Company may delay or never go public. IPO valuation may be lower than expected.</p>
                      <p><span className="font-medium">5. Capital Loss Risk:</span> You may lose some or ALL of your investment. Returns are never guaranteed.</p>
                    </div>
                  </div>

                  <div className="rounded-lg border-2 border-primary bg-primary/5 p-4">
                    <p className="mb-2 font-semibold text-primary">Our Recommendations:</p>
                    <ul className="ml-4 space-y-1">
                      <li className="flex gap-2"><Check className="h-5 w-5 flex-shrink-0 text-primary" /> Only invest money you can afford to lose</li>
                      <li className="flex gap-2"><Check className="h-5 w-5 flex-shrink-0 text-primary" /> Diversify across multiple businesses</li>
                      <li className="flex gap-2"><Check className="h-5 w-5 flex-shrink-0 text-primary" /> Conduct thorough due diligence</li>
                      <li className="flex gap-2"><Check className="h-5 w-5 flex-shrink-0 text-primary" /> Consult financial/legal advisors</li>
                      <li className="flex gap-2"><Check className="h-5 w-5 flex-shrink-0 text-primary" /> Think long-term (minimum 5 years)</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Question 6 */}
              <AccordionItem value="item-6" className="rounded-lg border border-border bg-card px-6 shadow-sm">
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline">
                  How do I manage my business profile after approval?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-base text-muted-foreground">
                  <div className="mb-4 rounded-lg bg-mint-green p-4">
                    <p className="font-semibold text-foreground">Access Your Dashboard:</p>
                    <p className="mt-2">Login URL: <span className="font-mono text-primary">aarthiq.com/business/login</span></p>
                    <p>Use credentials sent in approval email. Available 24/7 from any device.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 font-semibold text-foreground">Dashboard Features:</p>
                      <ul className="ml-4 list-disc space-y-2">
                        <li><span className="font-medium">Profile Management:</span> Edit all business information anytime, update investment parameters, modify content</li>
                        <li><span className="font-medium">View Investor Inquiries:</span> See all interest submissions, view investor details, filter by date/status</li>
                        <li><span className="font-medium">Materials & Media:</span> Upload new pitch decks, videos, and gallery images</li>
                        <li><span className="font-medium">Analytics:</span> Track profile views, monitor interest submissions</li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-green-50 p-4">
                      <p className="mb-2 font-semibold text-foreground">What You CAN Edit Freely: ✅</p>
                      <ul className="ml-4 list-disc space-y-1">
                        <li>Business description and about content</li>
                        <li>Investment parameters (kitta, pricing)</li>
                        <li>Contact information</li>
                        <li>Upload new materials</li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-red-50 p-4">
                      <p className="mb-2 font-semibold text-foreground">What You CANNOT Edit: ❌</p>
                      <ul className="ml-4 list-disc space-y-1">
                        <li>Business registration number (locked)</li>
                        <li>Username (locked after creation)</li>
                        <li>Business type (contact admin to change)</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
                      <p className="font-semibold text-primary">Best Practices:</p>
                      <ul className="ml-4 mt-2 list-disc space-y-1">
                        <li>Keep your profile information up-to-date</li>
                        <li>Respond to investor inquiries within 24-48 hours</li>
                        <li>Check dashboard daily for new inquiries</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Question 7 */}
              <AccordionItem value="item-7" className="rounded-lg border border-border bg-card px-6 shadow-sm">
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline">
                  Does Aarthiq handle payments or investment transactions?
                </AccordionTrigger>
                <AccordionContent className="pt-4 text-base text-muted-foreground">
                  <div className="mb-4 rounded-lg bg-red-50 p-4">
                    <p className="text-lg font-semibold text-foreground">No - Here's Why:</p>
                  </div>

                  <div className="mb-4 space-y-3">
                    <div>
                      <p className="font-semibold text-foreground">What Aarthiq IS:</p>
                      <ul className="ml-4 list-disc">
                        <li>A connection platform bringing investors and businesses together</li>
                        <li>A showcase platform where businesses display opportunities</li>
                        <li>A discovery platform for finding pre-IPO companies</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">What Aarthiq is NOT:</p>
                      <ul className="ml-4 list-disc">
                        <li>A payment processor</li>
                        <li>A financial institution</li>
                        <li>A securities broker</li>
                        <li>An escrow service</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mb-4 rounded-lg bg-mint-green p-4">
                    <p className="mb-2 font-semibold text-foreground">How Investment Transactions Work:</p>
                    <ol className="ml-4 list-decimal space-y-1">
                      <li>Investor submits interest through Aarthiq</li>
                      <li>Business and investor connect directly</li>
                      <li>They negotiate terms offline (outside Aarthiq)</li>
                      <li>Legal agreements signed between parties directly</li>
                      <li>Payment made directly from investor to business</li>
                      <li>Share certificates issued by business to investor</li>
                    </ol>
                  </div>

                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="mb-2 font-semibold text-foreground">Fees Explained:</p>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-primary">For Investors:</p>
                        <ul className="ml-4 list-disc">
                          <li>Browsing: FREE</li>
                          <li>Viewing details: FREE</li>
                          <li>Submitting interest: FREE</li>
                          <li>No fees at any stage!</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-primary">For Businesses:</p>
                        <ul className="ml-4 list-disc">
                          <li>Listing fee: One-time payment</li>
                          <li>No recurring charges</li>
                          <li>No success fees or commissions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Contact Section */}
            <div className="mt-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-mint-green p-8 text-center">
              <h3 className="mb-4 text-2xl font-bold text-foreground">
                Still Have Questions?
              </h3>
              <p className="mb-6 text-muted-foreground">
                Our team is here to help you understand how Aarthiq works
              </p>

              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-foreground">info@aarthiq.com</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-foreground">+977-1-XXXXXXX</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-foreground">Kathmandu, Nepal</span>
                </div>
              </div>

              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Contact Us
              </Button>

              <div className="mt-6 text-sm text-muted-foreground">
                <p className="font-medium">Business Hours:</p>
                <p>Sunday - Friday: 10:00 AM - 6:00 PM</p>
                <p>Response Time: Within 24 hours</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
              <p className="font-medium">Disclaimer:</p>
              <p className="mt-1">
                Aarthiq is a connection platform only. We do not provide investment advice, guarantee returns, or manage investments. All investment decisions are made at your own risk. Please consult with qualified financial advisors before investing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* List Your Business Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">List Your Business</DialogTitle>
            <DialogDescription>
              Fill out the form below and our team will contact you shortly.
            </DialogDescription>
          </DialogHeader>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  value={formData.phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className={phoneError ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {phoneError && (
                  <p className="text-sm text-red-500">{phoneError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your business..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Thank you for your interest!
              </h3>
              <p className="text-muted-foreground">
                Our team will contact you shortly with the next steps.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
