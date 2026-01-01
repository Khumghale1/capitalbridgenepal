import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, CheckCircle, XCircle, Calendar, AlertTriangle } from "lucide-react";

export default function RemovalRequests() {
  const { toast } = useToast();

  const handleApprove = () => {
    toast({
      title: "Removal Approved",
      description: "The business profile has been removed from the platform.",
      variant: "destructive",
    });
  };

  const handleDeny = () => {
    toast({
      title: "Removal Denied",
      description: "The removal request has been denied and the business remains active.",
    });
  };

  return (
    <AdminPanelDashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Removal Requests</h2>
        <p className="text-muted-foreground">
          Review and process business profile removal requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Removals processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denied This Month</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Requests denied</p>
          </CardContent>
        </Card>
      </div>

      {/* Removal Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Removal Requests</CardTitle>
          <CardDescription>
            Businesses requesting to be removed from the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Request Item */}
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Local Handicrafts</h4>
                      <Badge variant="destructive">Urgent</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Manufacturing • Bhaktapur
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      Requested 5 hours ago
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                <p className="text-sm font-medium mb-1">Reason for Removal:</p>
                <p className="text-sm text-muted-foreground">
                  "We have decided to close our business operations and no longer need our profile
                  on the platform. We appreciate the service provided."
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="destructive" onClick={handleApprove}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Removal
                </Button>
                <Button size="sm" variant="outline" onClick={handleDeny}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Deny Request
                </Button>
              </div>
            </div>

            {/* Request Item */}
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Digital Services Pvt Ltd</h4>
                      <Badge>New</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Technology • Pokhara
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      Requested 1 day ago
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                <p className="text-sm font-medium mb-1">Reason for Removal:</p>
                <p className="text-sm text-muted-foreground">
                  "We have successfully secured funding and would like to remove our profile.
                  Thank you for the platform's support in connecting us with investors."
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="destructive" onClick={handleApprove}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Removal
                </Button>
                <Button size="sm" variant="outline" onClick={handleDeny}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Deny Request
                </Button>
              </div>
            </div>

            {/* Request Item */}
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">Mountain Trekking Adventures</h4>
                      <Badge>New</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tourism • Kathmandu
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      Requested 2 days ago
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                <p className="text-sm font-medium mb-1">Reason for Removal:</p>
                <p className="text-sm text-muted-foreground">
                  "Due to changes in our business model, we are no longer seeking external investment.
                  Please remove our profile from the platform."
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="destructive" onClick={handleApprove}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Removal
                </Button>
                <Button size="sm" variant="outline" onClick={handleDeny}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Deny Request
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processed Requests */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recently Processed</CardTitle>
          <CardDescription>
            Removal requests that have been approved or denied
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-4 opacity-60">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Eco Solutions Nepal</p>
                  <p className="text-sm text-muted-foreground">Approved 3 days ago</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-green-600">Approved</Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4 opacity-60">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Food Delivery Startup</p>
                  <p className="text-sm text-muted-foreground">Denied 5 days ago</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-red-500/10 text-red-600">Denied</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminPanelDashboardLayout>
  );
}
