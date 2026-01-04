import { useEffect, useState } from "react";
import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Calendar, Mail, Phone, Loader2, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface OnboardingRequest {
  id: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  message: string | null;
  status: 'PENDING' | 'CONTACTED' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt: string | null;
}

interface OnboardingResponse {
  message: string;
  requests: OnboardingRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function OnboardingRequests() {
  const [requests, setRequests] = useState<OnboardingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await api.onboarding.getAll() as OnboardingResponse;

      setRequests(data.requests);
      setTotalCount(data.pagination.total);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
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
      case 'CONTACTED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
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
        <h2 className="text-3xl font-bold tracking-tight">Business Onboarding Requests</h2>
        <p className="text-muted-foreground">
          View all business onboarding requests from companies wanting to list on the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => r.status === 'PENDING').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => r.status === 'APPROVED').length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully onboarded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests.filter(r => {
                const diffHours = (new Date().getTime() - new Date(r.submittedAt).getTime()) / 3600000;
                return diffHours < 24;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
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
            <span className="ml-2 text-muted-foreground">Loading onboarding requests...</span>
          </CardContent>
        </Card>
      )}

      {/* Requests List */}
      {!isLoading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Requests</CardTitle>
            <CardDescription>
              All business onboarding requests from companies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No onboarding requests yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => {
                  const isRecent = (new Date().getTime() - new Date(request.submittedAt).getTime()) / 3600000 < 24;

                  return (
                    <div key={request.id} className="rounded-lg border p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-semibold text-lg">{request.businessName}</p>
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                            {isRecent && <Badge variant="secondary">New</Badge>}
                          </div>

                          <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 shrink-0" />
                              <span className="truncate">{request.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3 shrink-0" />
                              <span>{request.phoneNumber}</span>
                            </div>
                          </div>

                          {request.message && (
                            <div className="text-sm bg-secondary/50 rounded p-2 mb-2">
                              <p className="text-muted-foreground italic">"{request.message}"</p>
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(request.submittedAt)}
                          </p>
                        </div>
                      </div>
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
