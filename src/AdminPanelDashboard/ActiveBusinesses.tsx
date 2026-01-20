import { useEffect, useState } from "react";
import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Edit, Ban, Search, Eye, Loader2, CheckCircle, AlertCircle, Mail, MessageSquare, Download, Plus } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  vision?: string;
  mission?: string;
  growthPlans?: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
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

export default function ActiveBusinesses() {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 0 });

  // View Details Dialog
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  // Edit Business Sheet
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
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
      setViewDetailsOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load business details",
        variant: "destructive",
      });
    }
  };

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness({ ...business });
    setEditSheetOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBusiness) return;

    try {
      setIsSaving(true);
      await api.businesses.update(editingBusiness.id, editingBusiness);

      toast({
        title: "Success",
        description: "Business updated successfully",
      });

      setEditSheetOpen(false);
      fetchBusinesses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business",
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

  // Calculate max follow-ups to determine column count
  const maxFollowUps = Math.max(0, ...inquiries.map(i => i.followUps?.length || 0));

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
                          {business.category.name} • {business.location} • Seeking NPR {business.investmentCapacityMin.toLocaleString()} - {business.investmentCapacityMax.toLocaleString()}
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

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Business Details</DialogTitle>
            <DialogDescription>
              Complete information about this business
            </DialogDescription>
          </DialogHeader>
          {selectedBusiness && (
            <div className="space-y-6">
              {/* Company Information */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4" />
                  Company Information
                </h4>
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
                    <Label className="text-xs text-muted-foreground">Industry</Label>
                    <p className="text-sm font-medium">{selectedBusiness.category.name || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Business Type</Label>
                    <p className="text-sm font-medium">{selectedBusiness.businessType || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Year Founded</Label>
                    <p className="text-sm font-medium">{selectedBusiness.yearEstablished || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Company Size</Label>
                    <p className="text-sm font-medium">{selectedBusiness.teamSize || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-base">
                  <Mail className="h-4 w-4" />
                  Contact Information
                </h4>
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
                </div>
                {(selectedBusiness.facebookUrl || selectedBusiness.linkedinUrl || selectedBusiness.twitterUrl) && (
                  <div className="mt-3">
                    <Label className="text-xs text-muted-foreground">Social Media</Label>
                    <div className="flex gap-2 mt-1">
                      {selectedBusiness.facebookUrl && (
                        <a href={selectedBusiness.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          Facebook
                        </a>
                      )}
                      {selectedBusiness.linkedinUrl && (
                        <a href={selectedBusiness.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          LinkedIn
                        </a>
                      )}
                      {selectedBusiness.twitterUrl && (
                        <a href={selectedBusiness.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          Twitter
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Business Details */}
              <div>
                <h4 className="font-semibold mb-3 text-base">Business Details</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Brief Description</Label>
                    <p className="text-sm">{selectedBusiness.briefDescription || "N/A"}</p>
                  </div>
                  {selectedBusiness.fullDescription && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Full Description</Label>
                      <p className="text-sm whitespace-pre-wrap">{selectedBusiness.fullDescription}</p>
                    </div>
                  )}
                  {selectedBusiness.growthPlans && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Use of Funds / Growth Plans</Label>
                      <p className="text-sm whitespace-pre-wrap">{selectedBusiness.growthPlans}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h4 className="font-semibold mb-3 text-base">Financial Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Paid-Up Capital</Label>
                    <p className="text-sm font-medium">NPR {selectedBusiness.paidUpCapital?.toLocaleString() || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Investment Range</Label>
                    <p className="text-sm font-medium">
                      NPR {selectedBusiness.investmentCapacityMin?.toLocaleString() || "N/A"} - {selectedBusiness.investmentCapacityMax?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                  {selectedBusiness.pricePerUnit && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Price Per Unit</Label>
                      <p className="text-sm font-medium">NPR {selectedBusiness.pricePerUnit?.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedBusiness.expectedReturnOptions && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Expected Return</Label>
                      <p className="text-sm font-medium">{selectedBusiness.expectedReturnOptions}</p>
                    </div>
                  )}
                  {selectedBusiness.estimatedMarketValuation && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Market Valuation</Label>
                      <p className="text-sm font-medium">NPR {selectedBusiness.estimatedMarketValuation?.toLocaleString()}</p>
                    </div>
                  )}
                  {selectedBusiness.ipoTimeHorizon && (
                    <div>
                      <Label className="text-xs text-muted-foreground">IPO Timeline</Label>
                      <p className="text-sm font-medium">{selectedBusiness.ipoTimeHorizon}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              {selectedBusiness.media && selectedBusiness.media.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-base">Uploaded Documents & Media</h4>
                  <div className="space-y-3">
                    {selectedBusiness.media.map((doc: BusinessMedia) => (
                      <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3 bg-secondary/30">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <Eye className="h-4 w-4 text-blue-600" />
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
                            View
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status & Metrics */}
              <div>
                <h4 className="font-semibold mb-3 text-base">Status & Metrics</h4>
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
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Business Sheet */}
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Business</SheetTitle>
            <SheetDescription>
              Make changes to business information
            </SheetDescription>
          </SheetHeader>
          {editingBusiness && (
            <div className="space-y-4 mt-6">
              <div>
                <Label>Business Name</Label>
                <Input
                  value={editingBusiness.name}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, name: e.target.value })}
                />
              </div>

              <div>
                <Label>Location</Label>
                <Input
                  value={editingBusiness.location}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, location: e.target.value })}
                />
              </div>

              <div>
                <Label>Team Size</Label>
                <Input
                  value={editingBusiness.teamSize}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, teamSize: e.target.value })}
                />
              </div>

              <div>
                <Label>Paid-Up Capital (NPR)</Label>
                <Input
                  type="number"
                  value={editingBusiness.paidUpCapital}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, paidUpCapital: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <Label>Investment Capacity Min (NPR)</Label>
                <Input
                  type="number"
                  value={editingBusiness.investmentCapacityMin}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, investmentCapacityMin: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <Label>Investment Capacity Max (NPR)</Label>
                <Input
                  type="number"
                  value={editingBusiness.investmentCapacityMax}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, investmentCapacityMax: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <Label>Brief Description</Label>
                <Textarea
                  value={editingBusiness.briefDescription}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, briefDescription: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label>Full Description</Label>
                <Textarea
                  value={editingBusiness.fullDescription || ''}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, fullDescription: e.target.value })}
                  rows={5}
                />
              </div>

              <div>
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  value={editingBusiness.contactEmail}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, contactEmail: e.target.value })}
                />
              </div>

              <div>
                <Label>Contact Phone</Label>
                <Input
                  value={editingBusiness.contactPhone}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, contactPhone: e.target.value })}
                />
              </div>

              <div>
                <Label>Website</Label>
                <Input
                  value={editingBusiness.website || ''}
                  onChange={(e) => setEditingBusiness({ ...editingBusiness, website: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-4">
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
                <Button variant="outline" onClick={() => setEditSheetOpen(false)} disabled={isSaving}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Inquiries Dialog */}
      <Dialog open={inquiriesDialogOpen} onOpenChange={setInquiriesDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
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
                  {inquiries.map((interest) => (
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
                          <TableCell key={`followup-${interest.id}-${i}`} className="min-w-[150px]">
                            {followUp ? (
                              <div className="text-sm" title={followUp.remarks}>
                                <p className="truncate max-w-[140px]">{followUp.remarks}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(followUp.createdAt).toLocaleDateString()}
                                </p>
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
    </AdminPanelDashboardLayout>
  );
}
