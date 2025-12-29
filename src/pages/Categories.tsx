import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { categories } from "@/data/mockData";
import {
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
  MoreHorizontal,
} from "lucide-react";

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
  Others: MoreHorizontal,
};

const categoryDescriptions: Record<string, string> = {
  "Tech Company": "Software, SaaS, mobile apps, and digital solutions",
  Hydropower: "Renewable energy and sustainable power generation",
  Fintech: "Digital payments, banking, and financial technology",
  Edtech: "Online learning, educational platforms, and tools",
  Manufacturing: "Industrial production and consumer goods",
  "Tourism & Hospitality": "Hotels, travel, and tourism services",
  Agriculture: "Farming, agri-tech, and food production",
  "Real Estate": "Property development and construction",
  Healthcare: "Medical services, pharma, and health tech",
  "Food & Beverage": "Restaurants, food production, and beverages",
};

export default function Categories() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-subtle py-16 md:py-24">
        <div className="container text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-foreground md:text-5xl">
            Browse by <span className="text-gradient">Industry</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Explore investment opportunities across Nepal's diverse economic
            sectors. Find businesses that match your investment interests.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = categoryIcons[category.name] || MoreHorizontal;
              const description =
                categoryDescriptions[category.name] ||
                "Explore investment opportunities in this sector";

              return (
                <Link
                  key={category.slug}
                  to={`/businesses?category=${category.slug}`}
                  className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 transition-all duration-300 group-hover:bg-primary group-hover:shadow-glow">
                    <Icon className="h-8 w-8 text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <h2 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {category.name}
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      {category.count} businesses
                    </span>
                    <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
                      Explore →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
