import { useState, useEffect } from "react";
import { BusinessDashboardLayout } from "./BusinessDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User, Calendar, Loader2, Mail, Phone } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Interest {
  id: string;
  investorName: string;
  email: string;
  phoneNumber: string;
  remarks: string | null;
  submittedAt: string;
}


export default function InvestmentInquiries() {
  const { toast } = useToast();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.businessProfile.getOwnInterests();
      setInterests(response.interests || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load inquiries';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
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

  return (
    <BusinessDashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Investment Inquiries</h2>
        <p className="text-muted-foreground">
          Manage inquiries and messages from potential investors
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interests.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {interests.filter(i => {
                const diffHours = (new Date().getTime() - new Date(i.submittedAt).getTime()) / 3600000;
                return diffHours < 24;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {interests.filter(i => {
                const diffDays = (new Date().getTime() - new Date(i.submittedAt).getTime()) / 86400000;
                return diffDays < 7;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading inquiries...</span>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchInquiries} variant="outline" className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Inquiries List */}
      {!isLoading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>All Inquiries</CardTitle>
            <CardDescription>
              Investment inquiries from potential investors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {interests.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground font-medium">No inquiries yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Your profile is live and investors can submit inquiries
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {interests.map((interest) => {
                  const isRecent = (new Date().getTime() - new Date(interest.submittedAt).getTime()) / 3600000 < 24;

                  return (
                    <div key={interest.id} className="flex items-start justify-between rounded-lg border p-4">
                      <div className="flex gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{interest.investorName}</h4>
                            {isRecent && <Badge>New</Badge>}
                          </div>

                          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 shrink-0" />
                              <span className="truncate">{interest.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 shrink-0" />
                              <span>{interest.phoneNumber}</span>
                            </div>
                          </div>

                          {interest.remarks && (
                            <div className="mt-2 bg-secondary/50 rounded p-2">
                              <p className="text-sm text-muted-foreground italic">"{interest.remarks}"</p>
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                            <Calendar className="h-3 w-3" />
                            {formatDate(interest.submittedAt)}
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
    </BusinessDashboardLayout>
  );
}
