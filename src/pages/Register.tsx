/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
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
  X,
  Plus,
  Play,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { MediaType } from "@/types/media";
import { ACCEPTED_FILE_TYPES } from "@/types/media";
import { isValidYouTubeUrl } from "@/utils/youtube";

// Document file types for registration
interface DocumentFile {
  file: File;
  mediaType: MediaType;
  label: string;
}

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
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  // Document files state
  const [documentFiles, setDocumentFiles] = useState<DocumentFile[]>([]);
  const [youtubeUrls, setYoutubeUrls] = useState<string[]>([]);
  const [youtubeInput, setYoutubeInput] = useState("");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

    // Investment Parameters
    minimumInvestmentUnits: "",
    maximumInvestmentUnits: "",
    pricePerUnit: "",
    expectedReturnOptions: "",
    estimatedMarketValuation: "",
    ipoTimeHorizon: "",

    // Social Media
    linkedin: "",
    facebook: "",
    twitter: "",

    // Authentication
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };



  const validateURL = (url: string): string | null => {
    if (!url) return null;
    try {
      new URL(url);
      return null;
    } catch {
      return "Please enter a valid URL (e.g., https://example.com)";
    }
  };

  const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return null;
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const validatePasswordStrength = (password: string): string | null => {
    if (!password) return null;
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return null;
  };

  // Field validation on blur
  const validateField = (field: string, value: string | boolean) => {
    let error: string | null = null;

    switch (field) {
      case "email":
        error = validateEmail(value as string);
        break;
      case "website":
      case "linkedin":
      case "facebook":
      case "twitter":
        error = validateURL(value as string);
        break;
      case "password":
        error = validatePasswordStrength(value as string);
        break;
      case "confirmPassword":
        error = validatePasswordMatch(formData.password, value as string);
        break;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle file selection for documents
  const handleFileSelect = (mediaType: MediaType, label: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: DocumentFile[] = Array.from(files).map(file => ({
      file,
      mediaType,
      label
    }));

    setDocumentFiles(prev => {
      // For single-file types, replace existing
      const singleFileTypes: MediaType[] = ['COMPANY_LOGO', 'REGISTRATION_CERTIFICATE', 'PAN_CERTIFICATE', 'PITCH_DECK'];
      if (singleFileTypes.includes(mediaType)) {
        return [...prev.filter(f => f.mediaType !== mediaType), ...newFiles];
      }
      // For multi-file types, append
      return [...prev, ...newFiles];
    });
  };

  // Remove a selected file
  const removeFile = (index: number) => {
    setDocumentFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Get selected file for a media type
  const getSelectedFile = (mediaType: MediaType): DocumentFile | undefined => {
    return documentFiles.find(f => f.mediaType === mediaType);
  };

  // Get all selected files for a media type (for multi-file types)
  const getSelectedFiles = (mediaType: MediaType): DocumentFile[] => {
    return documentFiles.filter(f => f.mediaType === mediaType);
  };

  const handleAddYoutubeUrl = () => {
    if (!youtubeInput.trim()) {
      return;
    }

    if (!isValidYouTubeUrl(youtubeInput)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    if (youtubeUrls.includes(youtubeInput)) {
      toast({
        title: "Duplicate URL",
        description: "This URL has already been added",
        variant: "destructive",
      });
      return;
    }

    setYoutubeUrls([...youtubeUrls, youtubeInput]);
    setYoutubeInput("");
  };

  const handleRemoveYoutubeUrl = (url: string) => {
    setYoutubeUrls(youtubeUrls.filter(u => u !== url));
  };

  // Upload all documents after registration
  const uploadDocuments = async (businessId: string) => {
    if (documentFiles.length === 0 && youtubeUrls.length === 0) return;

    setIsUploadingFiles(true);
    setUploadProgress(0);

    const totalItems = documentFiles.length + youtubeUrls.length;
    let uploadedCount = 0;

    // Upload document files
    for (const docFile of documentFiles) {
      try {
        setUploadStatus(`Uploading ${docFile.label}...`);

        if (docFile.mediaType === 'COMPANY_LOGO') {
          await api.upload.uploadLogo(businessId, docFile.file);
        } else {
          await api.upload.uploadMedia(businessId, docFile.mediaType, docFile.file);
        }

        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / totalItems) * 100));
      } catch (error) {
        console.error(`Failed to upload ${docFile.label}:`, error);
        // Continue with other files even if one fails
      }
    }

    // Upload YouTube URLs
    for (const url of youtubeUrls) {
      try {
        setUploadStatus("Adding YouTube video...");
        await api.upload.addExternalUrl(businessId, 'YOUTUBE_VIDEO', url);
        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / totalItems) * 100));
      } catch (error) {
        console.error('Failed to add YouTube video:', error);
        // Continue with other videos even if one fails
      }
    }

    setUploadStatus("Upload complete!");
    setIsUploadingFiles(false);
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

    // Validate all tabs before submission
    const tabsToValidate = ["company", "contact", "business", "authentication"];
    let hasErrors = false;

    for (const tab of tabsToValidate) {
      if (!validateTab(tab)) {
        hasErrors = true;
        // Switch to the first tab with errors
        setCurrentTab(tab);
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      }
    }

    if (hasErrors) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response: any = await api.onboarding.register({
        token: registrationToken,
        ...formData,
      });

      toast({
        title: "Registration Submitted!",
        description: "Your account has been created. Uploading documents...",
      });

      // Upload documents if any were selected
      if (documentFiles.length > 0 && response.business?.id) {
        await uploadDocuments(response.business.id);
        toast({
          title: "Documents Uploaded!",
          description: "All documents have been uploaded successfully.",
        });
      }

      toast({
        title: "Registration Complete!",
        description: "Please wait for admin approval before logging in.",
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
    "Investment",
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
    "Operational",
    "Revenue Generating",
  ];

  const companySizes = [
    "1–5 Employees",
    "6–10 Employees",
    "11–25 Employees",
    "26–50 Employees",
    "51–100 Employees",
    "100+ Employees",
  ];

  // Validate required fields for each tab
  const validateTab = (tab: string): boolean => {
    const newErrors: Record<string, string> = {};

    if (tab === "company") {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "Company name is required";
      }
      if (!formData.registrationNumber.trim()) {
        newErrors.registrationNumber = "Registration number is required";
      }
      if (!formData.industry) {
        newErrors.industry = "Industry is required";
      }
    } else if (tab === "contact") {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else {
        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      }
      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }
      if (!formData.district.trim()) {
        newErrors.district = "District is required";
      }
      // Validate optional URL fields
      if (formData.website) {
        const urlError = validateURL(formData.website);
        if (urlError) newErrors.website = urlError;
      }
      if (formData.linkedin) {
        const urlError = validateURL(formData.linkedin);
        if (urlError) newErrors.linkedin = urlError;
      }
      if (formData.facebook) {
        const urlError = validateURL(formData.facebook);
        if (urlError) newErrors.facebook = urlError;
      }
      if (formData.twitter) {
        const urlError = validateURL(formData.twitter);
        if (urlError) newErrors.twitter = urlError;
      }
    } else if (tab === "business") {
      if (!formData.description.trim()) {
        newErrors.description = "Business description is required";
      }
    } else if (tab === "authentication") {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else {
        const passError = validatePasswordStrength(formData.password);
        if (passError) newErrors.password = passError;
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else {
        const matchError = validatePasswordMatch(formData.password, formData.confirmPassword);
        if (matchError) newErrors.confirmPassword = matchError;
      }
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "You must accept the terms and conditions";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly before proceeding.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const nextTab = (next: string) => {
    // Validate current tab before moving to next
    if (!validateTab(currentTab)) {
      return;
    }
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
                            onBlur={(e) => validateField("companyName", e.target.value)}
                            required
                            className={errors.companyName ? "border-red-500" : ""}
                          />
                          {errors.companyName && (
                            <p className="text-sm text-red-500">{errors.companyName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registrationNumber">Company Registration Number *</Label>
                          <Input
                            id="registrationNumber"
                            placeholder="12345/078/079"
                            value={formData.registrationNumber}
                            onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                            onBlur={(e) => validateField("registrationNumber", e.target.value)}
                            required
                            className={errors.registrationNumber ? "border-red-500" : ""}
                          />
                          {errors.registrationNumber && (
                            <p className="text-sm text-red-500">{errors.registrationNumber}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry *</Label>
                        <Select
                          value={formData.industry}
                          onValueChange={(value) => {
                            handleInputChange("industry", value);
                            validateField("industry", value);
                          }}
                          required
                        >
                          <SelectTrigger id="industry" className={errors.industry ? "border-red-500" : ""}>
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
                        {errors.industry && (
                          <p className="text-sm text-red-500">{errors.industry}</p>
                        )}
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
                            onBlur={(e) => validateField("email", e.target.value)}
                            required
                            className={errors.email ? "border-red-500" : ""}
                          />
                          {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+977 1-XXXXXXX"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            onBlur={(e) => validateField("phone", e.target.value)}
                            required
                            className={errors.phone ? "border-red-500" : ""}
                          />
                          {errors.phone && (
                            <p className="text-sm text-red-500">{errors.phone}</p>
                          )}
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
                          onBlur={(e) => validateField("website", e.target.value)}
                          className={errors.website ? "border-red-500" : ""}
                        />
                        {errors.website && (
                          <p className="text-sm text-red-500">{errors.website}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address *</Label>
                        <Input
                          id="address"
                          placeholder="Thamel Marg, Ward No. 26"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          onBlur={(e) => validateField("address", e.target.value)}
                          required
                          className={errors.address ? "border-red-500" : ""}
                        />
                        {errors.address && (
                          <p className="text-sm text-red-500">{errors.address}</p>
                        )}
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="Kathmandu"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            onBlur={(e) => validateField("city", e.target.value)}
                            required
                            className={errors.city ? "border-red-500" : ""}
                          />
                          {errors.city && (
                            <p className="text-sm text-red-500">{errors.city}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="district">District *</Label>
                          <Input
                            id="district"
                            placeholder="Kathmandu"
                            value={formData.district}
                            onChange={(e) => handleInputChange("district", e.target.value)}
                            onBlur={(e) => validateField("district", e.target.value)}
                            required
                            className={errors.district ? "border-red-500" : ""}
                          />
                          {errors.district && (
                            <p className="text-sm text-red-500">{errors.district}</p>
                          )}
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
                              onBlur={(e) => validateField("linkedin", e.target.value)}
                              className={errors.linkedin ? "border-red-500" : ""}
                            />
                            {errors.linkedin && (
                              <p className="text-sm text-red-500">{errors.linkedin}</p>
                            )}
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
                              onBlur={(e) => validateField("facebook", e.target.value)}
                              className={errors.facebook ? "border-red-500" : ""}
                            />
                            {errors.facebook && (
                              <p className="text-sm text-red-500">{errors.facebook}</p>
                            )}
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
                              onBlur={(e) => validateField("twitter", e.target.value)}
                              className={errors.twitter ? "border-red-500" : ""}
                            />
                            {errors.twitter && (
                              <p className="text-sm text-red-500">{errors.twitter}</p>
                            )}
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
                          onBlur={(e) => validateField("description", e.target.value)}
                          required
                          className={errors.description ? "border-red-500" : ""}
                        />
                        {errors.description && (
                          <p className="text-sm text-red-500">{errors.description}</p>
                        )}
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

                      {/* Investment Parameters Section */}
                      <div className="rounded-lg border border-border bg-secondary/20 p-6 space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Investment Parameters (Optional)</h3>
                          <p className="text-sm text-muted-foreground">
                            Provide details about investment structure and expected returns
                          </p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="minimumInvestmentUnits">Minimum Investment Units</Label>
                            <Input
                              id="minimumInvestmentUnits"
                              type="number"
                              placeholder="100"
                              value={formData.minimumInvestmentUnits}
                              onChange={(e) => handleInputChange("minimumInvestmentUnits", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Minimum number of units an investor can purchase
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="maximumInvestmentUnits">Maximum Investment Units</Label>
                            <Input
                              id="maximumInvestmentUnits"
                              type="number"
                              placeholder="10000"
                              value={formData.maximumInvestmentUnits}
                              onChange={(e) => handleInputChange("maximumInvestmentUnits", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Maximum number of units an investor can purchase
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="pricePerUnit">Price per Unit (NPR)</Label>
                            <Input
                              id="pricePerUnit"
                              type="number"
                              placeholder="1000"
                              value={formData.pricePerUnit}
                              onChange={(e) => handleInputChange("pricePerUnit", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Price of each investment unit in NPR
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="estimatedMarketValuation">Estimated Market Valuation (NPR)</Label>
                            <Input
                              id="estimatedMarketValuation"
                              type="number"
                              placeholder="50000000"
                              value={formData.estimatedMarketValuation}
                              onChange={(e) => handleInputChange("estimatedMarketValuation", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Current estimated market value of your business
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="expectedReturnOptions">Expected Return Options</Label>
                            <Input
                              id="expectedReturnOptions"
                              type="text"
                              placeholder="15-20% annually"
                              value={formData.expectedReturnOptions}
                              onChange={(e) => handleInputChange("expectedReturnOptions", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Expected returns for investors (e.g., "15-20% annually")
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ipoTimeHorizon">Time Horizon for IPO</Label>
                            <Input
                              id="ipoTimeHorizon"
                              type="text"
                              placeholder="3-5 years"
                              value={formData.ipoTimeHorizon}
                              onChange={(e) => handleInputChange("ipoTimeHorizon", e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                              Expected timeframe for IPO or exit (e.g., "3-5 years")
                            </p>
                          </div>
                        </div>
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
                        Upload supporting documents (all documents are optional). Files will be uploaded after registration.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Selected files summary */}
                      {documentFiles.length > 0 && (
                        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Selected Files ({documentFiles.length})
                          </h4>
                          <div className="space-y-2">
                            {documentFiles.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between text-sm bg-background rounded p-2">
                                <span className="truncate flex-1">{doc.file.name}</span>
                                <span className="text-muted-foreground mx-2">{doc.label}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => removeFile(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* Company Logo */}
                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="companyLogo">Company Logo (Optional)</Label>
                            <input
                              ref={(el) => { fileInputRefs.current['logo'] = el; }}
                              id="companyLogo"
                              type="file"
                              accept={ACCEPTED_FILE_TYPES.COMPANY_LOGO}
                              className="hidden"
                              onChange={(e) => {
                                handleFileSelect('COMPANY_LOGO', 'Company Logo', e.target.files);
                                e.target.value = '';
                              }}
                            />
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRefs.current['logo']?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {getSelectedFile('COMPANY_LOGO') ? 'Replace' : 'Select File'}
                              </Button>
                              {getSelectedFile('COMPANY_LOGO') && (
                                <span className="text-sm text-muted-foreground truncate">
                                  {getSelectedFile('COMPANY_LOGO')?.file.name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, or WebP. Recommended size: 500x500px
                            </p>
                          </div>
                        </div>

                        {/* Registration Certificate */}
                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="registrationCert">Company Registration Certificate (Optional)</Label>
                            <input
                              ref={(el) => { fileInputRefs.current['registration'] = el; }}
                              id="registrationCert"
                              type="file"
                              accept={ACCEPTED_FILE_TYPES.REGISTRATION_CERTIFICATE}
                              className="hidden"
                              onChange={(e) => {
                                handleFileSelect('REGISTRATION_CERTIFICATE', 'Registration Certificate', e.target.files);
                                e.target.value = '';
                              }}
                            />
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRefs.current['registration']?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {getSelectedFile('REGISTRATION_CERTIFICATE') ? 'Replace' : 'Select File'}
                              </Button>
                              {getSelectedFile('REGISTRATION_CERTIFICATE') && (
                                <span className="text-sm text-muted-foreground truncate">
                                  {getSelectedFile('REGISTRATION_CERTIFICATE')?.file.name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">PDF or image format</p>
                          </div>
                        </div>

                        {/* PAN Certificate */}
                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="panCert">PAN Certificate (Optional)</Label>
                            <input
                              ref={(el) => { fileInputRefs.current['pan'] = el; }}
                              id="panCert"
                              type="file"
                              accept={ACCEPTED_FILE_TYPES.PAN_CERTIFICATE}
                              className="hidden"
                              onChange={(e) => {
                                handleFileSelect('PAN_CERTIFICATE', 'PAN Certificate', e.target.files);
                                e.target.value = '';
                              }}
                            />
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRefs.current['pan']?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {getSelectedFile('PAN_CERTIFICATE') ? 'Replace' : 'Select File'}
                              </Button>
                              {getSelectedFile('PAN_CERTIFICATE') && (
                                <span className="text-sm text-muted-foreground truncate">
                                  {getSelectedFile('PAN_CERTIFICATE')?.file.name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">PDF or image format</p>
                          </div>
                        </div>

                        {/* Pitch Deck */}
                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="pitchDeck">Pitch Deck (Optional)</Label>
                            <input
                              ref={(el) => { fileInputRefs.current['pitch'] = el; }}
                              id="pitchDeck"
                              type="file"
                              accept={ACCEPTED_FILE_TYPES.PITCH_DECK}
                              className="hidden"
                              onChange={(e) => {
                                handleFileSelect('PITCH_DECK', 'Pitch Deck', e.target.files);
                                e.target.value = '';
                              }}
                            />
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRefs.current['pitch']?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {getSelectedFile('PITCH_DECK') ? 'Replace' : 'Select File'}
                              </Button>
                              {getSelectedFile('PITCH_DECK') && (
                                <span className="text-sm text-muted-foreground truncate">
                                  {getSelectedFile('PITCH_DECK')?.file.name}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              PDF or PowerPoint format. Max 50MB
                            </p>
                          </div>
                        </div>

                        {/* Financial Documents */}
                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="financials">Financial Documents (Optional)</Label>
                            <input
                              ref={(el) => { fileInputRefs.current['financial'] = el; }}
                              id="financials"
                              type="file"
                              accept={ACCEPTED_FILE_TYPES.FINANCIAL_DOCUMENT}
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                handleFileSelect('FINANCIAL_DOCUMENT', 'Financial Document', e.target.files);
                                e.target.value = '';
                              }}
                            />
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRefs.current['financial']?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Add Files
                              </Button>
                              {getSelectedFiles('FINANCIAL_DOCUMENT').length > 0 && (
                                <span className="text-sm text-muted-foreground">
                                  {getSelectedFiles('FINANCIAL_DOCUMENT').length} file(s) selected
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Financial statements, projections, etc. (PDF or Excel)
                            </p>
                          </div>
                        </div>

                        {/* Application Form */}
                        <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                          <div className="space-y-2">
                            <Label htmlFor="otherDocs">Application Form (Optional)</Label>
                            <input
                              ref={(el) => { fileInputRefs.current['other'] = el; }}
                              id="otherDocs"
                              type="file"
                              accept={ACCEPTED_FILE_TYPES.DOCUMENT}
                              multiple
                              className="hidden"
                              onChange={(e) => {
                                handleFileSelect('DOCUMENT', 'Application Form', e.target.files);
                                e.target.value = '';
                              }}
                            />
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => fileInputRefs.current['other']?.click()}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Add Files
                              </Button>
                              {getSelectedFiles('DOCUMENT').length > 0 && (
                                <span className="text-sm text-muted-foreground">
                                  {getSelectedFiles('DOCUMENT').length} file(s) selected
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Business plan, market research, certifications, etc.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* YouTube Videos Section */}
                      <div className="space-y-4">
                        <div>
                          <Label>YouTube Videos (Optional)</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Add YouTube links to showcase your business (e.g., company overview, product demo, testimonials)
                          </p>
                        </div>

                        {/* Existing YouTube URLs */}
                        {youtubeUrls.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Added Videos ({youtubeUrls.length})</h4>
                            {youtubeUrls.map((url, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between rounded-md bg-secondary/30 p-3 border"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Play className="h-4 w-4 text-red-500 flex-shrink-0" />
                                  <p className="text-sm truncate text-muted-foreground">{url}</p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveYoutubeUrl(url)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* YouTube URL Input */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                            value={youtubeInput}
                            onChange={(e) => setYoutubeInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddYoutubeUrl()}
                          />
                          <Button
                            type="button"
                            onClick={handleAddYoutubeUrl}
                            variant="outline"
                            disabled={!youtubeInput.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {youtubeInput && !isValidYouTubeUrl(youtubeInput) && (
                          <p className="text-xs text-destructive">Invalid YouTube URL</p>
                        )}
                      </div>

                      <div className="rounded-lg bg-teal-50 p-6">
                        <div className="flex gap-3">
                          <CheckCircle className="h-6 w-6 shrink-0 text-primary" />
                          <div className="space-y-2">
                            <h4 className="font-semibold text-foreground">
                              What Happens Next?
                            </h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              <li>• Documents will be uploaded after you submit your registration</li>
                              <li>• Our team will review your submission within 2-3 business days</li>
                              <li>• You'll receive an email notification once approved</li>
                              <li>• You can upload more documents from your dashboard after login</li>
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
                            onBlur={(e) => validateField("password", e.target.value)}
                            required
                            minLength={8}
                            className={errors.password ? "border-red-500" : ""}
                          />
                          {errors.password && (
                            <p className="text-sm text-red-500">{errors.password}</p>
                          )}
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
                            onBlur={(e) => validateField("confirmPassword", e.target.value)}
                            required
                            minLength={8}
                            className={errors.confirmPassword ? "border-red-500" : ""}
                          />
                          {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className={`flex items-start space-x-3 rounded-lg border p-4 ${errors.acceptTerms ? "border-red-500" : ""}`}>
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
                        {errors.acceptTerms && (
                          <p className="text-sm text-red-500">{errors.acceptTerms}</p>
                        )}
                      </div>

                      <Alert className="bg-blue-50 border-blue-200">
                        <Lock className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          Your password will be securely encrypted. You'll use this email and password to log in to your business dashboard.
                        </AlertDescription>
                      </Alert>

                      {/* Upload progress indicator */}
                      {isUploadingFiles && (
                        <div className="rounded-lg border bg-secondary/20 p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            <span className="font-medium">{uploadStatus}</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            Uploading documents... {uploadProgress}% complete
                          </p>
                        </div>
                      )}

                      {/* Show selected files count */}
                      {documentFiles.length > 0 && !isSubmitting && !isUploadingFiles && (
                        <Alert>
                          <FileText className="h-4 w-4" />
                          <AlertDescription>
                            {documentFiles.length} document(s) will be uploaded after registration.
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex justify-between">
                        <Button type="button" onClick={() => nextTab("documents")} variant="outline" disabled={isSubmitting || isUploadingFiles}>
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        <Button type="submit" variant="hero" size="lg" disabled={isSubmitting || isUploadingFiles || !formData.acceptTerms}>
                          {isSubmitting || isUploadingFiles ? (
                            <>
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                              {isUploadingFiles ? 'Uploading Documents...' : 'Submitting...'}
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-5 w-5" />
                              Submit Registration
                              {documentFiles.length > 0 && ` (${documentFiles.length} files)`}
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
