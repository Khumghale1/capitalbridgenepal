import { useState, useEffect } from "react";
import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Building2, CheckCircle, XCircle, Eye, Calendar, Loader2, AlertCircle, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function PendingApprovals() {
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);

  // View Details Dialog
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

  useEffect(() => {
    fetchPendingBusinesses();
  }, []);

  const fetchPendingBusinesses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await api.businesses.getPending();
      setBusinesses(data.businesses || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load pending businesses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setIsApproving(id);
      await api.businesses.approve(id);

      toast({
        title: "Business Approved!",
        description: "The business has been approved and can now log in.",
      });

      // Refresh the list
      await fetchPendingBusinesses();
    } catch (error) {
      toast({
        title: "Approval Failed",
        description: error instanceof Error ? error.message : "Failed to approve business",
        variant: "destructive",
      });
    } finally {
      setIsApproving(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this application",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRejecting(id);
      await api.businesses.reject(id, rejectReason);

      toast({
        title: "Business Rejected",
        description: "The business has been rejected. Please call them to inform.",
      });

      setRejectReason("");

      // Refresh the list
      await fetchPendingBusinesses();
    } catch (error) {
      toast({
        title: "Rejection Failed",
        description: error instanceof Error ? error.message : "Failed to reject business",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(null);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AdminPanelDashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Business Management</h2>
        <p className="text-muted-foreground">
          View all businesses and manage approvals - All data is kept for future reference
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.filter(b => b.status === 'PENDING').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting decision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.filter(b => b.status === 'APPROVED').length}
            </div>
            <p className="text-xs text-muted-foreground">Can access platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.filter(b => b.status === 'REJECTED').length}
            </div>
            <p className="text-xs text-muted-foreground">Applications denied</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading pending businesses...</span>
          </CardContent>
        </Card>
      )}

      {/* All Businesses */}
      {!isLoading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>All Businesses</CardTitle>
            <CardDescription>
              Complete history of all business registrations - pending, approved, and rejected
            </CardDescription>
          </CardHeader>
          <CardContent>
            {businesses.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No businesses registered yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {businesses.map((business) => {
                  const isRecent = (new Date().getTime() - new Date(business.createdAt).getTime()) / 3600000 < 24;

                  return (
                    <div key={business.id} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-4 flex-1">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {business.logoUrl ? (
                              <img src={business.logoUrl} alt={business.name} className="h-10 w-10 object-contain" />
                            ) : (
                              <Building2 className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold">{business.name}</h4>
                              <Badge variant="outline" className={getStatusColor(business.status)}>
                                {business.status}
                              </Badge>
                              {isRecent && <Badge variant="secondary">New</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {business.category.name} • {business.location}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Submitted {formatDate(business.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 mb-3">
                        <p className="text-sm line-clamp-2">{business.briefDescription}</p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(business)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleApprove(business.id)}
                          disabled={isApproving === business.id || business.status === 'APPROVED'}
                        >
                          {isApproving === business.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              {business.status === 'APPROVED' ? 'Already Approved' : 'Approve'}
                            </>
                          )}
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={isRejecting === business.id || business.status === 'REJECTED'}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              {business.status === 'REJECTED' ? 'Already Rejected' : 'Reject'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Business Application</DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting {business.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="reason">Rejection Reason *</Label>
                                <Textarea
                                  id="reason"
                                  placeholder="Explain why this business is being rejected..."
                                  rows={4}
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                onClick={() => handleReject(business.id)}
                                disabled={isRejecting === business.id || !rejectReason.trim()}
                              >
                                {isRejecting === business.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Rejecting...
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Confirm Rejection
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                    <Label className="text-xs text-muted-foreground">Application Status</Label>
                    <div className="mt-1">
                      <Badge variant="outline" className={getStatusColor(selectedBusiness.status)}>
                        {selectedBusiness.status}
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

              {/* Documents */}
              {selectedBusiness.media && selectedBusiness.media.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-base">Uploaded Documents & Media</h4>
                  <div className="space-y-3">
                    {selectedBusiness.media.map((doc: any) => (
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

              {/* Rejection Reason (if applicable) */}
              {selectedBusiness.status === 'REJECTED' && selectedBusiness.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 text-red-800 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Rejection Reason
                  </h4>
                  <p className="text-sm text-red-700">{selectedBusiness.rejectionReason}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPanelDashboardLayout>
  );
}
