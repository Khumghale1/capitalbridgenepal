import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BusinessCard } from "@/components/business/BusinessCard";
import { mockBusinesses } from "@/data/mockData";
import {
  MapPin,
  Calendar,
  Users,
  Globe,
  Mail,
  Phone,
  Share2,
  Bookmark,
  FileText,
  Video,
  Image,
  Building2,
  TrendingUp,
  ShieldCheck,
  Lock,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

  const business = mockBusinesses.find((b) => b.id === id);

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

  const relatedBusinesses = mockBusinesses
    .filter((b) => b.category === business.category && b.id !== business.id)
    .slice(0, 3);

  const handleInterestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Interest Submitted!",
      description: "The business will be notified of your interest.",
    });
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
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-secondary md:h-24 md:w-24">
                    <Building2 className="h-10 w-10 text-muted-foreground md:h-12 md:w-12" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                        {business.name}
                      </h1>
                      {business.isVerified && (
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
                        {business.category}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{business.tagline}</p>
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
                      NPR {formatCurrency(business.investmentMin)} -{" "}
                      {formatCurrency(business.investmentMax)}
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
                    <p className="font-bold text-foreground">2019</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Team Size</p>
                    <p className="font-bold text-foreground">25+ Employees</p>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-8 rounded-xl border border-border bg-card p-6 md:p-8">
                <h2 className="mb-4 text-xl font-bold text-foreground">
                  About the Business
                </h2>
                <div className="prose prose-gray max-w-none text-muted-foreground">
                  <p>
                    {business.name} is a leading company in the{" "}
                    {business.category} sector, based in {business.location}. We
                    are committed to delivering innovative solutions that
                    address the unique challenges of our market.
                  </p>
                  <p>
                    Our mission is to create sustainable value for our
                    stakeholders while contributing to Nepal's economic growth.
                    With a strong foundation and proven track record, we are now
                    seeking investment to accelerate our expansion plans.
                  </p>
                </div>
              </div>

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
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">
                      Use of Funds
                    </h3>
                    <ul className="ml-5 list-disc space-y-1">
                      <li>Market expansion (40%)</li>
                      <li>Technology development (30%)</li>
                      <li>Team building (20%)</li>
                      <li>Working capital (10%)</li>
                    </ul>
                  </div>
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
                        info@{business.name.toLowerCase().replace(/\s/g, "")}
                        .com
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
                        +977 1-4XXXXXX
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Website</p>
                      <p className="font-medium text-primary hover:underline">
                        www.{business.name.toLowerCase().replace(/\s/g, "")}.com
                      </p>
                    </div>
                  </div>
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
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="+977 9XXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-foreground">
                        Message
                      </label>
                      <textarea
                        rows={3}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Tell us about your investment interest..."
                      />
                    </div>
                    <label className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        required
                        className="mt-1 rounded border-input"
                      />
                      <span className="text-muted-foreground">
                        I agree to the Terms & Conditions and Privacy Policy
                      </span>
                    </label>
                    <Button type="submit" variant="hero" className="w-full">
                      Submit Interest
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
                        12345/2019
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Business Type
                      </span>
                      <span className="font-medium text-foreground">
                        Pvt. Ltd.
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Year Established
                      </span>
                      <span className="font-medium text-foreground">2019</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employees</span>
                      <span className="font-medium text-foreground">25+</span>
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
