import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Search,
  FileText,
  Handshake,
  ClipboardList,
  Presentation,
  Users,
  ArrowRight,
  CheckCircle,
  Shield,
  Zap,
  MessageCircle,
} from "lucide-react";

export default function HowItWorks() {
  const investorSteps = [
    {
      icon: Search,
      number: "1",
      title: "Browse Opportunities",
      description:
        "Explore our curated list of businesses seeking investment. Use filters to find opportunities that match your investment criteria, preferred industry, and location.",
      details: [
        "Filter by category, investment range, and location",
        "View verified business profiles",
        "Compare multiple opportunities",
      ],
    },
    {
      icon: FileText,
      number: "2",
      title: "Review Details",
      description:
        "Access comprehensive business profiles including pitch decks, financial information, team details, and growth projections to make informed decisions.",
      details: [
        "Download pitch decks and brochures",
        "Watch company presentation videos",
        "Review financial highlights",
      ],
    },
    {
      icon: Handshake,
      number: "3",
      title: "Connect Directly",
      description:
        "Found an opportunity you like? Submit your interest directly to the business. No intermediaries, no delays - just direct communication.",
      details: [
        "Submit interest form with your details",
        "Receive direct response from business",
        "Schedule meetings and discussions",
      ],
    },
  ];

  const businessSteps = [
    {
      icon: ClipboardList,
      number: "1",
      title: "Register Your Business",
      description:
        "Create your business profile by providing company details, investment requirements, and uploading your documents. The process takes just 15 minutes.",
      details: [
        "Fill in basic company information",
        "Specify investment requirements",
        "Upload company registration documents",
      ],
    },
    {
      icon: Presentation,
      number: "2",
      title: "Showcase Your Potential",
      description:
        "Make your profile stand out by uploading pitch decks, videos, brochures, and financial information. Show investors why they should invest in you.",
      details: [
        "Upload pitch deck and presentations",
        "Add company videos and media",
        "Highlight financial performance",
      ],
    },
    {
      icon: Users,
      number: "3",
      title: "Receive Investor Interest",
      description:
        "Once approved, your profile goes live. Receive inquiries from interested investors directly in your dashboard and manage communications efficiently.",
      details: [
        "Get notified of new inquiries",
        "Manage all leads in dashboard",
        "Track profile views and engagement",
      ],
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Listings",
      description:
        "Every business is reviewed by our team before listing to ensure authenticity and quality.",
    },
    {
      icon: Zap,
      title: "Direct Communication",
      description:
        "No middlemen. Investors connect directly with businesses for faster, more efficient discussions.",
    },
    {
      icon: MessageCircle,
      title: "Secure Platform",
      description:
        "Your data and communications are protected with enterprise-grade security measures.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-100/40 via-transparent to-purple-100/30" />
        <div className="container relative text-center">
          <h1 className="animate-fade-up mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            How <span className="text-gradient">Aarthi<span className="text-green-600">Q</span></span> Works
          </h1>
          <p
            className="animate-fade-up mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl"
            style={{ animationDelay: "0.1s" }}
          >
            Connecting businesses with investors in three simple steps. Whether
            you're looking to invest or raise funds, we've made it easy.
          </p>
        </div>
      </section>

      {/* For Investors */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12">
            <div className="mb-2 inline-block rounded-full bg-teal-50 px-4 py-1 text-sm font-medium text-primary">
              For Investors
            </div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Find Your Next Investment
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {investorSteps.map((step, index) => (
              <div
                key={index}
                className="relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
              >
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-hero font-bold text-primary-foreground">
                  {step.number}
                </div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-50">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mb-4 text-muted-foreground">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span className="text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/businesses">
              <Button variant="hero" size="lg">
                Browse Investment Opportunities
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Businesses */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <div className="mb-12">
            <div className="mb-2 inline-block rounded-full bg-purple-50 px-4 py-1 text-sm font-medium text-accent">
              For Businesses
            </div>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Raise Funds for Your Business
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {businessSteps.map((step, index) => (
              <div
                key={index}
                className="relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent/20 hover:shadow-lg"
              >
                <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-accent font-bold text-accent-foreground">
                  {step.number}
                </div>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-50">
                  <step.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mb-4 text-muted-foreground">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span className="text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/register">
              <Button variant="accent" size="lg">
                Register Your Business
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              Why Choose Our Platform
            </h2>
            <p className="text-muted-foreground">
              Built for trust, efficiency, and success
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-hero">
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
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
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 p-8 text-center md:p-12">
              <h3 className="mb-4 text-2xl font-bold text-primary-foreground md:text-3xl">
                Ready to Invest?
              </h3>
              <p className="mb-6 text-primary-foreground/90">
                Discover opportunities in Nepal's growing economy
              </p>
              <Link to="/businesses">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90"
                >
                  Browse Businesses
                </Button>
              </Link>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-center md:p-12">
              <h3 className="mb-4 text-2xl font-bold text-accent-foreground md:text-3xl">
                Ready to Raise Funds?
              </h3>
              <p className="mb-6 text-accent-foreground/90">
                Showcase your business to qualified investors
              </p>
              <Link to="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90"
                >
                  Register Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
