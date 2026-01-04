import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BusinessCard } from "@/components/business/BusinessCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

interface Business {
  id: string;
  name: string;
  registrationNumber: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  businessType: string;
  yearEstablished: number;
  location: string;
  teamSize: string;
  paidUpCapital: number;
  investmentCapacityMin: number;
  investmentCapacityMax: number;
  pricePerUnit?: number;
  expectedReturnOptions?: string;
  estimatedMarketValuation?: number;
  ipoTimeHorizon?: string;
  briefDescription: string;
  fullDescription?: string;
  growthPlans?: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  logoUrl?: string;
  viewCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Businesses() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    investment: true,
    location: true,
  });

  // Real businesses data
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Array<{ name: string; slug: string; count: number }>>([]);

  const locations = ["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Butwal", "Birgunj"];

  // Fetch businesses from API
  useEffect(() => {
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Read URL parameters and set initial state
  useEffect(() => {
    const query = searchParams.get("q");
    const category = searchParams.get("category");

    if (query) {
      setSearchQuery(query);
    }

    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);

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

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery("");
  };

  const handleViewDetails = (business: Business) => {
    navigate(`/businesses/${business.id}`);
  };

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      searchQuery === "" ||
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.briefDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(business.category.name);

    return matchesSearch && matchesCategory;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const FilterSection = ({ title, isOpen, onToggle, children }: any) => (
    <div className="border-b border-border pb-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-foreground"
      >
        {title}
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );

  const FilterSidebar = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {selectedCategories.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        )}
      </div>

      <FilterSection
        title="Category"
        isOpen={expandedFilters.category}
        onToggle={() =>
          setExpandedFilters((prev) => ({ ...prev, category: !prev.category }))
        }
      >
        {categories.map((category) => (
          <label
            key={category.slug}
            className="flex cursor-pointer items-center gap-2"
          >
            <Checkbox
              checked={selectedCategories.includes(category.name)}
              onCheckedChange={() => toggleCategory(category.name)}
            />
            <span className="text-sm text-foreground">{category.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              ({category.count})
            </span>
          </label>
        ))}
      </FilterSection>

      <FilterSection
        title="Investment Range"
        isOpen={expandedFilters.investment}
        onToggle={() =>
          setExpandedFilters((prev) => ({
            ...prev,
            investment: !prev.investment,
          }))
        }
      >
        <div className="space-y-2">
          {[
            "Under 5 Lakhs",
            "5-10 Lakhs",
            "10-50 Lakhs",
            "50 Lakhs - 1 Crore",
            "Above 1 Crore",
          ].map((range) => (
            <label key={range} className="flex cursor-pointer items-center gap-2">
              <Checkbox />
              <span className="text-sm text-foreground">{range}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Location"
        isOpen={expandedFilters.location}
        onToggle={() =>
          setExpandedFilters((prev) => ({ ...prev, location: !prev.location }))
        }
      >
        {locations.map((location) => (
          <label key={location} className="flex cursor-pointer items-center gap-2">
            <Checkbox />
            <span className="text-sm text-foreground">{location}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  );

  return (
    <Layout>
      {/* Page Header */}
      <section className="border-b border-border bg-secondary/30 py-8">
        <div className="container">
          <nav className="mb-4 text-sm text-muted-foreground">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">Browse Businesses</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Investment Opportunities in Nepal
          </h1>
          <p className="mt-2 text-muted-foreground">
            Showing {filteredBusinesses.length} businesses
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 rounded-xl border border-border bg-card p-4">
                <FilterSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Sort Bar */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by company name or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 w-full rounded-lg border border-input bg-background pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setIsMobileFilterOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-11 rounded-lg border border-input bg-background px-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="investment-low">Investment: Low to High</option>
                  <option value="investment-high">Investment: High to Low</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
              </div>

              {/* Active Filters */}
              {selectedCategories.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Active filters:
                  </span>
                  {selectedCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="cursor-pointer gap-1 hover:bg-secondary/80"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              )}

              {/* Loading State */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <span className="ml-3 text-lg text-muted-foreground">Loading businesses...</span>
                </div>
              ) : filteredBusinesses.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
                  {filteredBusinesses.map((business) => (
                    <div
                      key={business.id}
                      onClick={() => handleViewDetails(business)}
                      className="cursor-pointer transition-transform hover:scale-[1.02]"
                    >
                      <BusinessCard business={business} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    No businesses found
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {filteredBusinesses.length > 0 && (
                <div className="mt-8 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing 1-{filteredBusinesses.length} of{" "}
                    {filteredBusinesses.length} results
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/50"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-full bg-background p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FilterSidebar />
            <div className="mt-6">
              <Button
                className="w-full"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
