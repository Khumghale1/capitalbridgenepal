import { useState } from "react";
import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, CheckCircle, XCircle, Eye, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PendingApprovals() {
  const { toast } = useToast();
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    toast({
      title: "Business Approved!",
      description: "The business has been approved and is now live on the platform.",
    });
  };

  const handleReject = () => {
    toast({
      title: "Business Rejected",
      description: "The business owner has been notified of the rejection.",
      variant: "destructive",
    });
  };

  return (
    <AdminPanelDashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Pending Approvals</h2>
        <p className="text-muted-foreground">
          Review and approve or reject business applications
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved This Week</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected This Week</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Incomplete info</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Businesses */}
      <Card>
        <CardHeader>
          <CardTitle>Businesses Awaiting Approval</CardTitle>
          <CardDescription>
            Review business details and approve or reject applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Business Item */}
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">Tech Innovations Nepal</h4>
                      <Badge>New</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Technology • Kathmandu
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Submitted 2 hours ago
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                <p className="text-sm">
                  A technology startup focused on developing innovative software solutions for
                  Nepal's growing digital economy. Seeking NPR 5,000,000 for expansion...
                </p>
              </div>

              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Business Details</DialogTitle>
                      <DialogDescription>
                        Complete information about Tech Innovations Nepal
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      <div>
                        <h4 className="font-semibold mb-2">Business Information</h4>
                        <p className="text-sm text-muted-foreground">Name: Tech Innovations Nepal</p>
                        <p className="text-sm text-muted-foreground">Sector: Technology</p>
                        <p className="text-sm text-muted-foreground">Location: Kathmandu</p>
                        <p className="text-sm text-muted-foreground">Founded: 2020</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Contact Details</h4>
                        <p className="text-sm text-muted-foreground">Email: info@techinnovations.com</p>
                        <p className="text-sm text-muted-foreground">Phone: +977 98XXXXXXXX</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Investment Details</h4>
                        <p className="text-sm text-muted-foreground">Seeking: NPR 5,000,000</p>
                        <p className="text-sm text-muted-foreground">Minimum Investment: NPR 100,000</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button size="sm" onClick={handleApprove}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Business Application</DialogTitle>
                      <DialogDescription>
                        Please provide a reason for rejecting this application
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="reason">Rejection Reason</Label>
                        <Textarea
                          id="reason"
                          placeholder="Explain why this business is being rejected..."
                          rows={4}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="destructive" onClick={handleReject}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Confirm Rejection
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Business Item */}
            <div className="rounded-lg border p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">Organic Farms Co.</h4>
                      <Badge>New</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Agriculture • Chitwan
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Submitted 5 hours ago
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 mb-3">
                <p className="text-sm">
                  Organic farming business producing high-quality vegetables and fruits.
                  Looking for NPR 2,000,000 to expand operations and improve infrastructure...
                </p>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
                <Button size="sm" onClick={handleApprove}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button size="sm" variant="destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminPanelDashboardLayout>
  );
}
