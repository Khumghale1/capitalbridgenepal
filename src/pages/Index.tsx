import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/business/BusinessCard";
import { CategoryCard } from "@/components/business/CategoryCard";
import { mockBusinesses, categories, stats } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function Index() {
  const navigate = useNavigate();

  // Show all businesses on home page
  const allBusinesses = mockBusinesses;

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Modal state for List Your Business form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
      setFormData({ businessName: "", email: "", phone: "" });
    }, 3000);
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
      <section className="relative overflow-hidden bg-gradient-subtle py-16 md:py-24 lg:py-32">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: 'url(/images/background2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
        />

        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="animate-fade-up mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Unlock Early Access to High-Growth Companies Before They Go Public
            </h1>
            <p
              className="animate-fade-up mb-8 text-lg  text-muted-foreground md:text-xl"
              style={{ animationDelay: "0.1s" }}
            >
              Explore top unlisted companies and build long-term wealth through informed decision
            </p>
            <div
              className="animate-fade-up flex flex-col items-center justify-center gap-4 sm:flex-row"
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
          <div className="grid gap-6 md:grid-cols-2">
            {allBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Submit
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
