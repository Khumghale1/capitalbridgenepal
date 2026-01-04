/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { api } from "@/lib/api";
import {
  Building2,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Users,
  FileText,
  Briefcase,
  Loader2,
  AlertCircle,
  XCircle,
  Lock,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Register() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Token validation state
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [businessInfo, setBusinessInfo] = useState<any>(null);
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);

  const [currentTab, setCurrentTab] = useState("company");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Authentication
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get('token');

      // No token provided - show error
      if (!token) {
        setTokenError('No registration token provided. This page requires a valid invitation link.');
        setIsValidatingToken(false);

        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
        return;
      }

      try {
        setIsValidatingToken(true);
        setTokenError(null);

        // Validate token with backend
        const response: any = await api.onboarding.validateToken(token);

        if (response.isValid) {
          setIsValidToken(true);
          setBusinessInfo(response);
          setRegistrationToken(token);

          // Pre-fill email from token validation
          if (response.email) {
            setFormData((prev) => ({ ...prev, email: response.email }));
          }
        } else {
          setTokenError(response.message || 'Invalid or expired registration token.');
          setIsValidToken(false);

          // Redirect to home after 3 seconds
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (error) {
        setTokenError(error instanceof Error ? error.message : 'Failed to validate registration token.');
        setIsValidToken(false);

        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [searchParams, navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationToken) {
      toast({
        title: "Error",
        description: "Invalid registration token.",
        variant: "destructive",
      });
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Password and Confirm Password do not match.",
        variant: "destructive",
      });
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    // Validate terms acceptance
    if (!formData.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "You must accept the Terms and Conditions to register.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.onboarding.register({
        token: registrationToken,
        ...formData,
      });

      toast({
        title: "Registration Submitted!",
        description: "Your account has been created. Please wait for admin approval before logging in.",
      });

      // Redirect to business login after success
      setTimeout(() => {
        navigate('/business/login');
      }, 2000);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  // Loading state while validating token
  if (isValidatingToken) {
    return (
      <Layout>
        <section className="min-h-screen flex items-center justify-center py-16">
          <Card className="max-w-md w-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Validating Registration Link</h3>
              <p className="text-sm text-muted-foreground text-center">
                Please wait while we verify your registration token...
              </p>
            </CardContent>
          </Card>
        </section>
      </Layout>
    );
  }

  // Error state if token is invalid
  if (!isValidToken || tokenError) {
    return (
      <Layout>
        <section className="min-h-screen flex items-center justify-center py-16">
          <Card className="max-w-md w-full">
            <CardContent className="py-12">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  Invalid Registration Link
                </h3>
                <p className="text-muted-foreground mb-6">
                  {tokenError || 'The registration link is invalid or has expired.'}
                </p>
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Registration links are valid for 72 hours only. Please contact the admin for a new invitation link.
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground">
                  Redirecting to homepage in a few seconds...
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </Layout>
    );
  }

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
          {businessInfo && (
            <div className="mt-4">
              <Alert className="max-w-2xl mx-auto bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Registration link verified for <strong>{businessInfo.businessName}</strong> ({businessInfo.email})
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-5">
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
                <TabsTrigger value="authentication" className="text-xs sm:text-sm">
                  <Lock className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Auth</span>
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

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="panNumber">PAN Number (Optional)</Label>
                          <Input
                            id="panNumber"
                            placeholder="123456789"
                            value={formData.panNumber}
                            onChange={(e) => handleInputChange("panNumber", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="foundedYear">Founded Year (Optional)</Label>
                          <Input
                            id="foundedYear"
                            type="number"
                            placeholder="2020"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={formData.foundedYear}
                            onChange={(e) => handleInputChange("foundedYear", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companySize">Company Size (Optional)</Label>
                        <Select
                          value={formData.companySize}
                          onValueChange={(value) => handleInputChange("companySize", value)}
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
                          <Label htmlFor="fundingStage">Current Funding Stage (Optional)</Label>
                          <Select
                            value={formData.fundingStage}
                            onValueChange={(value) => handleInputChange("fundingStage", value)}
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
                          <Label htmlFor="investmentSought">Investment Amount Sought (NPR) (Optional)</Label>
                          <Input
                            id="investmentSought"
                            type="number"
                            placeholder="5000000"
                            value={formData.investmentSought}
                            onChange={(e) => handleInputChange("investmentSought", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="useOfFunds">Use of Funds (Optional)</Label>
                        <Textarea
                          id="useOfFunds"
                          placeholder="Explain how you plan to use the investment (e.g., product development, marketing, team expansion, etc.)..."
                          rows={4}
                          value={formData.useOfFunds}
                          onChange={(e) => handleInputChange("useOfFunds", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="revenueModel">Revenue Model (Optional)</Label>
                        <Textarea
                          id="revenueModel"
                          placeholder="Describe how your business generates or plans to generate revenue..."
                          rows={4}
                          value={formData.revenueModel}
                          onChange={(e) => handleInputChange("revenueModel", e.target.value)}
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
                        Upload supporting documents (all documents are optional)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="registrationCert">Company Registration Certificate (Optional)</Label>
                            <Input
                              id="registrationCert"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <p className="text-xs text-muted-foreground">PDF or image format</p>
                          </div>
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="pitchDeck">Pitch Deck (Optional)</Label>
                            <Input
                              id="pitchDeck"
                              type="file"
                              accept=".pdf,.ppt,.pptx"
                            />
                            <p className="text-xs text-muted-foreground">
                              PDF or PowerPoint format. Max 20MB
                            </p>
                          </div>
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="companyLogo">Company Logo (Optional)</Label>
                            <Input
                              id="companyLogo"
                              type="file"
                              accept="image/*"
                            />
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, or SVG. Recommended size: 500x500px
                            </p>
                          </div>
                        </div>

                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="panCert">PAN Certificate (Optional)</Label>
                            <Input
                              id="panCert"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <p className="text-xs text-muted-foreground">PDF or image format</p>
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
                        <Button type="button" onClick={() => nextTab("authentication")} variant="hero">
                          Next: Authentication
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab 5: Authentication */}
                <TabsContent value="authentication">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Your Account</CardTitle>
                      <CardDescription>
                        Set up your login credentials to access your business dashboard
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="authEmail">Email Address *</Label>
                        <Input
                          id="authEmail"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          disabled
                          className="bg-secondary"
                        />
                        <p className="text-xs text-muted-foreground">
                          This email will be used for login. (From your onboarding request)
                        </p>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            required
                            minLength={8}
                          />
                          <p className="text-xs text-muted-foreground">
                            Minimum 8 characters
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password *</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            required
                            minLength={8}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3 rounded-lg border p-4">
                          <Checkbox
                            id="terms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) =>
                              handleInputChange("acceptTerms", checked === true)
                            }
                            required
                          />
                          <div className="space-y-1 leading-none">
                            <Label
                              htmlFor="terms"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              I agree to the Terms and Conditions *
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              By registering, you agree to our{" "}
                              <a href="/terms" className="text-primary hover:underline" target="_blank">
                                Terms of Service
                              </a>{" "}
                              and{" "}
                              <a href="/privacy" className="text-primary hover:underline" target="_blank">
                                Privacy Policy
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <Alert className="bg-blue-50 border-blue-200">
                        <Lock className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          Your password will be securely encrypted. You'll use this email and password to log in to your business dashboard.
                        </AlertDescription>
                      </Alert>

                      <div className="flex justify-between">
                        <Button type="button" onClick={() => nextTab("documents")} variant="outline">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button type="submit" variant="hero" size="lg" disabled={isSubmitting || !formData.acceptTerms}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-5 w-5" />
                              Submit Registration
                            </>
                          )}
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
                      Registr Your Account For Free!!!
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Once approved, you'll receive Notification....
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
