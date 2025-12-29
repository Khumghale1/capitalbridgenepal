import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
} from "lucide-react";

export default function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "contact@investnepal.com",
      link: "mailto:contact@investnepal.com",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+977 1-4XXXXXX",
      link: "tel:+97714XXXXXX",
    },
    {
      icon: MapPin,
      title: "Address",
      value: "Thamel, Kathmandu, Nepal",
      link: "https://maps.google.com",
    },
    {
      icon: Clock,
      title: "Office Hours",
      value: "Sun - Fri: 10 AM - 6 PM",
      link: null,
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-subtle py-16 md:py-24">
        <div className="container text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-foreground md:text-5xl">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Have questions or feedback? We'd love to hear from you. Our team is
            here to help.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <h2 className="mb-6 text-2xl font-bold text-foreground">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="+977 9XXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Subject *
                  </label>
                  <select
                    required
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="business">Business Registration</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="How can we help you?"
                  />
                </div>
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-6 text-2xl font-bold text-foreground">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-50">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {item.title}
                        </p>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="font-medium text-foreground hover:text-primary"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="font-medium text-foreground">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-foreground">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="overflow-hidden rounded-xl border border-border bg-secondary/50">
                <div className="flex h-64 items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Thamel, Kathmandu, Nepal
                    </p>
                    <a
                      href="https://maps.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-primary hover:underline"
                    >
                      View on Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
