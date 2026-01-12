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
  // const [searchQuery, setSearchQuery] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("");

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


  return (
    <Layout>
    {/* Hero Section */}
      <section className="relative overflow-visible flex items-center justify-center bg-[#DBE5E1]  lg:py-20 lg:min-h-[70vh]">
        <div className="relative mx-auto hidden lg:block w-[1358px] rounded-[15px]">

          {/* Text Content - Left Side */}
          <div className="relative z-10 flex flex-col animate-fade-up w-[900px] pl-[10px] pt-[80px] pb-[80px] gap-[23px]">
            <h1 className="text-5xl font-extrabold text-foreground xl:text-6xl">
              Access Exclusive Investment<br />
              Opportunities in Nepal
            </h1>
            <p className="text-base text-foreground">
              Explore top unlisted companies and build long-term wealth <br />
              through informed decision.

            </p>

            <div className="flex flex-row items-start gap-4 mt-2">
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

          {/* Hero Image - Right Side */}
          <div className="absolute w-[822px] h-auto top-0 left-[700px] -translate-y-[43px]">
            <img
              src="/images/9e8992070dba3d515547d05d8848e3aa1b68be42.png"
              alt="Investment Opportunities Illustration"
              className="w-full h-auto object-contain rounded-[20px]"
            />
          </div>

        </div>

        {/* iPad View - Image top, text middle, buttons bottom */}
        <div className="relative w-full px-6 py-16 hidden md:block lg:hidden">
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
            {/* Image on Top */}
            <div className="w-full">
              <img
                src="/images/9e8992070dba3d515547d05d8848e3aa1b68be42.png"
                alt="Investment Opportunities Illustration"
                className="w-full h-auto max-w-2xl mx-auto rounded-[20px]"
              />
            </div>

            {/* Text in Middle */}
            <div className="flex flex-col gap-4 text-center w-full px-4 md:px-0">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                Access Exclusive <span className="text-green-400">Investment</span><br />
                <span className="text-green-400">Opportunities</span> in Nepal.
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-foreground">
                Explore top unlisted companies and build long-term wealth through informed decision.
              </p>
            </div>

            {/* Buttons at Bottom */}
            <div className="flex  items-center gap-4 justify-center">
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
        </div>

        {/* Mobile View - Image as background */}
        <div className="relative w-full px-3 py-5 md:hidden ">
          <div className="max-w-xl mx-auto flex flex-col items-center gap-6 text-center">
            {/* Centered Text */}
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
              Access Exclusive <span className="text-green-800">Investment</span><br />
              <span className="text-green-800">Opportunities</span> in Nepal
            </h1>
            <p className="text-sm md:text-base text-foreground">
              Explore top unlisted companies and build long-term wealth through informed decision.
            </p>

            {/* Centered Buttons - Side by Side */}
            <div className="flex flex-row items-center gap-2 w-full justify-center flex-wrap">
              <Link to="/businesses" className="flex-1 min-w-fit">
                <Button variant="hero"  className=" px-4 py-1 text-xs w-full">
                  Browse Businesses
                </Button>
              </Link>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="hero-outline"
                className=" px-4 py-1 text-xs flex-1 min-w-fit"
              >
                List Your Business
              </Button>
            </div>

            {/* Image Below */}
            <div className="w-full mt-6">
              <img
                src="/images/9e8992070dba3d515547d05d8848e3aa1b68be42.png"
                alt="Investment Opportunities Illustration"
                className="w-full h-auto max-w-sm mx-auto rounded-[20px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* All Business Listings */}
      <section className="py-16 md:py-24 bg-[#F4F4F4]">
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

      {/* White Container for Stats, Sectors, FAQ, CTA */}
      <section className="py-16 md:py-20 ">
        <div className="container">
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 lg:p-16">

            {/* Backed by Real Numbers Section */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center mb-16">
              {/* Left Side - Text */}
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Backed by Real Numbers
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  AarthiQ connects investors with verified private companies across Nepal, fostering transparent partnerships that lead to smarter decisions and real economic growth. With every connection supported by reliable data and genuine opportunities, we help build confidence in Nepal's emerging investment ecosystem.
                </p>
              </div>

              {/* Right Side - Stats */}
              <div className="flex gap-8 lg:gap-12">
                <div className="text-center">
                  <p className="text-2xl md:text-5xl font-bold text-foreground mb-2">
                    {stats.connectionsMade}+
                  </p>
                  <p className="text-sm text-muted-foreground">Connections Made</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-5xl font-bold text-foreground mb-2">
                    {stats.totalCategories}
                  </p>
                  <p className="text-sm text-muted-foreground">Investment Sectors</p>
                </div>
              </div>
            </div>

            {/* Explore Our Sectors */}
            <div className="mb-16">
              <div className="mb-10 text-center">
                <h2 className="mb-2 text-2xl font-bold text-foreground md:text-4xl">
                  Explore Our Sectors
                </h2>
                <p className="text-muted-foreground text-xs">
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

            {/* FAQ Section */}
            <div className="mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                {/* Left Side - Title + Contact */}
                <div className="lg:col-span-3 flex flex-col">
                  <h2 className="text-2xl font-bold text-foreground md:text-3xl mb-auto">
                    Frequently Asked Questions
                  </h2>

                  {/* Still have a question? - Contact Section */}
                  <div className="rounded-2xl p-6 mt-8" style={{ backgroundColor: '#F2F2F2' }}>
                    <h3 className="text-base font-bold text-foreground mb-2">
                      Still have a question?
                    </h3>
                    <p className="text-xs text-muted-foreground mb-6">
                      Feel free to reach out through any of our channels. We're here to help you explore opportunities, answer your questions, and guide you through the Aarthiq platform.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-foreground">Email</p>
                          <p className="text-xs text-muted-foreground">info@aarthiq.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-foreground">Phone</p>
                          <p className="text-xs text-muted-foreground">+977-1-XXXXXXX</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-foreground">Location</p>
                          <p className="text-xs text-muted-foreground">Kathmandu, Nepal</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - FAQ Accordion */}
                <div className="lg:col-span-2">
                  <Accordion type="single" collapsible className="space-y-5">
                    {/* Question 1 */}
                    <AccordionItem value="item-1" className="rounded-lg border-0 px-5  shadow-none" style={{ backgroundColor: '#F2F2F2' }}>
                      <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:text-primary hover:no-underline">
                        What is Aarthiq?
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 text-xs text-muted-foreground">
                        Aarthiq is Nepal's premier digital platform connecting investors with high-growth, pre-IPO companies.
                      </AccordionContent>
                    </AccordionItem>

                    {/* Question 2 */}
                    <AccordionItem value="item-2" className="rounded-lg border-0 px-5  shadow-none" style={{ backgroundColor: '#F2F2F2' }}>
                      <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:text-primary hover:no-underline">
                        How do I invest in businesses through Aarthiq?
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 text-xs text-muted-foreground">
                        Browse businesses, research opportunities, submit your interest, and connect directly with companies.
                      </AccordionContent>
                    </AccordionItem>

                    {/* Question 3 */}
                    <AccordionItem value="item-3" className="rounded-lg border-0 px-5  shadow-none" style={{ backgroundColor: '#F2F2F2' }}>
                      <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:text-primary hover:no-underline">
                        How can my business get listed on Aarthiq?
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 text-xs text-muted-foreground">
                        Click "List Your Business" and our team will guide you through the registration process.
                      </AccordionContent>
                    </AccordionItem>

                    {/* Question 4 */}
                    <AccordionItem value="item-4" className="rounded-lg border-0 px-5  shadow-none" style={{ backgroundColor: '#F2F2F2' }}>
                      <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:text-primary hover:no-underline">
                        Is my investment safe? What are the risks?
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 text-xs text-muted-foreground">
                        All investments carry risks. We verify businesses but recommend conducting your own due diligence.
                      </AccordionContent>
                    </AccordionItem>

                    {/* Question 5 */}
                    <AccordionItem value="item-5" className="rounded-lg border-0 px-5  shadow-none" style={{ backgroundColor: '#F2F2F2' }}>
                      <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:text-primary hover:no-underline">
                        How do I invest in businesses through Aarthiq?
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 text-xs text-muted-foreground">
                        Browse businesses, research opportunities, submit your interest, and connect directly with companies.
                      </AccordionContent>
                    </AccordionItem>

                    {/* Question 6 */}
                    <AccordionItem value="item-6" className="rounded-lg border-0 px-5  shadow-none" style={{ backgroundColor: '#F2F2F2' }}>
                      <AccordionTrigger className="text-left text-sm font-medium text-foreground hover:text-primary hover:no-underline">
                        How do I manage my business profile after approval?
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 text-xs text-muted-foreground">
                        Login to your dashboard to edit information, view inquiries, and manage your investment opportunities.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>

            {/* CTA Section with Mobile Image */}
            <div className="relative overflow-visible rounded-2xl bg-gradient-hero py-12 px-8 md:py-16 md:px-12 lg:py-20 lg:px-16">
              {/* Mobile Phone Image - Positioned at top right, extending above container */}
              <div className="absolute -top-12 right-8 md:right-12 lg:right-16 hidden lg:block z-20">
                <img
                  src="/images/14c299561939aba34d0f808da4a88bf13dd4680f.png"
                  alt="Investment Growth"
                  className="h-96 w-auto object-contain"
                />
              </div>

              {/* Left Side - Text Content */}
              <div className="relative z-10 max-w-2xl mx-4">
                <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
                  Ready to Find Your Next Investment?
                </h2>
                <p className="mb-8 text-primary-foreground/90 text-sm md:text-base">
                  Join hundreds of investors discovering opportunities in Nepal's growing economy. Start exploring today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/businesses">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="bg-white text-foreground hover:bg-white/90 font-semibold"
                    >
                      Browse Businesses
                    </Button>
                  </Link>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="outline"
                    size="lg"
                    className="border-white border-2 bg-transparent text-white hover:bg-white/10 font-semibold"
                  >
                    List Your Business
                  </Button>
                </div>
              </div>
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
