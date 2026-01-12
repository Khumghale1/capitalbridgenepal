import { useState, useEffect, useRef } from "react";
import { BusinessDashboardLayout } from "./BusinessDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, Globe, Phone, Mail, Loader2, Upload, FileText, Trash2, CheckCircle2, AlertCircle, X, Play } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { BusinessMedia, MediaType } from "@/types/media";
import { MEDIA_TYPE_LABELS, ACCEPTED_FILE_TYPES, formatFileSize } from "@/types/media";
import { isValidYouTubeUrl } from "@/utils/youtube";

// Same options as Register.tsx
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

const companySizes = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
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

// Document upload types
interface UploadState {
  file: File | null;
  progress: number;
  uploading: boolean;
  error: string | null;
}

const DOCUMENT_TYPES: { key: string; mediaType: MediaType; label: string; accept: string; description: string }[] = [
  { key: 'logo', mediaType: 'COMPANY_LOGO', label: 'Company Logo', accept: ACCEPTED_FILE_TYPES.COMPANY_LOGO, description: 'PNG, JPG, or WebP. Recommended: 500x500px' },
  { key: 'registration', mediaType: 'REGISTRATION_CERTIFICATE', label: 'Company Registration Certificate', accept: ACCEPTED_FILE_TYPES.REGISTRATION_CERTIFICATE, description: 'PDF or image format' },
  { key: 'pan', mediaType: 'PAN_CERTIFICATE', label: 'PAN Certificate', accept: ACCEPTED_FILE_TYPES.PAN_CERTIFICATE, description: 'PDF or image format' },
  { key: 'pitchDeck', mediaType: 'PITCH_DECK', label: 'Pitch Deck', accept: ACCEPTED_FILE_TYPES.PITCH_DECK, description: 'PDF or PowerPoint. Max 50MB' },
  { key: 'financial', mediaType: 'FINANCIAL_DOCUMENT', label: 'Financial Documents', accept: ACCEPTED_FILE_TYPES.FINANCIAL_DOCUMENT, description: 'PDF or Excel format' },
  { key: 'other', mediaType: 'DOCUMENT', label: 'Other Documents', accept: ACCEPTED_FILE_TYPES.DOCUMENT, description: 'PDF or Word format' },
];

