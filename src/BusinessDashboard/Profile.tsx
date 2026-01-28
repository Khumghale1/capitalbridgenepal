/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { BusinessDashboardLayout } from "./BusinessDashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  Building2,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Briefcase,
  Loader2,
  AlertCircle,
  X,
  Plus,
  Play,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import type { BusinessMedia, MediaType } from "@/types/media";
import { MEDIA_TYPE_LABELS, ACCEPTED_FILE_TYPES, formatFileSize } from "@/types/media";
import { isValidYouTubeUrl } from "@/utils/youtube";

// Document upload types
interface UploadState {
  file: File | null;
  progress: number;
  uploading: boolean;
  error: string | null;
}

export default function Profile() {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("company");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [businessData, setBusinessData] = useState<any>(null);

  // Media/Upload state
  const [existingMedia, setExistingMedia] = useState<BusinessMedia[]>([]);
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({});
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [formData, setFormData] = useState({
    // Company Information (matches DB fields exactly)
    name: "",
    registrationNumber: "",
    panNumber: "",
    categoryName: "", // Display only - from category relation
    businessType: "",
    yearEstablished: "",
    teamSize: "",
    promoterProfile: "",

    // Location Information
    location: "", // Combined city, district
    address: "", // Separate address field

    // Contact Information
    contactEmail: "", // readonly
    contactPhone: "",
    website: "",

    // Social Media
    linkedinUrl: "",
    facebookUrl: "",
    instagramUrl: "",

    // Business Details
    briefDescription: "",
    fullDescription: "",
    fundingStage: "",
    paidUpCapital: "", // String in DB
    growthPlans: "", // use of funds
    vision: "",
    mission: "",

    // Investment Parameters
    minimumInvestmentUnits: "",
    maximumInvestmentUnits: "",
    pricePerUnit: "",
    expectedReturnOptions: "",
    estimatedMarketValuation: "",
    ipoTimeHorizon: "",
  });

  const fundingStages = [
    "Growth Stage",
    "Operational",
    "Revenue Generating",
    "Pre-IPO / Late-Stage Funding",
    "Pre-Seed Stage",
    "Initial Public Offering (IPO)",
  ];

  const companySizes = [
    "1–5 Employees",
    "6–10 Employees",
    "11–25 Employees",
    "26–50 Employees",
    "51–100 Employees",
    "100+ Employees",
  ];

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response: any = await api.businessProfile.getOwnProfile();
      const data = response.business || response;

      setBusinessData(data);

      // Fetch existing media for this business
      if (data.id) {
        try {
          const mediaResponse = await api.upload.getMedia(data.id);
          setExistingMedia(Array.isArray(mediaResponse.media) ? mediaResponse.media : []);
        } catch (mediaError) {
          console.error("Failed to fetch media:", mediaError);
        }
      }

      // Populate form with fetched data (matching DB fields exactly)
      setFormData({
        // Company Information
        name: data.name || "",
        registrationNumber: data.registrationNumber || "",
        panNumber: data.panNumber || "",
        categoryName: data.category?.name || "",
        businessType: data.businessType || "",
        yearEstablished: data.yearEstablished?.toString() || "",
        teamSize: data.teamSize || "",
        promoterProfile: data.promoterProfile || "",

        // Location
        location: data.location || "",
        address: data.address || "",

        // Contact Information
        contactEmail: data.contactEmail || "",
        contactPhone: data.contactPhone || "",
        website: data.website || "",

        // Social Media
        linkedinUrl: data.linkedinUrl || "",
        facebookUrl: data.facebookUrl || "",
        instagramUrl: data.instagramUrl || "",

        // Business Details
        briefDescription: data.briefDescription || "",
        fullDescription: data.fullDescription || "",
        fundingStage: data.fundingStage || "",
        paidUpCapital: data.paidUpCapital || "",
        growthPlans: data.growthPlans || "",
        vision: data.vision || "",
        mission: data.mission || "",

        // Investment Parameters
        minimumInvestmentUnits: data.minimumInvestmentUnits?.toString() || "",
        maximumInvestmentUnits: data.maximumInvestmentUnits?.toString() || "",
        pricePerUnit: data.pricePerUnit?.toString() || "",
        expectedReturnOptions: data.expectedReturnOptions || "",
        estimatedMarketValuation: data.estimatedMarketValuation?.toString() || "",
        ipoTimeHorizon: data.ipoTimeHorizon || "",
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Build update data matching DB fields exactly
      const updateData: any = {
        name: formData.name || undefined,
        registrationNumber: formData.registrationNumber || undefined,
        panNumber: formData.panNumber || undefined,
        businessType: formData.businessType || undefined,
        location: formData.location || undefined,
        address: formData.address || undefined,
        teamSize: formData.teamSize || undefined,
        promoterProfile: formData.promoterProfile || undefined,
        paidUpCapital: formData.paidUpCapital || undefined,
        fundingStage: formData.fundingStage || undefined,
        briefDescription: formData.briefDescription || undefined,
        fullDescription: formData.fullDescription || undefined,
        vision: formData.vision || undefined,
        mission: formData.mission || undefined,
        growthPlans: formData.growthPlans || undefined,
        contactPhone: formData.contactPhone || undefined,
        website: formData.website || undefined,
        facebookUrl: formData.facebookUrl || undefined,
        linkedinUrl: formData.linkedinUrl || undefined,
        instagramUrl: formData.instagramUrl || undefined,
        expectedReturnOptions: formData.expectedReturnOptions || undefined,
        ipoTimeHorizon: formData.ipoTimeHorizon || undefined,
      };

      // Parse numeric fields
      if (formData.yearEstablished) updateData.yearEstablished = parseInt(formData.yearEstablished);
      if (formData.minimumInvestmentUnits) updateData.minimumInvestmentUnits = parseInt(formData.minimumInvestmentUnits);
      if (formData.maximumInvestmentUnits) updateData.maximumInvestmentUnits = parseInt(formData.maximumInvestmentUnits);
      if (formData.pricePerUnit) updateData.pricePerUnit = parseFloat(formData.pricePerUnit);
      if (formData.estimatedMarketValuation) updateData.estimatedMarketValuation = parseFloat(formData.estimatedMarketValuation);

      await api.businessProfile.updateOwnProfile(updateData);

      toast({
        title: "Profile Updated!",
        description: "Your business profile has been successfully updated.",
      });

      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get existing media for a specific type
  const getExistingMediaForType = (mediaType: MediaType): BusinessMedia | undefined => {
    return existingMedia.find(m => m.mediaType === mediaType);
  };

  // Get all existing media for a type (for multi-file types)
  const getExistingMediaListForType = (mediaType: MediaType): BusinessMedia[] => {
    return existingMedia.filter(m => m.mediaType === mediaType);
  };

  // Handle file selection
  const handleFileSelect = async (key: string, mediaType: MediaType, file: File) => {
    if (!businessData?.id) {
      toast({
        title: "Error",
        description: "Business profile not loaded",
        variant: "destructive",
      });
      return;
    }

    // Update upload state
    setUploadStates(prev => ({
      ...prev,
      [key]: { file, progress: 0, uploading: true, error: null }
    }));

    try {
      if (mediaType === 'COMPANY_LOGO') {
        await api.upload.uploadLogo(
          businessData.id,
          file,
          (progress) => {
            setUploadStates(prev => ({
              ...prev,
              [key]: { ...prev[key], progress }
            }));
          }
        );
      } else {
        await api.upload.uploadMedia(
          businessData.id,
          mediaType,
          file,
          {
            onProgress: (progress) => {
              setUploadStates(prev => ({
                ...prev,
                [key]: { ...prev[key], progress }
              }));
            }
          }
        );
      }

      // Success
      setUploadStates(prev => ({
        ...prev,
        [key]: { file: null, progress: 100, uploading: false, error: null }
      }));

      toast({
        title: "Upload Successful",
        description: `${MEDIA_TYPE_LABELS[mediaType]} uploaded successfully.`,
      });

      // Refresh media list
      const mediaResponse = await api.upload.getMedia(businessData.id);
      setExistingMedia(Array.isArray(mediaResponse.media) ? mediaResponse.media : []);

      // Refresh profile to get updated logoUrl
      if (mediaType === 'COMPANY_LOGO') {
        fetchProfile();
      }

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';

      setUploadStates(prev => ({
        ...prev,
        [key]: { ...prev[key], uploading: false, error: errorMessage }
      }));

      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Handle file input change
  const handleFileInputChange = (key: string, mediaType: MediaType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(key, mediaType, file);
    }
    event.target.value = '';
  };

  // Handle delete media
  const handleDeleteMedia = async (mediaId: string, mediaType: MediaType) => {
    try {
      await api.upload.deleteMedia(mediaId);

      toast({
        title: "Deleted",
        description: `${MEDIA_TYPE_LABELS[mediaType]} deleted successfully.`,
      });

      // Refresh media list
      if (businessData?.id) {
        const mediaResponse = await api.upload.getMedia(businessData.id);
        setExistingMedia(Array.isArray(mediaResponse.media) ? mediaResponse.media : []);
      }

      // Refresh profile if logo was deleted
      if (mediaType === 'COMPANY_LOGO') {
        fetchProfile();
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : 'Failed to delete',
        variant: "destructive",
      });
    }
  };

  const handleAddYoutubeVideo = async () => {
    if (!youtubeUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      });
      return;
    }

    if (!isValidYouTubeUrl(youtubeUrl)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setYoutubeLoading(true);
      await api.upload.addExternalUrl(businessData.id, 'YOUTUBE_VIDEO', youtubeUrl);

      toast({
        title: "Success",
        description: "YouTube video added successfully",
      });

      setYoutubeUrl('');

      // Refresh media list
      if (businessData?.id) {
        const mediaResponse = await api.upload.getMedia(businessData.id);
        setExistingMedia(Array.isArray(mediaResponse.media) ? mediaResponse.media : []);
      }
    } catch (error) {
      toast({
        title: "Failed to add video",
        description: error instanceof Error ? error.message : 'Please try again',
        variant: "destructive",
      });
    } finally {
      setYoutubeLoading(false);
    }
  };

  const nextTab = (next: string) => {
    setCurrentTab(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <BusinessDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </BusinessDashboardLayout>
    );
  }

  return (
    <BusinessDashboardLayout>
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20 shrink-0">
            <AvatarImage src={businessData?.logoUrl || ""} alt="Business Logo" />
            <AvatarFallback className="bg-primary/10">
              <Building2 className="h-10 w-10 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold tracking-tight">{formData.name || "Business Name Not Set"}</h2>
              {businessData?.status && (
                <Badge variant={businessData.status === 'APPROVED' ? 'default' : 'secondary'}>
                  {businessData.status}
                </Badge>
              )}
              {businessData?.isActive !== undefined && (
                <Badge variant={businessData.isActive ? 'default' : 'destructive'}>
                  {businessData.isActive ? 'Active' : 'Inactive'}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{formData.categoryName || "Industry Not Set"}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {businessData?.viewCount || 0} profile views
            </p>
            <div className="mt-4 flex gap-2">
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="hero">
                  Edit Profile
                </Button>
              )}
              {isEditing && (
                <>
                  <Button onClick={handleSave} disabled={isSaving} variant="hero">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Layout - Same as Register */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
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

        {/* Tab 1: Company Information */}
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Your company's basic details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    placeholder="ABC Pvt. Ltd."
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Company Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    placeholder="12345/078/079"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Sector *</Label>
                  <Input
                    id="categoryName"
                    value={formData.categoryName}
                    disabled
                    className="bg-secondary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Industry/Sector is set during registration and cannot be changed
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    placeholder="e.g., Pvt. Ltd., Public Ltd."
                    value={formData.businessType}
                    onChange={(e) => handleInputChange("businessType", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number (Optional)</Label>
                  <Input
                    id="panNumber"
                    placeholder="123456789"
                    value={formData.panNumber}
                    onChange={(e) => handleInputChange("panNumber", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearEstablished">Year Established</Label>
                  <Input
                    id="yearEstablished"
                    type="number"
                    placeholder="2020"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.yearEstablished}
                    onChange={(e) => handleInputChange("yearEstablished", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Select
                  value={formData.teamSize}
                  onValueChange={(value) => handleInputChange("teamSize", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger id="teamSize">
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

              <div className="space-y-2">
                <Label htmlFor="promoterProfile">Promoter Profile (Optional)</Label>
                <Input
                  id="promoterProfile"
                  placeholder="e.g., ABC Group, XYZ Holdings"
                  value={formData.promoterProfile}
                  onChange={(e) => handleInputChange("promoterProfile", e.target.value)}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  Name of the parent company or main influential organization
                </p>
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
                  <Label htmlFor="contactEmail">Business Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="info@company.com"
                    value={formData.contactEmail}
                    disabled
                    className="bg-secondary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed after registration
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number *</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="+977 1-XXXXXXX"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    disabled={!isEditing}
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
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Thamel Marg, Ward No. 26"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (City, District)</Label>
                <Input
                  id="location"
                  placeholder="Kathmandu, Kathmandu"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  Format: City, District (e.g., Kathmandu, Kathmandu)
                </p>
              </div>

              <div className="space-y-4">
                <Label>Social Media (Optional)</Label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl" className="text-sm text-muted-foreground">
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedinUrl"
                      placeholder="https://linkedin.com/company/..."
                      value={formData.linkedinUrl}
                      onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebookUrl" className="text-sm text-muted-foreground">
                      Facebook Page
                    </Label>
                    <Input
                      id="facebookUrl"
                      placeholder="https://facebook.com/..."
                      value={formData.facebookUrl}
                      onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagramUrl" className="text-sm text-muted-foreground">
                      Instagram Profile
                    </Label>
                    <Input
                      id="instagramUrl"
                      placeholder="https://instagram.com/..."
                      value={formData.instagramUrl}
                      onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                      disabled={!isEditing}
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
                <Label htmlFor="briefDescription">Brief Description *</Label>
                <Textarea
                  id="briefDescription"
                  placeholder="A brief overview of your business (max 200 characters)"
                  rows={3}
                  value={formData.briefDescription}
                  onChange={(e) => handleInputChange("briefDescription", e.target.value)}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  Short description shown in listings and cards
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Full Business Description</Label>
                <Textarea
                  id="fullDescription"
                  placeholder="Describe your business, what you do, your unique value proposition, and market opportunity..."
                  rows={6}
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange("fullDescription", e.target.value)}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  Detailed description investors see on your profile page
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fundingStage">Current Funding Stage</Label>
                  <Select
                    value={formData.fundingStage}
                    onValueChange={(value) => handleInputChange("fundingStage", value)}
                    disabled={!isEditing}
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
                  <Label htmlFor="paidUpCapital">Paid Up Capital</Label>
                  <Input
                    id="paidUpCapital"
                    placeholder="e.g., 10 Lakhs, 1 Crore"
                    value={formData.paidUpCapital}
                    onChange={(e) => handleInputChange("paidUpCapital", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="growthPlans">Growth Plans / Use of Funds</Label>
                <Textarea
                  id="growthPlans"
                  placeholder="Explain how you plan to use the investment (e.g., product development, marketing, team expansion, etc.)..."
                  rows={4}
                  value={formData.growthPlans}
                  onChange={(e) => handleInputChange("growthPlans", e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vision">Company Vision</Label>
                <Textarea
                  id="vision"
                  placeholder="Describe your company's long-term vision and aspirations..."
                  rows={4}
                  value={formData.vision}
                  onChange={(e) => handleInputChange("vision", e.target.value)}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  What does your company aspire to achieve in the future?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mission">Company Mission</Label>
                <Textarea
                  id="mission"
                  placeholder="Describe your company's mission and purpose..."
                  rows={4}
                  value={formData.mission}
                  onChange={(e) => handleInputChange("mission", e.target.value)}
                  disabled={!isEditing}
                />
                <p className="text-xs text-muted-foreground">
                  What is your company's core purpose and how do you serve your customers?
                </p>
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      disabled={!isEditing}
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
                      placeholder="i.e, IPO Upside or dividend"
                      value={formData.expectedReturnOptions}
                      onChange={(e) => handleInputChange("expectedReturnOptions", e.target.value)}
                      disabled={!isEditing}
                    />
                    <p className="text-xs text-muted-foreground">
                      Expected returns for investors (i.e, IPO Upside or dividend)
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
                      disabled={!isEditing}
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
                  Next: Documents
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Documents */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Upload supporting documents for your business profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Company Logo */}
              <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Company Logo (Optional)</Label>
                    {getExistingMediaForType('COMPANY_LOGO') && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Uploaded
                      </Badge>
                    )}
                  </div>

                  {getExistingMediaForType('COMPANY_LOGO') && (
                    <div className="flex items-center justify-between rounded-md bg-background p-3 border">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {getExistingMediaForType('COMPANY_LOGO')?.fileName || 'Company Logo'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getExistingMediaForType('COMPANY_LOGO')?.fileSize ? formatFileSize(getExistingMediaForType('COMPANY_LOGO')!.fileSize!) : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getExistingMediaForType('COMPANY_LOGO')?.fileUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(getExistingMediaForType('COMPANY_LOGO')?.fileUrl, '_blank')}
                          >
                            View
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMedia(getExistingMediaForType('COMPANY_LOGO')!.id, 'COMPANY_LOGO')}
                          disabled={!isEditing}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {uploadStates['logo']?.uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading... {uploadStates['logo'].progress}%</span>
                      </div>
                      <Progress value={uploadStates['logo'].progress} className="h-2" />
                    </div>
                  )}

                  {uploadStates['logo']?.error && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {uploadStates['logo'].error}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1"
                        onClick={() => setUploadStates(prev => ({ ...prev, logo: { file: null, progress: 0, uploading: false, error: null } }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <input
                      ref={(el) => { fileInputRefs.current['logo'] = el; }}
                      type="file"
                      accept={ACCEPTED_FILE_TYPES.COMPANY_LOGO}
                      className="hidden"
                      disabled={!isEditing}
                      onChange={(e) => handleFileInputChange('logo', 'COMPANY_LOGO', e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!isEditing}
                      onClick={() => fileInputRefs.current['logo']?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {getExistingMediaForType('COMPANY_LOGO') ? 'Replace' : 'Upload'}
                    </Button>
                    <p className="text-xs text-muted-foreground">PNG, JPG, or WebP. Recommended: 500x500px</p>
                  </div>
                </div>
              </div>

              {/* Registration Certificate */}
              <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Company Registration Certificate (Optional)</Label>
                    {getExistingMediaForType('REGISTRATION_CERTIFICATE') && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Uploaded
                      </Badge>
                    )}
                  </div>

                  {getExistingMediaForType('REGISTRATION_CERTIFICATE') && (
                    <div className="flex items-center justify-between rounded-md bg-background p-3 border">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {getExistingMediaForType('REGISTRATION_CERTIFICATE')?.fileName || 'Registration Certificate'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getExistingMediaForType('REGISTRATION_CERTIFICATE')?.fileUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(getExistingMediaForType('REGISTRATION_CERTIFICATE')?.fileUrl, '_blank')}
                          >
                            View
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMedia(getExistingMediaForType('REGISTRATION_CERTIFICATE')!.id, 'REGISTRATION_CERTIFICATE')}
                          disabled={!isEditing}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {uploadStates['registration']?.uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading... {uploadStates['registration'].progress}%</span>
                      </div>
                      <Progress value={uploadStates['registration'].progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <input
                      ref={(el) => { fileInputRefs.current['registration'] = el; }}
                      type="file"
                      accept={ACCEPTED_FILE_TYPES.REGISTRATION_CERTIFICATE}
                      className="hidden"
                      disabled={!isEditing}
                      onChange={(e) => handleFileInputChange('registration', 'REGISTRATION_CERTIFICATE', e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!isEditing}
                      onClick={() => fileInputRefs.current['registration']?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {getExistingMediaForType('REGISTRATION_CERTIFICATE') ? 'Replace' : 'Upload'}
                    </Button>
                    <p className="text-xs text-muted-foreground">PDF or image format</p>
                  </div>
                </div>
              </div>

              {/* PAN Certificate */}
              <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>PAN Certificate (Optional)</Label>
                    {getExistingMediaForType('PAN_CERTIFICATE') && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Uploaded
                      </Badge>
                    )}
                  </div>

                  {getExistingMediaForType('PAN_CERTIFICATE') && (
                    <div className="flex items-center justify-between rounded-md bg-background p-3 border">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {getExistingMediaForType('PAN_CERTIFICATE')?.fileName || 'PAN Certificate'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getExistingMediaForType('PAN_CERTIFICATE')?.fileUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(getExistingMediaForType('PAN_CERTIFICATE')?.fileUrl, '_blank')}
                          >
                            View
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMedia(getExistingMediaForType('PAN_CERTIFICATE')!.id, 'PAN_CERTIFICATE')}
                          disabled={!isEditing}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {uploadStates['pan']?.uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading... {uploadStates['pan'].progress}%</span>
                      </div>
                      <Progress value={uploadStates['pan'].progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <input
                      ref={(el) => { fileInputRefs.current['pan'] = el; }}
                      type="file"
                      accept={ACCEPTED_FILE_TYPES.PAN_CERTIFICATE}
                      className="hidden"
                      disabled={!isEditing}
                      onChange={(e) => handleFileInputChange('pan', 'PAN_CERTIFICATE', e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!isEditing}
                      onClick={() => fileInputRefs.current['pan']?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {getExistingMediaForType('PAN_CERTIFICATE') ? 'Replace' : 'Upload'}
                    </Button>
                    <p className="text-xs text-muted-foreground">PDF or image format</p>
                  </div>
                </div>
              </div>

              {/* Pitch Deck */}
              <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Pitch Deck (Optional)</Label>
                    {getExistingMediaForType('PITCH_DECK') && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Uploaded
                      </Badge>
                    )}
                  </div>

                  {getExistingMediaForType('PITCH_DECK') && (
                    <div className="flex items-center justify-between rounded-md bg-background p-3 border">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {getExistingMediaForType('PITCH_DECK')?.fileName || 'Pitch Deck'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getExistingMediaForType('PITCH_DECK')?.fileUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(getExistingMediaForType('PITCH_DECK')?.fileUrl, '_blank')}
                          >
                            View
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMedia(getExistingMediaForType('PITCH_DECK')!.id, 'PITCH_DECK')}
                          disabled={!isEditing}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {uploadStates['pitch']?.uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading... {uploadStates['pitch'].progress}%</span>
                      </div>
                      <Progress value={uploadStates['pitch'].progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <input
                      ref={(el) => { fileInputRefs.current['pitch'] = el; }}
                      type="file"
                      accept={ACCEPTED_FILE_TYPES.PITCH_DECK}
                      className="hidden"
                      disabled={!isEditing}
                      onChange={(e) => handleFileInputChange('pitch', 'PITCH_DECK', e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!isEditing}
                      onClick={() => fileInputRefs.current['pitch']?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {getExistingMediaForType('PITCH_DECK') ? 'Replace' : 'Upload'}
                    </Button>
                    <p className="text-xs text-muted-foreground">PDF or PowerPoint format. Max 50MB</p>
                  </div>
                </div>
              </div>

              {/* Financial Documents */}
              <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                <div className="space-y-3">
                  <Label>Financial Documents (Optional)</Label>

                  {getExistingMediaListForType('FINANCIAL_DOCUMENT').length > 0 && (
                    <div className="space-y-2">
                      {getExistingMediaListForType('FINANCIAL_DOCUMENT').map((media) => (
                        <div
                          key={media.id}
                          className="flex items-center justify-between rounded-md bg-background p-3 border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {media.fileName || 'Financial Document'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {media.fileUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(media.fileUrl, '_blank')}
                              >
                                View
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMedia(media.id, 'FINANCIAL_DOCUMENT')}
                              disabled={!isEditing}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {uploadStates['financial']?.uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading... {uploadStates['financial'].progress}%</span>
                      </div>
                      <Progress value={uploadStates['financial'].progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <input
                      ref={(el) => { fileInputRefs.current['financial'] = el; }}
                      type="file"
                      accept={ACCEPTED_FILE_TYPES.FINANCIAL_DOCUMENT}
                      className="hidden"
                      disabled={!isEditing}
                      onChange={(e) => handleFileInputChange('financial', 'FINANCIAL_DOCUMENT', e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!isEditing}
                      onClick={() => fileInputRefs.current['financial']?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add File
                    </Button>
                    <p className="text-xs text-muted-foreground">Financial statements, projections, etc. (PDF or Excel)</p>
                  </div>
                </div>
              </div>

              {/* Application Form / Other Documents */}
              <div className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                <div className="space-y-3">
                  <Label>Application Form (Optional)</Label>

                  {getExistingMediaListForType('DOCUMENT').length > 0 && (
                    <div className="space-y-2">
                      {getExistingMediaListForType('DOCUMENT').map((media) => (
                        <div
                          key={media.id}
                          className="flex items-center justify-between rounded-md bg-background p-3 border"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium truncate max-w-[200px]">
                                {media.fileName || 'Document'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {media.fileUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(media.fileUrl, '_blank')}
                              >
                                View
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMedia(media.id, 'DOCUMENT')}
                              disabled={!isEditing}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {uploadStates['other']?.uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading... {uploadStates['other'].progress}%</span>
                      </div>
                      <Progress value={uploadStates['other'].progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <input
                      ref={(el) => { fileInputRefs.current['other'] = el; }}
                      type="file"
                      accept={ACCEPTED_FILE_TYPES.DOCUMENT}
                      className="hidden"
                      disabled={!isEditing}
                      onChange={(e) => handleFileInputChange('other', 'DOCUMENT', e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!isEditing}
                      onClick={() => fileInputRefs.current['other']?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add File
                    </Button>
                    <p className="text-xs text-muted-foreground">Business plan, market research, certifications, etc.</p>
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

                {/* Existing YouTube videos */}
                {existingMedia.filter(m => m.mediaType === 'YOUTUBE_VIDEO').length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Your Videos</h4>
                    {existingMedia.filter(m => m.mediaType === 'YOUTUBE_VIDEO').map((media) => (
                      <div
                        key={media.id}
                        className="flex items-center justify-between rounded-md bg-secondary/30 p-4 border"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-8 w-8 rounded bg-red-500/10 flex items-center justify-center flex-shrink-0">
                            <Play className="h-4 w-4 text-red-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {media.title || 'YouTube Video'}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {media.externalUrl || media.fileUrl}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(media.externalUrl || media.fileUrl, '_blank')}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMedia(media.id, 'YOUTUBE_VIDEO')}
                            disabled={!isEditing}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add YouTube URL form */}
                <div className="flex gap-2">
                  <Input
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    disabled={!isEditing || youtubeLoading}
                  />
                  <Button
                    type="button"
                    onClick={handleAddYoutubeVideo}
                    variant="outline"
                    disabled={!isEditing || youtubeLoading || !youtubeUrl.trim()}
                  >
                    {youtubeLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {youtubeUrl && !isValidYouTubeUrl(youtubeUrl) && (
                  <p className="text-xs text-destructive">Invalid YouTube URL</p>
                )}
              </div>

              <div className="flex justify-between">
                <Button type="button" onClick={() => nextTab("business")} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                {isEditing && (
                  <Button onClick={handleSave} disabled={isSaving} variant="hero">
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save All Changes
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </BusinessDashboardLayout>
  );
}
