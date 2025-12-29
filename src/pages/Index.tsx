import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { BusinessCard } from "@/components/business/BusinessCard";
import { CategoryCard } from "@/components/business/CategoryCard";
import { mockBusinesses, categories, stats } from "@/data/mockData";
import {
  Search,
  ArrowRight,
  Building2,
  FileText,
  Handshake,
  ClipboardList,
  Presentation,
  Users,
  ShieldCheck,
  Eye,
  Zap,
  Lock,
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
};

export default function Index() {
  const featuredBusinesses = mockBusinesses
    .filter((b) => b.isFeatured)
    .slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100/40 via-transparent to-purple-100/30" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="animate-fade-up mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Discover Nepal's Next Big{" "}
              <span className="text-gradient">Investment Opportunity</span>
            </h1>
            <p
              className="animate-fade-up mb-8 text-lg text-muted-foreground md:text-xl"
              style={{ animationDelay: "0.1s" }}
            >
              Connect with growing businesses seeking investment. Find verified
              opportunities across industries and build the future of Nepal
              together.
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
              <Link to="/register">
                <Button variant="hero-outline" size="xl">
                  List Your Business
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
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
                className="h-12 w-full rounded-lg border border-input bg-background pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select className="h-12 rounded-lg border border-input bg-background px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Button variant="default" size="lg">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                Featured Investment Opportunities
              </h2>
              <p className="text-muted-foreground">
                Handpicked businesses actively seeking investment
              </p>
            </div>
            <Link to="/businesses" className="hidden md:block">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/businesses">
              <Button variant="outline" className="gap-2">
                View All Businesses <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <div className="mb-10 text-center">
            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              Explore by Industry
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

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Simple steps to connect investors with businesses
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* For Investors */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="mb-6 text-xl font-bold text-foreground">
                For Investors
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: Search,
                    title: "Browse",
                    description:
                      "Explore businesses seeking investment across various industries",
                  },
                  {
                    icon: FileText,
                    title: "Review",
                    description:
                      "Access detailed business profiles, pitch decks & financial materials",
                  },
                  {
                    icon: Handshake,
                    title: "Connect",
                    description:
                      "Submit your interest directly to businesses you want to invest in",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Businesses */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <h3 className="mb-6 text-xl font-bold text-foreground">
                For Businesses
              </h3>
              <div className="space-y-6">
                {[
                  {
                    icon: ClipboardList,
                    title: "Register",
                    description:
                      "Create your business profile with company details and documents",
                  },
                  {
                    icon: Presentation,
                    title: "Showcase",
                    description:
                      "Upload pitch decks, videos, brochures & financial information",
                  },
                  {
                    icon: Users,
                    title: "Connect",
                    description:
                      "Receive inquiries directly from interested investors",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                      <step.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              Why Choose InvestNepal
            </h2>
            <p className="text-muted-foreground">
              Building trust through transparency and professionalism
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "Verified Businesses",
                description:
                  "Every business is reviewed and verified before listing",
              },
              {
                icon: Eye,
                title: "No Hidden Fees",
                description: "Transparent pricing with no surprise charges",
              },
              {
                icon: Zap,
                title: "Direct Connections",
                description:
                  "Connect directly with businesses without intermediaries",
              },
              {
                icon: Lock,
                title: "Secure Platform",
                description:
                  "Your data is protected with enterprise-grade security",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-hero">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
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
              <Link to="/register">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  List Your Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