export default function Profile() {
  const { toast } = useToast();
  const { user } = useAuth();
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
    // Company Information
    name: "",
    registrationNumber: "",
    industry: "",
    yearEstablished: "",
    companySize: "",
    businessType: "",

    // Contact Information
    contactEmail: "",
    contactPhone: "",
    website: "",
    address: "",
    city: "",
    district: "",

    // Social Media
    facebookUrl: "",
    linkedinUrl: "",
    twitterUrl: "",

    // Business Details
    briefDescription: "",
    fullDescription: "",
    fundingStage: "",
    investmentSought: "",
    useOfFunds: "",
    revenueModel: "",

    // Financial Information
    paidUpCapital: "",
    investmentCapacityMin: "",
    investmentCapacityMax: "",
    minimumInvestmentUnits: "",
    maximumInvestmentUnits: "",
    pricePerUnit: "",
    expectedReturnOptions: "",
    estimatedMarketValuation: "",
    ipoTimeHorizon: "",

    // Strategic Information
    vision: "",
    mission: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.businessProfile.getOwnProfile();
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

      // Parse location into address, city, district
      const locationParts = (data.location || "").split(",").map((s: string) => s.trim());
      const address = locationParts[0] || "";
      const city = locationParts[1] || "";
      const district = locationParts[2] || "";

      // Populate form with fetched data
      setFormData({
        name: data.name || "",
        registrationNumber: data.registrationNumber || "",
        industry: data.category?.name || "",
        yearEstablished: data.yearEstablished?.toString() || "",
        companySize: data.teamSize || "",
        businessType: data.businessType || "",

        contactEmail: data.contactEmail || "",
        contactPhone: data.contactPhone || "",
        website: data.website || "",
        address: address,
        city: city,
        district: district,

        facebookUrl: data.facebookUrl || "",
        linkedinUrl: data.linkedinUrl || "",
        twitterUrl: data.twitterUrl || "",

        briefDescription: data.briefDescription || "",
        fullDescription: data.fullDescription || "",
        fundingStage: "", // Not in schema
        investmentSought: data.investmentCapacityMax?.toString() || "",
        useOfFunds: data.growthPlans || "",
        revenueModel: "", // Not in schema

        paidUpCapital: data.paidUpCapital?.toString() || "",
        investmentCapacityMin: data.investmentCapacityMin?.toString() || "",
        investmentCapacityMax: data.investmentCapacityMax?.toString() || "",
        minimumInvestmentUnits: data.minimumInvestmentUnits?.toString() || "",
        maximumInvestmentUnits: data.maximumInvestmentUnits?.toString() || "",
        pricePerUnit: data.pricePerUnit?.toString() || "",
        expectedReturnOptions: data.expectedReturnOptions || "",
        estimatedMarketValuation: data.estimatedMarketValuation?.toString() || "",
        ipoTimeHorizon: data.ipoTimeHorizon || "",

        vision: data.vision || "",
        mission: data.mission || "",
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

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Combine address, city, district into location
      const location = [formData.address, formData.city, formData.district]
        .filter(Boolean)
        .join(", ");

      const updateData: any = {
        name: formData.name || undefined,
        registrationNumber: formData.registrationNumber || undefined,
        businessType: formData.businessType || undefined,
        location: location || undefined,
        teamSize: formData.companySize || undefined,
        briefDescription: formData.briefDescription || undefined,
        fullDescription: formData.fullDescription || undefined,
        vision: formData.vision || undefined,
        mission: formData.mission || undefined,
        growthPlans: formData.useOfFunds || undefined,
        contactEmail: formData.contactEmail || undefined,
        contactPhone: formData.contactPhone || undefined,
        website: formData.website || undefined,
        facebookUrl: formData.facebookUrl || undefined,
        linkedinUrl: formData.linkedinUrl || undefined,
        twitterUrl: formData.twitterUrl || undefined,
        expectedReturnOptions: formData.expectedReturnOptions || undefined,
        ipoTimeHorizon: formData.ipoTimeHorizon || undefined,
      };

      if (formData.yearEstablished) updateData.yearEstablished = parseInt(formData.yearEstablished);
      if (formData.paidUpCapital) updateData.paidUpCapital = parseFloat(formData.paidUpCapital);
      if (formData.investmentCapacityMin) updateData.investmentCapacityMin = parseFloat(formData.investmentCapacityMin);
      if (formData.investmentCapacityMax) updateData.investmentCapacityMax = parseFloat(formData.investmentCapacityMax);
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    console.log('Uploading file:', { mediaType, businessId: businessData.id, fileName: file.name });

    // Update upload state
    setUploadStates(prev => ({
      ...prev,
      [key]: { file, progress: 0, uploading: true, error: null }
    }));

    try {
      // Use logo endpoint for logo, otherwise use media endpoint
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
      const errorDetails = error instanceof Error && 'response' in error ? JSON.stringify((error as any).response) : '';
      console.error('Error details:', errorDetails);
      
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
    // Reset input so same file can be selected again
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">
          Manage your business information and details
        </p>
      </div>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24 shrink-0">
              <AvatarImage src={businessData?.logoUrl || ""} alt="Business Logo" />
              <AvatarFallback className="bg-primary/10">
                <Building2 className="h-10 w-10 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">{formData.name || "Business Name Not Set"}</h3>
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
              <p className="text-muted-foreground">{formData.industry || "Industry Not Set"}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {businessData?.viewCount || 0} profile views
              </p>
              <div className="mt-4 flex gap-2">
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
                {isEditing && (
                  <>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
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
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Tell us about your company and its basic details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                placeholder="ABC Pvt. Ltd."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Company Registration Number *</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                disabled={!isEditing}
                placeholder="12345/078/079"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select
              value={formData.industry}
              onValueChange={(value) => handleInputChange('industry', value)}
              disabled={!isEditing}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder={formData.industry || "Select industry"} />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Note: Industry is set during registration and shown for reference
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., Pvt. Ltd., Public Ltd."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearEstablished">Founded Year</Label>
              <Input
                id="yearEstablished"
                type="number"
                value={formData.yearEstablished}
                onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
                disabled={!isEditing}
                placeholder="2020"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companySize">Company Size</Label>
            <Select
              value={formData.companySize}
              onValueChange={(value) => handleInputChange('companySize', value)}
              disabled={!isEditing}
            >
              <SelectTrigger id="companySize">
                <SelectValue placeholder={formData.companySize || "Select company size"} />
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
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            How can investors and visitors reach you?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Business Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  className="pl-10 bg-secondary"
                  disabled
                  placeholder="Email cannot be changed"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed after registration
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="pl-10"
                  disabled={!isEditing}
                  placeholder="+977 1-XXXXXXX"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="pl-10"
                disabled={!isEditing}
                placeholder="https://www.company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
              placeholder="Thamel Marg, Ward No. 26"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={!isEditing}
                placeholder="Kathmandu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District *</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                disabled={!isEditing}
                placeholder="Kathmandu"
              />
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <Label>Social Media (Optional)</Label>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl" className="text-sm text-muted-foreground">
                  LinkedIn Profile
                </Label>
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebookUrl" className="text-sm text-muted-foreground">
                  Facebook Page
                </Label>
                <Input
                  id="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitterUrl" className="text-sm text-muted-foreground">
                  Twitter/X Profile
                </Label>
                <Input
                  id="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
          <CardDescription>
            Provide details about your business and investment opportunity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="briefDescription">Brief Description *</Label>
            <Textarea
              id="briefDescription"
              rows={3}
              value={formData.briefDescription}
              onChange={(e) => handleInputChange('briefDescription', e.target.value)}
              disabled={!isEditing}
              placeholder="A brief overview of your business (max 200 characters)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullDescription">Full Business Description *</Label>
            <Textarea
              id="fullDescription"
              rows={6}
              value={formData.fullDescription}
              onChange={(e) => handleInputChange('fullDescription', e.target.value)}
              disabled={!isEditing}
              placeholder="Describe your business, what you do, your unique value proposition, and market opportunity..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vision">Vision Statement</Label>
            <Textarea
              id="vision"
              rows={3}
              value={formData.vision}
              onChange={(e) => handleInputChange('vision', e.target.value)}
              disabled={!isEditing}
              placeholder="What is your long-term vision for the company..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea
              id="mission"
              rows={3}
              value={formData.mission}
              onChange={(e) => handleInputChange('mission', e.target.value)}
              disabled={!isEditing}
              placeholder="What is your company's mission and purpose..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fundingStage">Current Funding Stage (Optional)</Label>
              <Select
                value={formData.fundingStage}
                onValueChange={(value) => handleInputChange('fundingStage', value)}
                disabled={!isEditing}
              >
                <SelectTrigger id="fundingStage">
                  <SelectValue placeholder={formData.fundingStage || "Select stage"} />
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
                value={formData.investmentSought}
                onChange={(e) => handleInputChange('investmentSought', e.target.value)}
                disabled={!isEditing}
                placeholder="5000000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="useOfFunds">Use of Funds (Optional)</Label>
            <Textarea
              id="useOfFunds"
              rows={4}
              value={formData.useOfFunds}
              onChange={(e) => handleInputChange('useOfFunds', e.target.value)}
              disabled={!isEditing}
              placeholder="Explain how you plan to use the investment (e.g., product development, marketing, team expansion, etc.)..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenueModel">Revenue Model (Optional)</Label>
            <Textarea
              id="revenueModel"
              rows={4}
              value={formData.revenueModel}
              onChange={(e) => handleInputChange('revenueModel', e.target.value)}
              disabled={!isEditing}
              placeholder="Describe how your business generates or plans to generate revenue..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
          <CardDescription>
            Capital and investment details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paidUpCapital">Paid-Up Capital (NPR)</Label>
            <Input
              id="paidUpCapital"
              type="number"
              value={formData.paidUpCapital}
              onChange={(e) => handleInputChange('paidUpCapital', e.target.value)}
              disabled={!isEditing}
              placeholder="e.g., 1000000"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="investmentCapacityMin">Investment Min (NPR)</Label>
              <Input
                id="investmentCapacityMin"
                type="number"
                value={formData.investmentCapacityMin}
                onChange={(e) => handleInputChange('investmentCapacityMin', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., 100000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="investmentCapacityMax">Investment Max (NPR)</Label>
              <Input
                id="investmentCapacityMax"
                type="number"
                value={formData.investmentCapacityMax}
                onChange={(e) => handleInputChange('investmentCapacityMax', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., 5000000"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="minimumInvestmentUnits">Minimum Investment Units</Label>
              <Input
                id="minimumInvestmentUnits"
                type="number"
                value={formData.minimumInvestmentUnits}
                onChange={(e) => handleInputChange('minimumInvestmentUnits', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., 100"
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
                value={formData.maximumInvestmentUnits}
                onChange={(e) => handleInputChange('maximumInvestmentUnits', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., 10000"
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of units an investor can purchase
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pricePerUnit">Price Per Unit (NPR)</Label>
              <Input
                id="pricePerUnit"
                type="number"
                value={formData.pricePerUnit}
                onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., 100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedMarketValuation">Estimated Market Valuation (NPR)</Label>
              <Input
                id="estimatedMarketValuation"
                type="number"
                value={formData.estimatedMarketValuation}
                onChange={(e) => handleInputChange('estimatedMarketValuation', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., 10000000"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expectedReturnOptions">Expected Return Options</Label>
              <Input
                id="expectedReturnOptions"
                value={formData.expectedReturnOptions}
                onChange={(e) => handleInputChange('expectedReturnOptions', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., 15-20% annual"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ipoTimeHorizon">IPO Time Horizon</Label>
              <Input
                id="ipoTimeHorizon"
                value={formData.ipoTimeHorizon}
                onChange={(e) => handleInputChange('ipoTimeHorizon', e.target.value)}
                disabled={!isEditing}
                placeholder="e.g., 3-5 years"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            Upload supporting documents for your business profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {DOCUMENT_TYPES.map(({ key, mediaType, label, accept, description }) => {
            const existingMedia = mediaType === 'FINANCIAL_DOCUMENT' || mediaType === 'DOCUMENT'
              ? getExistingMediaListForType(mediaType)
              : [getExistingMediaForType(mediaType)].filter(Boolean) as BusinessMedia[];
            const uploadState = uploadStates[key];
            const isMultiple = mediaType === 'FINANCIAL_DOCUMENT' || mediaType === 'DOCUMENT';

            return (
              <div key={key} className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={key}>{label}</Label>
                    {existingMedia.length > 0 && !isMultiple && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Uploaded
                      </Badge>
                    )}
                  </div>

                  {/* Existing files */}
                  {existingMedia.length > 0 && (
                    <div className="space-y-2">
                      {existingMedia.map((media) => (
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
                                {media.fileName || media.title || MEDIA_TYPE_LABELS[mediaType]}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {media.fileSize ? formatFileSize(media.fileSize) : ''}
                                {media.uploadedAt && ` • ${new Date(media.uploadedAt).toLocaleDateString()}`}
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
                              onClick={() => handleDeleteMedia(media.id, mediaType)}
                              disabled={!isEditing}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload progress */}
                  {uploadState?.uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading... {uploadState.progress}%</span>
                      </div>
                      <Progress value={uploadState.progress} className="h-2" />
                    </div>
                  )}

                  {/* Upload error */}
                  {uploadState?.error && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {uploadState.error}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1"
                        onClick={() => setUploadStates(prev => ({ ...prev, [key]: { file: null, progress: 0, uploading: false, error: null } }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  {/* Upload button - show if no existing file or for multi-file types */}
                  {(existingMedia.length === 0 || isMultiple) && !uploadState?.uploading && (
                    <div className="flex items-center gap-3">
                      <input
                        ref={(el) => { fileInputRefs.current[key] = el; }}
                        id={key}
                        type="file"
                        accept={accept}
                        className="hidden"
                        disabled={!isEditing}
                        onChange={(e) => handleFileInputChange(key, mediaType, e)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!isEditing}
                        onClick={() => fileInputRefs.current[key]?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {existingMedia.length > 0 ? 'Add Another' : 'Upload'}
                      </Button>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  )}

                  {/* Replace button for single-file types */}
                  {existingMedia.length > 0 && !isMultiple && !uploadState?.uploading && (
                    <div className="flex items-center gap-3">
                      <input
                        ref={(el) => { fileInputRefs.current[`${key}-replace`] = el; }}
                        type="file"
                        accept={accept}
                        className="hidden"
                        disabled={!isEditing}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && existingMedia[0]) {
                            // Delete existing then upload new
                            handleDeleteMedia(existingMedia[0].id, mediaType).then(() => {
                              handleFileSelect(key, mediaType, file);
                            });
                          }
                          e.target.value = '';
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!isEditing}
                        onClick={() => fileInputRefs.current[`${key}-replace`]?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Replace
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* YouTube Videos */}
      <Card>
        <CardHeader>
          <CardTitle>YouTube Videos</CardTitle>
          <CardDescription>
            Add YouTube links to showcase your business (e.g., company overview, product demo, testimonials)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing YouTube videos */}
          {existingMedia.filter(m => m.mediaType === 'YOUTUBE_VIDEO').length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Your Videos</h3>
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
          <div className="space-y-3 pt-4 border-t">
            <div>
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Paste your YouTube link: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                id="youtubeUrl"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                disabled={!isEditing || youtubeLoading}
              />
              <Button
                onClick={handleAddYoutubeVideo}
                disabled={!isEditing || youtubeLoading || !youtubeUrl.trim()}
                className="whitespace-nowrap"
              >
                {youtubeLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Add Video
                  </>
                )}
              </Button>
            </div>
            {youtubeUrl && !isValidYouTubeUrl(youtubeUrl) && (
              <p className="text-xs text-destructive">Invalid YouTube URL</p>
            )}
          </div>
        </CardContent>
      </Card>
    </BusinessDashboardLayout>
  );
}
