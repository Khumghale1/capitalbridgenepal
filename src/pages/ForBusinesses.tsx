import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Users,
  Presentation,
  MessageSquare,
  ShieldCheck,
  Eye,
  Zap,
  ArrowRight,
  CheckCircle,
  FileText,
  Video,
  Image as ImageIcon,
  BarChart3,
  ClipboardCheck,
  Clock,
  Globe,
  Star,
} from "lucide-react";

export default function ForBusinesses() {
  const benefits = [
    {
      icon: Users,
      title: "Reach Qualified Investors",
      description:
        "Connect with investors actively seeking opportunities in Nepal's growing market.",
    },
    {
      icon: Presentation,
      title: "Professional Showcase",
      description:
        "Present your business with a polished profile including pitch decks, videos, and documents.",
    },
    {
      icon: MessageSquare,
      title: "Direct Inquiries",
      description:
        "Receive investor interest directly in your dashboard without intermediaries.",
    },
    {
      icon: ShieldCheck,
      title: "Verified Platform",
      description:
        "Build trust with verification badges that signal credibility to investors.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Track profile views, investor interest, and engagement metrics in real-time.",
    },
    {
      icon: Globe,
      title: "Wide Exposure",
      description:
        "Get visibility across our growing network of domestic and international investors.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Register",
      description:
        "Fill in your business details and upload required documents. The process takes just 15 minutes.",
      icon: ClipboardCheck,
    },
    {
      number: "02",
      title: "Review",
      description:
        "Our team reviews your submission within 2-3 business days to ensure quality and accuracy.",
      icon: Clock,
    },
    {
      number: "03",
      title: "Publish",
      description:
        "Once approved, your profile goes live and becomes visible to all platform visitors.",
      icon: Globe,
    },
    {
      number: "04",
      title: "Connect",
      description:
        "Start receiving investor inquiries and manage all communications through your dashboard.",
      icon: Users,
    },
  ];

  const uploadFeatures = [
    { icon: FileText, label: "Pitch Deck (PDF/PPT)" },
    { icon: Video, label: "Company Videos" },
    { icon: FileText, label: "Financial Documents" },
    { icon: ImageIcon, label: "Business Brochures" },
    { icon: Users, label: "Team Information" },
    { icon: ImageIcon, label: "Photos & Gallery" },
  ];

  const faqs = [
    {
      question: "What documents do I need to register?",
      answer:
        "You'll need your company registration certificate, PAN certificate, and a pitch deck. Financial documents and other materials can be added later.",
    },
    {
      question: "How long does approval take?",
      answer:
        "Our team reviews submissions within 2-3 business days. You'll receive an email notification once your profile is approved.",
    },
    {
      question: "Can I edit my profile after publishing?",
      answer:
        "Yes! You can update your profile, add new documents, and modify information at any time through your dashboard.",
    },
    {
      question: "What if I don't receive investor interest?",
      answer:
        "Our team can help optimize your profile. We also provide tips and best practices to make your listing more attractive to investors.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "If your business is not approved during the review process, we offer a full refund of the registration fee.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-teal-100/30" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="animate-fade-up mb-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              Showcase Your Business to{" "}
              <span className="text-gradient">Investors</span>
            </h1>
            <p
              className="animate-fade-up mb-8 text-lg text-muted-foreground md:text-xl"
              style={{ animationDelay: "0.1s" }}
            >
              Connect with investors actively seeking opportunities in Nepal.
              Present your business professionally and receive direct inquiries.
            </p>
            <div
              className="animate-fade-up flex flex-col items-center justify-center gap-4 sm:flex-row"
              style={{ animationDelay: "0.2s" }}
            >
              <Link to="/register">
                <Button variant="hero" size="xl">
                  Register Your Business
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="hero-outline" size="xl">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              Why List Your Business?
            </h2>
            <p className="text-muted-foreground">
              Everything you need to connect with the right investors
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
                  <benefit.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              How It Works for Businesses
            </h2>
            <p className="text-muted-foreground">
              Simple steps to get your business in front of investors
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-12 hidden h-0.5 w-full bg-border lg:block" />
                )}
                <div className="relative z-10 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero text-2xl font-bold text-primary-foreground shadow-glow">
                    {step.number}
                  </div>
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Can Upload */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                What You Can Upload
              </h2>
              <p className="mb-8 text-muted-foreground">
                Create a comprehensive business profile with all the materials
                investors need to make informed decisions.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {uploadFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-teal-50 to-purple-50 p-8">
              <div className="mb-6 flex items-center gap-3">
                <Star className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-bold text-foreground">
                  Professional Profile
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  "High-quality company logo display",
                  "Detailed investment opportunity description",
                  "Embedded video presentations",
                  "Downloadable pitch deck and brochures",
                  "Team member profiles with photos",
                  "Direct contact information",
                  "Social media links integration",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-secondary/30 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground">
              No hidden fees, no surprises
            </p>
          </div>

          <div className="mx-auto max-w-md">
            <div className="overflow-hidden rounded-2xl border-2 border-primary bg-card shadow-xl">
              <div className="bg-gradient-hero p-6 text-center text-primary-foreground">
                <h3 className="mb-2 text-xl font-bold">Business Listing</h3>
                <p className="text-primary-foreground/80">
                  Everything you need to get started
                </p>
              </div>
              <div className="p-6">
                <div className="mb-6 text-center">
                  <span className="text-4xl font-bold text-foreground">
                    NPR 15,000
                  </span>
                  <span className="text-muted-foreground"> / year</span>
                </div>
                <ul className="mb-6 space-y-3">
                  {[
                    "Complete business profile",
                    "Unlimited document uploads",
                    "Video embedding support",
                    "Investor inquiry management",
                    "Analytics dashboard",
                    "Verification badge",
                    "Priority support",
                    "12-month listing validity",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <Button variant="hero" size="lg" className="w-full">
                    Register Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Common questions about listing your business
            </p>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/20"
              >
                <h3 className="mb-2 font-semibold text-foreground">
                  {faq.question}
                </h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
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
              Ready to Get Started?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/90">
              Join the growing list of businesses connecting with investors on
              AarthiQ. Your next investor is just a click away.
            </p>
            <Link to="/register">
              <Button
                variant="secondary"
                size="xl"
                className="bg-background text-foreground hover:bg-background/90"
              >
                Register Your Business
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
