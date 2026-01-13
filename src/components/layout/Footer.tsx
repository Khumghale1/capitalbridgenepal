import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
} from "lucide-react";

const footerLinks = {
  company: [
    // { label: "About Us", href: "/about" },
    // { label: "Contact Us", href: "/contact" },
    // { label: "How It Works", href: "/how-it-works" },
  ],
  forBusinesses: [
    // { label: "For Businesses", href: "/for-businesses" },
    { label: "Dashboard", href: "/business/dashboard" },
    // { label: "Get Started", href: "/register" },
  ],
  forInvestors: [
    { label: "Browse Businesses", href: "/businesses" },
    // { label: "Categories", href: "/categories" },
    // { label: "Explore Opportunities", href: "/businesses" },
  ],
  legal: [
    // { label: "Terms & Conditions", href: "/terms" },
    // { label: "Privacy Policy", href: "/privacy" },
    // { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16 md:py-20">
        {/* Main Footer Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="mb-6 inline-flex items-center gap-3 group">
              <img
                src="/images/510be80db44060f3131651fdf4d26c58e86d4442.png"
                alt="aarthiQ Logo"
                className="h-12 w-12 transition-transform group-hover:scale-105"
              />
              <span className="text-xl font-bold text-foreground">
                aarthi<span className="text-green-600">Q</span>
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Connecting Nepal's growing businesses with investors seeking quality opportunities. 
              Empowering entrepreneurship and building Nepal's investment ecosystem.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="mailto:info@aarthiqnepal.com">info@aarthiqnepal.com</a>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span>+977 9840014401</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span>Kathmandu, Nepal</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          {/* <div>
            <h4 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wide">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* For Businesses Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wide">
              For Businesses
            </h4>
            <ul className="space-y-3">
              {footerLinks.forBusinesses.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Investors Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wide">
              For Investors
            </h4>
            <ul className="space-y-3">
              {footerLinks.forInvestors.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-border" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Left - Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} aarthi<span className="text-green-600">Q</span>. All rights reserved.
          </p>

          {/* Center - Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
                aria-label={social.label}
                title={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          {/* Right - Legal Links
          <div className="flex items-center gap-4 text-xs">
            {footerLinks.legal.map((link, index) => (
              <div key={link.href} className="flex items-center gap-4">
                <Link
                  to={link.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
                {index < footerLinks.legal.length - 1 && <span className="text-border">•</span>}
              </div>
            ))}
          </div> */}
        </div>

        {/* Made by */}
        <div className="mt-4 text-center text-xs text-muted-foreground border-t border-border pt-4">
          <p>Made by <span className="font-semibold text-foreground">SimplifyTech</span></p>
        </div>
      </div>
    </footer>
  );
}
