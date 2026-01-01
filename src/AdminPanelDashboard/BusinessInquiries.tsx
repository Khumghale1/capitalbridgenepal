import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Send, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BusinessInquiries() {
  const { toast } = useToast();

  const handleSendLink = () => {
    toast({
      title: "Registration Link Sent!",
      description: "The business registration link has been sent successfully.",
    });
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
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+8 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Links Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">71% conversion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Contact</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      {/* Inquiries List */}
      <Card>
        <CardHeader>
          <CardTitle>New Business Leads</CardTitle>
          <CardDescription>
            Contact information from potential businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Inquiry Item */}
            <div className="flex items-start justify-between rounded-lg border p-4">
              <div className="flex gap-4 flex-1">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">Tech Innovations Nepal</h4>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Contact: Rajesh Kumar • rajesh@techinnovations.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sector: Technology • Phone: +977 98XXXXXXXX
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Submitted 2 hours ago
                  </p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Registration Link</DialogTitle>
                    <DialogDescription>
                      Send the business registration link to Tech Innovations Nepal
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="rajesh@techinnovations.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Custom Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Add a personal message..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSendLink}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Link
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Inquiry Item */}
            <div className="flex items-start justify-between rounded-lg border p-4">
              <div className="flex gap-4 flex-1">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">Organic Farms Co.</h4>
                    <Badge>New</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Contact: Sita Sharma • sita@organicfarms.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sector: Agriculture • Phone: +977 98XXXXXXXX
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Submitted 5 hours ago
                  </p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Link
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Send Registration Link</DialogTitle>
                    <DialogDescription>
                      Send the business registration link to Organic Farms Co.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="sita@organicfarms.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Custom Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Add a personal message..."
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSendLink}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Link
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Inquiry Item - Contacted */}
            <div className="flex items-start justify-between rounded-lg border p-4 opacity-60">
              <div className="flex gap-4 flex-1">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">Himalayan Textiles</h4>
                    <Badge variant="outline">Link Sent</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Contact: Ram Thapa • ram@himalayantextiles.com
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sector: Manufacturing • Phone: +977 98XXXXXXXX
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Link sent 1 day ago
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" disabled>
                Link Sent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminPanelDashboardLayout>
  );
}
