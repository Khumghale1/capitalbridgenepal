import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Users,
  FileText,
  Briefcase,
} from "lucide-react";

export default function Register() {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("company");
  const [formData, setFormData] = useState({
    // Company Information
    companyName: "",
    registrationNumber: "",
    panNumber: "",
    industry: "",
    foundedYear: "",
    companySize: "",

    // Contact Information
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    district: "",

    // Business Details
    description: "",
    fundingStage: "",
    investmentSought: "",
    useOfFunds: "",
    revenueModel: "",

    // Social Media
    linkedin: "",
    facebook: "",
    twitter: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Registration Submitted!",
      description: "Our team will review your submission within 2-3 business days.",
    });
    console.log("Form data:", formData);
  };

  const industries = [
    "Technology",
    "Agriculture",
    "Manufacturing",
    "Tourism & Hospitality",
    "Healthcare",
    "Education",
    "Financial Services",
    "Retail & E-commerce",
    "Real Estate",
    "Energy & Renewable",
    "Food & Beverage",
    "Other",
  ];

  const fundingStages = [
    "Pre-Seed",
    "Seed",
    "Series A",
    "Series B",
    "Series C+",
    "Growth Stage",
    "Revenue Generating",
  ];

  const companySizes = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "500+ employees",
  ];

  const nextTab = (next: string) => {
    setCurrentTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-subtle py-12 md:py-16">
        <div className="container text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero shadow-glow">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold text-foreground md:text-5xl">
            Register Your <span className="text-gradient">Business</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Complete the form below to list your business and start connecting with investors
          </p>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
                <TabsTrigger value="company" className="text-xs sm:text-sm">
                  <Building2 className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Company</span>
                </TabsTrigger>
                <TabsTrigger value="contact" className="text-xs sm:text-sm">
                  <Briefcase className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Contact</span>
                </TabsTrigger>
                <TabsTrigger value="business" className="text-xs sm:text-sm">
                  <FileText className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Business</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-xs sm:text-sm">
                  <Upload className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Documents</span>
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit}>
                {/* Tab 1: Company Information */}
                <TabsContent value="company">
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Information</CardTitle>
                      <CardDescription>
                        Tell us about your company and its basic details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            placeholder="ABC Pvt. Ltd."
                            value={formData.companyName}
                            onChange={(e) => handleInputChange("companyName", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registrationNumber">Company Registration Number *</Label>
                          <Input
                            id="registrationNumber"
                            placeholder="12345/078/079"
                            value={formData.registrationNumber}
                            onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="panNumber">PAN Number *</Label>
                          <Input
                            id="panNumber"
                            placeholder="123456789"
                            value={formData.panNumber}
                            onChange={(e) => handleInputChange("panNumber", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="foundedYear">Founded Year *</Label>
                          <Input
                            id="foundedYear"
                            type="number"
                            placeholder="2020"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={formData.foundedYear}
                            onChange={(e) => handleInputChange("foundedYear", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry *</Label>
                          <Select
                            value={formData.industry}
                            onValueChange={(value) => handleInputChange("industry", value)}
                            required
                          >
                            <SelectTrigger id="industry">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="companySize">Company Size *</Label>
                          <Select
                            value={formData.companySize}
                            onValueChange={(value) => handleInputChange("companySize", value)}
                            required
                          >
                            <SelectTrigger id="companySize">
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent>
                              {companySizes.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="button" onClick={() => nextTab("contact")} variant="hero">
                          Next: Contact Information
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab 2: Contact Information */}
                <TabsContent value="contact">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>
                        How can investors and visitors reach you?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="email">Business Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="info@company.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+977 1-XXXXXXX"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          placeholder="https://www.company.com"
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          placeholder="Thamel Marg, Ward No. 26"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="Kathmandu"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="district">District *</Label>
                          <Input
                            id="district"
                            placeholder="Kathmandu"
                            value={formData.district}
                            onChange={(e) => handleInputChange("district", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label>Social Media (Optional)</Label>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="linkedin" className="text-sm text-muted-foreground">
                              LinkedIn Profile
                            </Label>
                            <Input
                              id="linkedin"
                              placeholder="https://linkedin.com/company/..."
                              value={formData.linkedin}
                              onChange={(e) => handleInputChange("linkedin", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="facebook" className="text-sm text-muted-foreground">
                              Facebook Page
                            </Label>
                            <Input
                              id="facebook"
                              placeholder="https://facebook.com/..."
                              value={formData.facebook}
                              onChange={(e) => handleInputChange("facebook", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="twitter" className="text-sm text-muted-foreground">
                              Twitter/X Profile
                            </Label>
                            <Input
                              id="twitter"
                              placeholder="https://twitter.com/..."
                              value={formData.twitter}
                              onChange={(e) => handleInputChange("twitter", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" onClick={() => nextTab("company")} variant="outline">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button type="button" onClick={() => nextTab("business")} variant="hero">
                          Next: Business Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab 3: Business Details */}
                <TabsContent value="business">
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Details</CardTitle>
                      <CardDescription>
                        Provide details about your business and investment opportunity
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="description">Business Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your business, what you do, your unique value proposition, and market opportunity..."
                          rows={6}
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          This will be the main description investors see. Be clear and compelling.
                        </p>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fundingStage">Current Funding Stage *</Label>
                          <Select
                            value={formData.fundingStage}
                            onValueChange={(value) => handleInputChange("fundingStage", value)}
                            required
                          >
                            <SelectTrigger id="fundingStage">
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                              {fundingStages.map((stage) => (
                                <SelectItem key={stage} value={stage}>
                                  {stage}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="investmentSought">Investment Amount Sought (NPR) *</Label>
                          <Input
                            id="investmentSought"
                            type="number"
                            placeholder="5000000"
                            value={formData.investmentSought}
                            onChange={(e) => handleInputChange("investmentSought", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="useOfFunds">Use of Funds *</Label>
                        <Textarea
                          id="useOfFunds"
                          placeholder="Explain how you plan to use the investment (e.g., product development, marketing, team expansion, etc.)..."
                          rows={4}
                          value={formData.useOfFunds}
                          onChange={(e) => handleInputChange("useOfFunds", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="revenueModel">Revenue Model *</Label>
                        <Textarea
                          id="revenueModel"
                          placeholder="Describe how your business generates or plans to generate revenue..."
                          rows={4}
                          value={formData.revenueModel}
                          onChange={(e) => handleInputChange("revenueModel", e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" onClick={() => nextTab("contact")} variant="outline">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button type="button" onClick={() => nextTab("documents")} variant="hero">
                          Next: Upload Documents
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab 4: Documents & Submission */}
                <TabsContent value="documents">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Documents</CardTitle>
                      <CardDescription>
                        Upload required documents to complete your registration
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="companyLogo">Company Logo *</Label>
                            <Input
                              id="companyLogo"
                              type="file"
                              accept="image/*"
                              required
                            />
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, or SVG. Recommended size: 500x500px
                            </p>
                          </div>
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="registrationCert">Company Registration Certificate *</Label>
                            <Input
                              id="registrationCert"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              required
                            />
                            <p className="text-xs text-muted-foreground">PDF or image format</p>
                          </div>
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="panCert">PAN Certificate *</Label>
                            <Input
                              id="panCert"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              required
                            />
                            <p className="text-xs text-muted-foreground">PDF or image format</p>
                          </div>
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="pitchDeck">Pitch Deck *</Label>
                            <Input
                              id="pitchDeck"
                              type="file"
                              accept=".pdf,.ppt,.pptx"
                              required
                            />
                            <p className="text-xs text-muted-foreground">
                              PDF or PowerPoint format. Max 20MB
                            </p>
                          </div>
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="financials">Financial Documents (Optional)</Label>
                            <Input
                              id="financials"
                              type="file"
                              accept=".pdf,.xlsx,.xls"
                              multiple
                            />
                            <p className="text-xs text-muted-foreground">
                              Financial statements, projections, etc. (PDF or Excel)
                            </p>
                          </div>
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="otherDocs">Other Documents (Optional)</Label>
                            <Input
                              id="otherDocs"
                              type="file"
                              multiple
                            />
                            <p className="text-xs text-muted-foreground">
                              Business plan, market research, certifications, etc.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg bg-teal-50 p-6">
                        <div className="flex gap-3">
                          <CheckCircle className="h-6 w-6 shrink-0 text-primary" />
                          <div className="space-y-2">
                            <h4 className="font-semibold text-foreground">
                              What Happens Next?
                            </h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              <li>• Our team will review your submission within 2-3 business days</li>
                              <li>• You'll receive an email notification once approved</li>
                              <li>• Your business profile will go live on the platform</li>
                              <li>• You'll get access to your dashboard to manage inquiries</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <Button type="button" onClick={() => nextTab("business")} variant="outline">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button type="submit" variant="hero" size="lg">
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Submit Registration
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </form>
            </Tabs>

            {/* Pricing Reminder */}
            <Card className="mt-8 border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-hero">
                    <Users className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-semibold text-foreground">
                      Registration Fee: NPR 15,000 / year
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Once approved, you'll receive payment instructions to activate your listing.
                      Full refund available if not approved.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
