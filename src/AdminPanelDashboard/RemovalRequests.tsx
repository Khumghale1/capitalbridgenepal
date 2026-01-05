import { useEffect, useState } from "react";
import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Building2, Calendar, Loader2, AlertCircle, CheckCircle, XCircle, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";

interface RemovalRequest {
  id: string;
  businessId: string;
  business: {
    name: string;
    contactEmail: string;
    contactPhone: string;
    isActive: boolean;
  };
  reason: string | null;
  status: string;
  requestedAt: string;
  reviewedAt: string | null;
}

interface RemovalRequestsResponse {
  requests: RemovalRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function RemovalRequests() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<RemovalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await api.businesses.getRemovalRequests() as RemovalRequestsResponse;

      setRequests(data.requests);
      setTotalCount(data.pagination.total);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: string, businessId: string) => {
    try {
      setProcessingId(requestId);

      await api.businesses.approveRemovalRequest(requestId);

      toast({
        title: "Request Approved",
        description: "The business profile has been deactivated successfully.",
      });

      await fetchRequests();
    } catch (error) {
      toast({
        title: "Failed to Approve",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setProcessingId(requestId);

      await api.businesses.rejectRemovalRequest(requestId);

      toast({
        title: "Request Rejected",
        description: "The removal request has been rejected.",
      });

      await fetchRequests();
    } catch (error) {
      toast({
        title: "Failed to Reject",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
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

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const reviewedRequests = requests.filter(r => r.status !== 'PENDING');

  return (
    <AdminPanelDashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Removal Requests</h2>
        <p className="text-muted-foreground">
          Manage business profile removal requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewedRequests.length}</div>
            <p className="text-xs text-muted-foreground">Processed</p>
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
            <span className="ml-2 text-muted-foreground">Loading removal requests...</span>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      {!isLoading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Business Removal Requests</CardTitle>
            <CardDescription>
              Review and process business profile removal requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No removal requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => {
                  const isRecent = (new Date().getTime() - new Date(request.requestedAt).getTime()) / 3600000 < 24;

                  return (
                    <div key={request.id} className="flex items-start justify-between rounded-lg border p-4">
                      <div className="flex gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                          <Trash2 className="h-6 w-6 text-destructive" />
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{request.business.name}</h4>
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                            {isRecent && <Badge variant="secondary">New</Badge>}
                            {!request.business.isActive && (
                              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                Deactivated
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground">
                            <Building2 className="inline h-3 w-3 mr-1" />
                            {request.business.contactEmail} • {request.business.contactPhone}
                          </p>

                          {request.reason && (
                            <p className="text-sm text-muted-foreground italic mt-2">
                              <strong>Reason:</strong> "{request.reason}"
                            </p>
                          )}

                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            Requested {formatDate(request.requestedAt)}
                            {request.reviewedAt && (
                              <> • Reviewed {formatDate(request.reviewedAt)}</>
                            )}
                          </p>
                        </div>
                      </div>

                      {request.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={processingId === request.id}
                              >
                                {processingId === request.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                  </>
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Approve Removal Request?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will deactivate {request.business.name}'s profile. The business
                                  will no longer be visible to investors and won't receive new inquiries.
                                  You can reactivate the profile later if needed.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleApprove(request.id, request.businessId)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Approve & Deactivate
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={processingId === request.id}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reject Removal Request?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will reject the removal request for {request.business.name}.
                                  The business profile will remain active and visible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleReject(request.id)}
                                >
                                  Reject Request
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </AdminPanelDashboardLayout>
  );
}
