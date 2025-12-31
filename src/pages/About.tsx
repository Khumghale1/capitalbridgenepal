import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Target,
  Eye,
  Heart,
  Users,
  Shield,
  Zap,
  Globe,
  Building2,
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Transparency",
      description:
        "We believe in open, honest communication. Every business is verified, and our processes are clear.",
    },
    {
      icon: Users,
      title: "Empowerment",
      description:
        "We empower both investors and businesses to make informed decisions and grow together.",
    },
    {
      icon: Zap,
      title: "Growth",
      description:
        "We're committed to fostering economic growth in Nepal by connecting capital with opportunity.",
    },
    {
      icon: Heart,
      title: "Trust",
      description:
        "Trust is the foundation of investment. We work hard to maintain it in every interaction.",
    },
  ];

  const stats = [
    { value: "248+", label: "Businesses Listed" },
    { value: "1,250+", label: "Connections Made" },
    { value: "NPR 2.5B+", label: "Investment Facilitated" },
    { value: "12", label: "Industry Categories" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-100/40 via-transparent to-purple-100/30" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="font-medium text-primary">
                About Aarthi<span className="text-green-600">Q</span>
              </span>
            </div>
            <h1
              className="animate-fade-up mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl"
              style={{ animationDelay: "0.1s" }}
            >
              Building Nepal's Investment{" "}
              <span className="text-gradient">Ecosystem</span>
            </h1>
            <p
              className="animate-fade-up text-lg text-muted-foreground md:text-xl"
              style={{ animationDelay: "0.2s" }}
            >
              We're on a mission to connect Nepal's growing businesses with
              investors who believe in their potential. Together, we're building
              a stronger economy.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  AarthiQ was born from a simple observation: Nepal has
                  incredible entrepreneurial talent, but connecting businesses
                  with the right investors has always been a challenge.
                </p>
                <p>
                  Traditional investment processes are often opaque, slow, and
                  favor those with existing connections. We wanted to change
                  that. Our platform democratizes access to investment
                  opportunities, making it easier for businesses to showcase
                  their potential and for investors to discover promising
                  ventures.
                </p>
                <p>
                  Today, we're proud to serve hundreds of businesses across
                  Nepal, from tech startups in Kathmandu to hydropower projects
                  in rural areas. Each connection we facilitate is a step toward
                  a more prosperous Nepal.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card p-6 text-center"
                >
                  <p className="text-3xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-hero">
                <Target className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">
                Our Mission
              </h3>
              <p className="text-muted-foreground">
                To create a transparent, accessible platform that connects
                Nepal's businesses with investors, fostering economic growth and
                entrepreneurial success across the nation.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
                <Eye className="h-7 w-7 text-accent-foreground" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">
                Our Vision
              </h3>
              <p className="text-muted-foreground">
                A Nepal where every promising business has access to the capital
                it needs to grow, and every investor can discover opportunities
                that match their goals and values.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              Our Values
            </h2>
            <p className="text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="overflow-hidden rounded-2xl bg-gradient-hero p-8 text-center md:p-16">
            <Globe className="mx-auto mb-6 h-16 w-16 text-primary-foreground opacity-80" />
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Join Us in Building Nepal's Future
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/90">
              Whether you're an investor looking for opportunities or a business
              seeking growth capital, we're here to help you succeed.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/businesses">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90"
                >
                  Explore Opportunities
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
