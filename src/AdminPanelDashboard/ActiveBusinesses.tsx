/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Edit, Ban, Search, Eye, Loader2, CheckCircle, AlertCircle, MessageSquare, Download, Plus, Pencil, Trash2, Briefcase, FileText, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";

interface BusinessMedia {
  id: string;
  mediaType: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: string;
  title?: string;
}

interface Business {
  [key: string]: unknown;
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
  address?: string;
  teamSize: string;
  promoterProfile?: string;
  fundingStage?: string;
  paidUpCapital?: string;
  minimumInvestmentUnits?: number;
  maximumInvestmentUnits?: number;
  pricePerUnit?: number;
  expectedReturnOptions?: string;
  estimatedMarketValuation?: number;
  ipoTimeHorizon?: string;
  briefDescription: string;
  fullDescription?: string;
  vision?: string;
  mission?: string;
  growthPlans?: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  logoUrl?: string;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  media?: BusinessMedia[];
}

interface BusinessResponse {
  businesses: Business[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface FollowUp {
  id: string;
  followUpNumber: number;
  remarks: string;
  createdAt: string;
}

interface Interest {
  id: string;
  investorName: string;
  email: string;
  phoneNumber: string;
  message: string | null;
  submittedAt: string;
  contacted: boolean;
  followUpRemarks: string | null;
  followUps: FollowUp[];
}

// Constants for dropdown options
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
  "Growth Stage",
  "Operational",
  "Revenue Generating",
  "Pre-IPO / Late-Stage Funding",
  "Pre-Seed Stage",
  "Initial Public Offering (IPO)",
];


// Category options matching database IDs
const categoryOptions = [
  { id: 1, name: "Investment", slug: "investment" },
  { id: 2, name: "Technology", slug: "technology" },
  { id: 3, name: "Tech Company", slug: "tech" },
  { id: 4, name: "Hydropower", slug: "hydropower" },
  { id: 5, name: "Fintech", slug: "fintech" },
  { id: 6, name: "Edtech", slug: "edtech" },
  { id: 7, name: "Manufacturing", slug: "manufacturing" },
  { id: 8, name: "Tourism & Hospitality", slug: "tourism" },
  { id: 9, name: "Agriculture", slug: "agriculture" },
  { id: 10, name: "Real Estate", slug: "real-estate" },
  { id: 11, name: "Healthcare", slug: "healthcare" },
  { id: 12, name: "Food & Beverage", slug: "food-beverage" },
  { id: 13, name: "Retail", slug: "retail" },
  { id: 14, name: "Others", slug: "others" },
];

const companySizes = [
  "1–5 Employees",
  "6–10 Employees",
  "11–25 Employees",
  "26–50 Employees",
  "51–100 Employees",
  "100+ Employees",
];

export default function ActiveBusinesses() {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });

  // View Details Dialog
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [viewDetailsTab, setViewDetailsTab] = useState("company");

  // Edit Business Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [editTab, setEditTab] = useState("company");
  const [isSaving, setIsSaving] = useState(false);

  // Inquiries Dialog
  const [inquiriesDialogOpen, setInquiriesDialogOpen] = useState(false);
  const [inquiriesBusiness, setInquiriesBusiness] = useState<Business | null>(null);
  const [inquiries, setInquiries] = useState<Interest[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);
  const [updatingInterestId, setUpdatingInterestId] = useState<string | null>(null);

  // Add follow-up dialog
  const [addFollowUpOpen, setAddFollowUpOpen] = useState(false);
  const [selectedInterestId, setSelectedInterestId] = useState<string | null>(null);
  const [newFollowUpRemarks, setNewFollowUpRemarks] = useState("");
  const [isAddingFollowUp, setIsAddingFollowUp] = useState(false);

  // Edit follow-up dialog
  const [editFollowUpOpen, setEditFollowUpOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
  const [editFollowUpRemarks, setEditFollowUpRemarks] = useState("");
  const [isEditingFollowUp, setIsEditingFollowUp] = useState(false);

  // Delete follow-up dialog
  const [deleteFollowUpOpen, setDeleteFollowUpOpen] = useState(false);
  const [deletingFollowUp, setDeletingFollowUp] = useState<FollowUp | null>(null);
  const [isDeletingFollowUp, setIsDeletingFollowUp] = useState(false);

  // Inquiries pagination
  const [inquiriesPage, setInquiriesPage] = useState(1);
  const inquiriesPerPage = 10;

  useEffect(() => {
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await api.businesses.getActive() as BusinessResponse;

      setBusinesses(data.businesses);
      setPagination(data.pagination);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      toast({
        title: "Error",
        description: "Failed to load businesses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (business: Business) => {
    try {
      const data = await api.businesses.getDetailsById(business.id) as { business: Business };
      setSelectedBusiness(data.business);
      setViewDetailsTab("company");
      setViewDetailsOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load business details",
        variant: "destructive",
      });
    }
  };

  const handleEditBusiness = async (business: Business) => {
    try {
      const data = await api.businesses.getDetailsById(business.id) as { business: Business };
      setEditingBusiness({ ...data.business });
      setEditTab("company");
      setEditDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load business details for editing",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingBusiness) return;

    try {
      setIsSaving(true);

      // Prepare the data for update, excluding read-only fields
      const updateData = {
        name: editingBusiness.name,
        registrationNumber: editingBusiness.registrationNumber,
        panNumber: (editingBusiness as any).panNumber || null,
        categoryId: editingBusiness.category?.id,
        businessType: editingBusiness.businessType,
        yearEstablished: editingBusiness.yearEstablished,
        teamSize: editingBusiness.teamSize,
        promoterProfile: editingBusiness.promoterProfile || null,
        location: editingBusiness.location,
        address: editingBusiness.address || null,
        contactEmail: editingBusiness.contactEmail,
        contactPhone: editingBusiness.contactPhone,
        website: editingBusiness.website || null,
        facebookUrl: editingBusiness.facebookUrl || null,
        linkedinUrl: editingBusiness.linkedinUrl || null,
        instagramUrl: editingBusiness.instagramUrl || null,
        fundingStage: editingBusiness.fundingStage || null,
        paidUpCapital: editingBusiness.paidUpCapital || null,
        briefDescription: editingBusiness.briefDescription,
        fullDescription: editingBusiness.fullDescription || null,
        vision: editingBusiness.vision || null,
        mission: editingBusiness.mission || null,
        growthPlans: editingBusiness.growthPlans || null,
        minimumInvestmentUnits: editingBusiness.minimumInvestmentUnits || null,
        maximumInvestmentUnits: editingBusiness.maximumInvestmentUnits || null,
        pricePerUnit: editingBusiness.pricePerUnit || null,
        expectedReturnOptions: editingBusiness.expectedReturnOptions || null,
        estimatedMarketValuation: editingBusiness.estimatedMarketValuation || null,
        ipoTimeHorizon: editingBusiness.ipoTimeHorizon || null,
        isFeatured: editingBusiness.isFeatured,
      };

      await api.businesses.update(editingBusiness.id, updateData);

      toast({
        title: "Success",
        description: "Business updated successfully",
      });

      setEditDialogOpen(false);
      fetchBusinesses();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update business",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (business: Business) => {
    try {
      await api.businesses.toggleActive(business.id);

      toast({
        title: "Success",
        description: `Business ${!business.isActive ? 'activated' : 'deactivated'} successfully`,
      });

      fetchBusinesses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle business status",
        variant: "destructive",
      });
    }
  };

  const handleViewInquiries = async (business: Business) => {
    setInquiriesBusiness(business);
    setInquiriesDialogOpen(true);
    setIsLoadingInquiries(true);
    setInquiriesPage(1);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.interests.getByBusinessId(business.id);
      setInquiries(response.interests || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load inquiries",
        variant: "destructive",
      });
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  const handleContactedChange = async (interestId: string, contacted: boolean) => {
    if (!inquiriesBusiness) return;

    try {
      setUpdatingInterestId(interestId);
      await api.interests.update(interestId, { contacted, businessId: inquiriesBusiness.id });

      setInquiries(prev =>
        prev.map(interest =>
          interest.id === interestId
            ? { ...interest, contacted }
            : interest
        )
      );

      toast({
        title: "Updated",
        description: `Marked as ${contacted ? 'contacted' : 'not contacted'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update",
        variant: "destructive",
      });
    } finally {
      setUpdatingInterestId(null);
    }
  };

  const handleRemarksChange = async (interestId: string, followUpRemarks: string) => {
    if (!inquiriesBusiness) return;

    try {
      setUpdatingInterestId(interestId);
      await api.interests.update(interestId, { followUpRemarks, businessId: inquiriesBusiness.id });

      setInquiries(prev =>
        prev.map(interest =>
          interest.id === interestId
            ? { ...interest, followUpRemarks }
            : interest
        )
      );

      toast({
        title: "Updated",
        description: "Remarks saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update",
        variant: "destructive",
      });
    } finally {
      setUpdatingInterestId(null);
    }
  };

  const openAddFollowUpDialog = (interestId: string) => {
    setSelectedInterestId(interestId);
    setNewFollowUpRemarks("");
    setAddFollowUpOpen(true);
  };

  const handleAddFollowUp = async () => {
    if (!selectedInterestId || !newFollowUpRemarks.trim() || !inquiriesBusiness) return;

    try {
      setIsAddingFollowUp(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.interests.addFollowUp(selectedInterestId, newFollowUpRemarks, inquiriesBusiness.id);

      // Update the local state with the new follow-up
      setInquiries(prev =>
        prev.map(interest => {
          if (interest.id === selectedInterestId) {
            return {
              ...interest,
              contacted: true,
              followUps: [...(interest.followUps || []), response.followUp]
            };
          }
          return interest;
        })
      );

      toast({
        title: "Success",
        description: "Follow-up added successfully",
      });

      setAddFollowUpOpen(false);
      setNewFollowUpRemarks("");
      setSelectedInterestId(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add follow-up';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAddingFollowUp(false);
    }
  };

  const openEditFollowUpDialog = (followUp: FollowUp) => {
    setEditingFollowUp(followUp);
    setEditFollowUpRemarks(followUp.remarks);
    setEditFollowUpOpen(true);
  };

  const handleEditFollowUp = async () => {
    if (!editingFollowUp || !editFollowUpRemarks.trim() || !inquiriesBusiness) return;

    try {
      setIsEditingFollowUp(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.interests.updateFollowUp(editingFollowUp.id, editFollowUpRemarks, inquiriesBusiness.id);

      // Update the local state
      setInquiries(prev =>
        prev.map(interest => ({
          ...interest,
          followUps: interest.followUps?.map(f =>
            f.id === editingFollowUp.id ? { ...f, remarks: response.followUp.remarks } : f
          ) || []
        }))
      );

      toast({
        title: "Success",
        description: "Follow-up updated successfully",
      });

      setEditFollowUpOpen(false);
      setEditingFollowUp(null);
      setEditFollowUpRemarks("");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update follow-up';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsEditingFollowUp(false);
    }
  };

  const openDeleteFollowUpDialog = (followUp: FollowUp) => {
    setDeletingFollowUp(followUp);
    setDeleteFollowUpOpen(true);
  };

  const handleDeleteFollowUp = async () => {
    if (!deletingFollowUp || !inquiriesBusiness) return;

    try {
      setIsDeletingFollowUp(true);
      await api.interests.deleteFollowUp(deletingFollowUp.id, inquiriesBusiness.id);

      // Update the local state
      setInquiries(prev =>
        prev.map(interest => ({
          ...interest,
          followUps: interest.followUps?.filter(f => f.id !== deletingFollowUp.id) || []
        }))
      );

      toast({
        title: "Success",
        description: "Follow-up deleted successfully",
      });

      setDeleteFollowUpOpen(false);
      setDeletingFollowUp(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete follow-up';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeletingFollowUp(false);
    }
  };

  // Calculate max follow-ups to determine column count
  const maxFollowUps = Math.max(0, ...inquiries.map(i => i.followUps?.length || 0));

  // Pagination calculations for inquiries
  const totalInquiriesPages = Math.ceil(inquiries.length / inquiriesPerPage);
  const paginatedInquiries = inquiries.slice(
    (inquiriesPage - 1) * inquiriesPerPage,
    inquiriesPage * inquiriesPerPage
  );

  const downloadInquiriesCSV = () => {
    if (inquiries.length === 0 || !inquiriesBusiness) {
      toast({
        title: "No data",
        description: "There are no inquiries to download",
        variant: "destructive",
      });
      return;
    }

    // CSV headers - dynamic based on max follow-ups
    const headers = [
      "Name", "Email", "Phone Number", "Message", "Contacted",
      ...Array.from({ length: maxFollowUps }, (_, i) => `Follow-up ${i + 1}`),
      "Submitted At"
    ];

    const rows = inquiries.map(interest => {
      const followUpData = Array.from({ length: maxFollowUps }, (_, i) => {
        const followUp = interest.followUps?.find(f => f.followUpNumber === i + 1);
        return followUp ? followUp.remarks : "";
      });

      return [
        interest.investorName,
        interest.email,
        interest.phoneNumber,
        interest.message || "",
        interest.contacted ? "Yes" : "No",
        ...followUpData,
        new Date(interest.submittedAt).toLocaleString()
      ];
    });

    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${inquiriesBusiness.name.replace(/[^a-z0-9]/gi, '_')}_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "CSV file downloaded successfully",
    });
  };

  const activeCount = businesses.filter(b => b.isActive).length;
  const inactiveCount = businesses.filter(b => !b.isActive).length;

  return (
    <AdminPanelDashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Active Businesses</h2>
        <p className="text-muted-foreground">
          Manage all active businesses on the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
            <p className="text-xs text-muted-foreground">All approved businesses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">Visible to public</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <Ban className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveCount}</div>
            <p className="text-xs text-muted-foreground">Hidden from public</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.filter(b => b.isFeatured).length}</div>
            <p className="text-xs text-muted-foreground">Featured listings</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search businesses by name, sector, location..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading businesses...</span>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <span className="ml-2 text-muted-foreground">{error}</span>
          </CardContent>
        </Card>
      )}

      {/* Businesses List */}
      {!isLoading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>All Active Businesses</CardTitle>
            <CardDescription>
              Complete list of businesses currently on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {businesses.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No businesses found</p>
                </div>
              ) : (
                businesses.map((business) => (
                  <div key={business.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {business.logoUrl ? (
                          <img src={business.logoUrl} alt={business.name} className="h-10 w-10 object-contain" />
                        ) : (
                          <Building2 className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{business.name}</h4>
                          <Badge className={business.isActive ? "bg-green-500" : "bg-orange-500"}>
                            {business.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {business.isFeatured && <Badge variant="secondary">Featured</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {business.category?.name || 'N/A'} • {business.location || 'N/A'}
                          {(business.minimumInvestmentUnits || business.maximumInvestmentUnits) && (
                            <> • Min: {business.minimumInvestmentUnits?.toLocaleString() || 'N/A'} - Max: {business.maximumInvestmentUnits?.toLocaleString() || 'N/A'} units</>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {business.viewCount} views • Added {new Date(business.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(business)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewInquiries(business)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          View Inquiries
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditBusiness(business)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Business
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(business)}
                          className={business.isActive ? "text-destructive" : "text-green-600"}
                        >
                          {business.isActive ? (
                            <>
                              <Ban className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {businesses.length} of {pagination.total} businesses
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Details Dialog - Tab-based UI */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {selectedBusiness?.name || "Business Details"}
            </DialogTitle>
            <DialogDescription>
              View complete information about this business
            </DialogDescription>
          </DialogHeader>
          {selectedBusiness && (
            <Tabs value={viewDetailsTab} onValueChange={setViewDetailsTab} className="mt-4">
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

              {/* Company Tab */}
              <TabsContent value="company" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Company Name</Label>
                    <p className="text-sm font-medium">{selectedBusiness.name || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Registration Number</Label>
                    <p className="text-sm font-medium">{selectedBusiness.registrationNumber || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">PAN Number</Label>
                    <p className="text-sm font-medium">{(selectedBusiness as any).panNumber || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Industry/Sector</Label>
                    <p className="text-sm font-medium">{selectedBusiness.category?.name || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Business Type</Label>
                    <p className="text-sm font-medium">{selectedBusiness.businessType || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Year Established</Label>
                    <p className="text-sm font-medium">{selectedBusiness.yearEstablished || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Company Size</Label>
                    <p className="text-sm font-medium">{selectedBusiness.teamSize || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Promoter Profile</Label>
                    <p className="text-sm font-medium">{selectedBusiness.promoterProfile || "N/A"}</p>
                  </div>
                </div>

                {/* Status & Metrics */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3 text-sm">Status & Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <div className="mt-1">
                        <Badge className={selectedBusiness.isActive ? "bg-green-500" : "bg-orange-500"}>
                          {selectedBusiness.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">View Count</Label>
                      <p className="text-sm font-medium">{selectedBusiness.viewCount || 0} views</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Featured</Label>
                      <div className="mt-1">
                        <Badge variant={selectedBusiness.isFeatured ? "default" : "outline"}>
                          {selectedBusiness.isFeatured ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Created On</Label>
                      <p className="text-sm font-medium">{new Date(selectedBusiness.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Last Updated</Label>
                      <p className="text-sm font-medium">{new Date(selectedBusiness.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-sm font-medium">{selectedBusiness.contactEmail || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <p className="text-sm font-medium">{selectedBusiness.contactPhone || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Website</Label>
                    <p className="text-sm font-medium">{selectedBusiness.website || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Location</Label>
                    <p className="text-sm font-medium">{selectedBusiness.location || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-muted-foreground">Address</Label>
                    <p className="text-sm font-medium">{selectedBusiness.address || "N/A"}</p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3 text-sm">Social Media</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Facebook</Label>
                      {selectedBusiness.facebookUrl ? (
                        <a href={selectedBusiness.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block truncate">
                          {selectedBusiness.facebookUrl}
                        </a>
                      ) : (
                        <p className="text-sm font-medium">N/A</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">LinkedIn</Label>
                      {selectedBusiness.linkedinUrl ? (
                        <a href={selectedBusiness.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block truncate">
                          {selectedBusiness.linkedinUrl}
                        </a>
                      ) : (
                        <p className="text-sm font-medium">N/A</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Instagram</Label>
                      {selectedBusiness.instagramUrl ? (
                        <a href={selectedBusiness.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block truncate">
                          {selectedBusiness.instagramUrl}
                        </a>
                      ) : (
                        <p className="text-sm font-medium">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Business Tab */}
              <TabsContent value="business" className="space-y-4 mt-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Brief Description</Label>
                  <p className="text-sm mt-1">{selectedBusiness.briefDescription || "N/A"}</p>
                </div>
                {selectedBusiness.fullDescription && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Full Description</Label>
                    <p className="text-sm whitespace-pre-wrap mt-1">{selectedBusiness.fullDescription}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Funding Stage</Label>
                    <p className="text-sm font-medium">{selectedBusiness.fundingStage || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Paid-Up Capital</Label>
                    <p className="text-sm font-medium">{selectedBusiness.paidUpCapital || "N/A"}</p>
                  </div>
                </div>
                {(selectedBusiness.vision || selectedBusiness.mission) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedBusiness.vision && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Vision</Label>
                        <p className="text-sm mt-1">{selectedBusiness.vision}</p>
                      </div>
                    )}
                    {selectedBusiness.mission && (
                      <div>
                        <Label className="text-xs text-muted-foreground">Mission</Label>
                        <p className="text-sm mt-1">{selectedBusiness.mission}</p>
                      </div>
                    )}
                  </div>
                )}
                {selectedBusiness.growthPlans && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Use of Funds / Growth Plans</Label>
                    <p className="text-sm whitespace-pre-wrap mt-1">{selectedBusiness.growthPlans}</p>
                  </div>
                )}

                {/* Investment Parameters */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3 text-sm">Investment Parameters</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Minimum Investment Units</Label>
                      <p className="text-sm font-medium">{selectedBusiness.minimumInvestmentUnits?.toLocaleString() || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Maximum Investment Units</Label>
                      <p className="text-sm font-medium">{selectedBusiness.maximumInvestmentUnits?.toLocaleString() || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Price Per Unit</Label>
                      <p className="text-sm font-medium">{selectedBusiness.pricePerUnit ? `NPR ${selectedBusiness.pricePerUnit.toLocaleString()}` : "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Expected Return</Label>
                      <p className="text-sm font-medium">{selectedBusiness.expectedReturnOptions || "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Market Valuation</Label>
                      <p className="text-sm font-medium">{selectedBusiness.estimatedMarketValuation ? `NPR ${selectedBusiness.estimatedMarketValuation.toLocaleString()}` : "N/A"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">IPO Timeline</Label>
                      <p className="text-sm font-medium">{selectedBusiness.ipoTimeHorizon || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4 mt-4">
                {selectedBusiness.media && selectedBusiness.media.length > 0 ? (
                  <div className="space-y-3">
                    {selectedBusiness.media.map((doc: BusinessMedia) => (
                      <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3 bg-secondary/30">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{doc.fileName || doc.title || doc.mediaType}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.mediaType} {doc.fileSize && `• ${(parseInt(doc.fileSize) / 1024).toFixed(2)} KB`}
                            </p>
                          </div>
                        </div>
                        {doc.fileUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                            className="ml-2 flex-shrink-0"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No documents uploaded</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Business Dialog - Tab-based UI */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Business
            </DialogTitle>
            <DialogDescription>
              Make changes to business information. Admin can edit all fields including category.
            </DialogDescription>
          </DialogHeader>
          {editingBusiness && (
            <Tabs value={editTab} onValueChange={setEditTab} className="mt-4">
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

              {/* Company Tab */}
              <TabsContent value="company" className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company Name *</Label>
                    <Input
                      value={editingBusiness.name}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Registration Number *</Label>
                    <Input
                      value={editingBusiness.registrationNumber}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, registrationNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>PAN Number</Label>
                    <Input
                      value={(editingBusiness as any).panNumber || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, panNumber: e.target.value } as any)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry/Sector *</Label>
                    <Select
                      value={editingBusiness.category?.id?.toString()}
                      onValueChange={(value) => {
                        const cat = categoryOptions.find(c => c.id.toString() === value);
                        if (cat) {
                          setEditingBusiness({ ...editingBusiness, category: cat });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Admin can change the business sector</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Business Type</Label>
                    <Input
                      value={editingBusiness.businessType}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, businessType: e.target.value })}
                      placeholder="e.g., Private Limited"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Year Established</Label>
                    <Input
                      type="number"
                      value={editingBusiness.yearEstablished || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, yearEstablished: e.target.value ? parseInt(e.target.value) : undefined } as any)}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company Size</Label>
                    <Select
                      value={editingBusiness.teamSize}
                      onValueChange={(value) => setEditingBusiness({ ...editingBusiness, teamSize: value })}
                    >
                      <SelectTrigger>
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
                    <Label>Promoter Profile</Label>
                    <Input
                      value={editingBusiness.promoterProfile || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, promoterProfile: e.target.value })}
                      placeholder="e.g., ABC Group, XYZ Holdings"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={editingBusiness.isFeatured}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, isFeatured: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="isFeatured">Featured Business</Label>
                  </div>
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Contact Email *</Label>
                    <Input
                      type="email"
                      value={editingBusiness.contactEmail}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, contactEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Phone *</Label>
                    <Input
                      value={editingBusiness.contactPhone}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, contactPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    type="url"
                    value={editingBusiness.website || ''}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, website: e.target.value })}
                    placeholder="https://www.company.com"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input
                      value={editingBusiness.location}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, location: e.target.value })}
                      placeholder="e.g., Kathmandu, Nepal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={editingBusiness.address || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, address: e.target.value })}
                      placeholder="Street address"
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3 text-sm">Social Media</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>LinkedIn</Label>
                      <Input
                        type="url"
                        value={editingBusiness.linkedinUrl || ''}
                        onChange={(e) => setEditingBusiness({ ...editingBusiness, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/company/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Facebook</Label>
                      <Input
                        type="url"
                        value={editingBusiness.facebookUrl || ''}
                        onChange={(e) => setEditingBusiness({ ...editingBusiness, facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Instagram</Label>
                      <Input
                        type="url"
                        value={editingBusiness.instagramUrl || ''}
                        onChange={(e) => setEditingBusiness({ ...editingBusiness, instagramUrl: e.target.value })}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Business Tab */}
              <TabsContent value="business" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Brief Description *</Label>
                  <Textarea
                    value={editingBusiness.briefDescription}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, briefDescription: e.target.value })}
                    rows={3}
                    placeholder="Brief description of your business..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Full Description</Label>
                  <Textarea
                    value={editingBusiness.fullDescription || ''}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, fullDescription: e.target.value })}
                    rows={5}
                    placeholder="Detailed description of your business..."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Funding Stage</Label>
                    <Select
                      value={editingBusiness.fundingStage || ''}
                      onValueChange={(value) => setEditingBusiness({ ...editingBusiness, fundingStage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select funding stage" />
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
                    <Label>Paid-Up Capital</Label>
                    <Input
                      value={editingBusiness.paidUpCapital || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, paidUpCapital: e.target.value })}
                      placeholder="e.g., 50 Lakhs, 1 Crore, etc."
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Vision</Label>
                    <Textarea
                      value={editingBusiness.vision || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, vision: e.target.value })}
                      rows={3}
                      placeholder="Company vision..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mission</Label>
                    <Textarea
                      value={editingBusiness.mission || ''}
                      onChange={(e) => setEditingBusiness({ ...editingBusiness, mission: e.target.value })}
                      rows={3}
                      placeholder="Company mission..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Use of Funds / Growth Plans</Label>
                  <Textarea
                    value={editingBusiness.growthPlans || ''}
                    onChange={(e) => setEditingBusiness({ ...editingBusiness, growthPlans: e.target.value })}
                    rows={4}
                    placeholder="Explain how funds will be used..."
                  />
                </div>

                {/* Investment Parameters */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3 text-sm">Investment Parameters</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Minimum Investment Units</Label>
                      <Input
                        type="number"
                        value={editingBusiness.minimumInvestmentUnits || ''}
                        onChange={(e) => setEditingBusiness({ ...editingBusiness, minimumInvestmentUnits: e.target.value ? parseInt(e.target.value) : undefined })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Maximum Investment Units</Label>
                      <Input
                        type="number"
                        value={editingBusiness.maximumInvestmentUnits || ''}
                        onChange={(e) => setEditingBusiness({ ...editingBusiness, maximumInvestmentUnits: e.target.value ? parseInt(e.target.value) : undefined })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price per Unit (NPR)</Label>
                      <Input
                        type="number"
                        value={editingBusiness.pricePerUnit || ''}
                        onChange={(e) => setEditingBusiness({ ...editingBusiness, pricePerUnit: e.target.value ? parseFloat(e.target.value) : undefined })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated Market Valuation (NPR)</Label>
                      <Input
                        type="number"
                        value={editingBusiness.estimatedMarketValuation || ''}
                        onChange={(e) => setEditingBusiness({ ...editingBusiness, estimatedMarketValuation: e.target.value ? parseFloat(e.target.value) : undefined })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expected Return Options</Label>
                      <Input
                        value={editingBusiness.expectedReturnOptions || ''}
                        onChange={(e) => setEditingBusiness({ ...editingBusiness, expectedReturnOptions: e.target.value })}
                        placeholder="e.g., IPO Upside or dividend"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>IPO Time Horizon</Label>
                      <Input
                        value={editingBusiness.ipoTimeHorizon || ''}
                        onChange={(e) => setEditingBusiness({ ...editingBusiness, ipoTimeHorizon: e.target.value })}
                        placeholder="e.g., 3-5 years"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4 mt-4">
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                  <p className="text-sm text-amber-800">
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                    Documents can only be viewed here. To upload new documents, use the business profile page or contact the business owner.
                  </p>
                </div>
                {editingBusiness.media && editingBusiness.media.length > 0 ? (
                  <div className="space-y-3">
                    {editingBusiness.media.map((doc: BusinessMedia) => (
                      <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3 bg-secondary/30">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{doc.fileName || doc.title || doc.mediaType}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.mediaType} {doc.fileSize && `• ${(parseInt(doc.fileSize) / 1024).toFixed(2)} KB`}
                            </p>
                          </div>
                        </div>
                        {doc.fileUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                            className="ml-2 flex-shrink-0"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No documents uploaded</p>
                  </div>
                )}
              </TabsContent>

              {/* Save Button */}
              <div className="flex gap-2 pt-4 border-t mt-4">
                <Button onClick={handleSaveEdit} disabled={isSaving} className="flex-1">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isSaving}>
                  Cancel
                </Button>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Inquiries Dialog */}
      <Dialog open={inquiriesDialogOpen} onOpenChange={setInquiriesDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Investment Inquiries</DialogTitle>
                <DialogDescription>
                  All inquiries for {inquiriesBusiness?.name}
                </DialogDescription>
              </div>
              <Button onClick={downloadInquiriesCSV} variant="outline" className="gap-2" disabled={inquiries.length === 0}>
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </DialogHeader>

          {isLoadingInquiries ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading inquiries...</span>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground font-medium">No inquiries yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                This business has not received any investment inquiries
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Name</TableHead>
                    <TableHead className="min-w-[180px]">Email</TableHead>
                    <TableHead className="min-w-[120px]">Phone Number</TableHead>
                    <TableHead className="min-w-[200px]">Message</TableHead>
                    <TableHead className="min-w-[100px]">Contacted</TableHead>
                    {/* Dynamic Follow-up columns */}
                    {Array.from({ length: maxFollowUps }, (_, i) => (
                      <TableHead key={`followup-header-${i}`} className="min-w-[150px]">
                        Follow-up {i + 1}
                      </TableHead>
                    ))}
                    <TableHead className="min-w-[60px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInquiries.map((interest) => (
                    <TableRow key={interest.id}>
                      <TableCell className="font-medium">{interest.investorName}</TableCell>
                      <TableCell>{interest.email}</TableCell>
                      <TableCell>{interest.phoneNumber}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="truncate" title={interest.message || ""}>
                          {interest.message || "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={interest.contacted ? "yes" : "no"}
                          onValueChange={(value) => handleContactedChange(interest.id, value === "yes")}
                          disabled={updatingInterestId === interest.id}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      {/* Dynamic Follow-up cells */}
                      {Array.from({ length: maxFollowUps }, (_, i) => {
                        const followUp = interest.followUps?.find(f => f.followUpNumber === i + 1);
                        return (
                          <TableCell key={`followup-${interest.id}-${i}`} className="min-w-[180px]">
                            {followUp ? (
                              <div className="text-sm">
                                <p className="truncate max-w-[120px]" title={followUp.remarks}>{followUp.remarks}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(followUp.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex gap-1 mt-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => openEditFollowUpDialog(followUp)}
                                    title="Edit Follow-up"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                    onClick={() => openDeleteFollowUpDialog(followUp)}
                                    title="Delete Follow-up"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        );
                      })}
                      {/* Add Follow-up button */}
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openAddFollowUpDialog(interest.id)}
                          title="Add Follow-up"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              {totalInquiriesPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {((inquiriesPage - 1) * inquiriesPerPage) + 1} - {Math.min(inquiriesPage * inquiriesPerPage, inquiries.length)} of {inquiries.length} inquiries
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInquiriesPage(prev => Math.max(1, prev - 1))}
                      disabled={inquiriesPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {inquiriesPage} of {totalInquiriesPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInquiriesPage(prev => Math.min(totalInquiriesPages, prev + 1))}
                      disabled={inquiriesPage === totalInquiriesPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Follow-up Dialog */}
      <Dialog open={addFollowUpOpen} onOpenChange={setAddFollowUpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Follow-up</DialogTitle>
            <DialogDescription>
              Add a new follow-up note for this inquiry
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter follow-up remarks..."
              value={newFollowUpRemarks}
              onChange={(e) => setNewFollowUpRemarks(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFollowUpOpen(false)} disabled={isAddingFollowUp}>
              Cancel
            </Button>
            <Button onClick={handleAddFollowUp} disabled={isAddingFollowUp || !newFollowUpRemarks.trim()}>
              {isAddingFollowUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Follow-up'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Follow-up Dialog */}
      <Dialog open={editFollowUpOpen} onOpenChange={setEditFollowUpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Follow-up</DialogTitle>
            <DialogDescription>
              Update the follow-up remarks
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter follow-up remarks..."
              value={editFollowUpRemarks}
              onChange={(e) => setEditFollowUpRemarks(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFollowUpOpen(false)} disabled={isEditingFollowUp}>
              Cancel
            </Button>
            <Button onClick={handleEditFollowUp} disabled={isEditingFollowUp || !editFollowUpRemarks.trim()}>
              {isEditingFollowUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Follow-up Dialog */}
      <Dialog open={deleteFollowUpOpen} onOpenChange={setDeleteFollowUpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Follow-up</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this follow-up? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFollowUpOpen(false)} disabled={isDeletingFollowUp}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFollowUp} disabled={isDeletingFollowUp}>
              {isDeletingFollowUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPanelDashboardLayout>
  );
}
