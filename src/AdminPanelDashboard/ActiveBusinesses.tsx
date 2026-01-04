import { useEffect, useState } from "react";
import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Edit, Ban, Search, Eye, Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { api } from "@/lib/api";

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

  useEffect(() => {
    fetchBusinesses();
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
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
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
    </AdminPanelDashboardLayout>
  );
}
