import { useEffect, useState } from "react";
import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Send, Calendar, Phone, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  onboardingToken: string | null;
  tokenExpiresAt: string | null;
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

export default function BusinessInquiries() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<OnboardingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [generatingToken, setGeneratingToken] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleGenerateLink = async (requestId: string) => {
    try {
      setGeneratingToken(requestId);
      setGeneratedUrl(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.onboarding.approve(requestId);

      const token = response.request.onboardingToken;
      const registrationUrl = `${window.location.origin}/register?token=${token}`;

      setGeneratedUrl(registrationUrl);

      // Refresh the list to update status
      await fetchRequests();

      toast({
        title: "Registration Link Generated!",
        description: "Copy the link and send it to the business.",
      });
    } catch (error) {
      toast({
        title: "Failed to Generate Link",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setGeneratingToken(null);
    }
  };

  const handleCopyLink = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      toast({
        title: "Link Copied!",
        description: "Registration link copied to clipboard.",
      });
    }
  };

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
        <h2 className="text-3xl font-bold tracking-tight">Business Inquiries</h2>
        <p className="text-muted-foreground">
          Manage new business leads and send registration links
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
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
            <span className="ml-2 text-muted-foreground">Loading business inquiries...</span>
          </CardContent>
        </Card>
      )}

      {/* Inquiries List */}
      {!isLoading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Business Onboarding Requests</CardTitle>
            <CardDescription>
              All business inquiries from companies wanting to list on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No business inquiries yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => {
                  const isRecent = (new Date().getTime() - new Date(request.submittedAt).getTime()) / 3600000 < 24;

                  return (
                    <div key={request.id} className="flex items-start justify-between rounded-lg border p-4">
                      <div className="flex gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{request.businessName}</h4>
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {request.status}
                            </Badge>
                            {isRecent && <Badge variant="secondary">New</Badge>}
                          </div>

                          <p className="text-sm text-muted-foreground">
                            <Mail className="inline h-3 w-3 mr-1" />
                            {request.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <Phone className="inline h-3 w-3 mr-1" />
                            {request.phoneNumber}
                          </p>

                          {request.message && (
                            <p className="text-sm text-muted-foreground italic">
                              "{request.message}"
                            </p>
                          )}

                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(request.submittedAt)}
                          </p>

                          {/* Show registration link for approved requests */}
                          {request.status === 'APPROVED' && request.onboardingToken && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <Label className="text-xs font-medium text-green-800 mb-1 block">
                                Registration Link (Valid for 72 hours)
                              </Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  value={`${window.location.origin}/register?token=${request.onboardingToken}`}
                                  readOnly
                                  className="font-mono text-xs h-8 bg-white"
                                />
                                <Button
                                  onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/register?token=${request.onboardingToken}`);
                                    toast({
                                      title: "Link Copied!",
                                      description: "Registration link copied to clipboard.",
                                    });
                                  }}
                                  size="sm"
                                  className="h-8"
                                >
                                  Copy
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Dialog onOpenChange={() => setGeneratedUrl(null)}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            disabled={request.status === 'APPROVED' || generatingToken === request.id}
                          >
                            {generatingToken === request.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Mail className="mr-2 h-4 w-4" />
                                {request.status === 'APPROVED' ? 'Link Generated' : 'Generate Link'}
                              </>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Generate Registration Link</DialogTitle>
                            <DialogDescription>
                              Generate a unique registration link for {request.businessName}
                            </DialogDescription>
                          </DialogHeader>
                          {!generatedUrl ? (
                            <div className="space-y-4 py-4">
                              <p className="text-sm text-muted-foreground">
                                Click the button below to generate a unique registration link.
                                This link will be valid for 72 hours.
                              </p>
                              <Button
                                onClick={() => handleGenerateLink(request.id)}
                                disabled={generatingToken === request.id}
                                className="w-full"
                              >
                                {generatingToken === request.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating Link...
                                  </>
                                ) : (
                                  <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Generate Registration Link
                                  </>
                                )}
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4 py-4">
                              <div className="rounded-lg bg-secondary p-4">
                                <Label className="text-sm font-medium mb-2 block">Registration Link (Valid for 72 hours)</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    value={generatedUrl}
                                    readOnly
                                    className="font-mono text-sm"
                                  />
                                  <Button onClick={handleCopyLink} size="sm">
                                    Copy
                                  </Button>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Copy this link and send it to <strong>{request.email}</strong>
                              </p>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
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
