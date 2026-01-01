import { useState } from "react";
import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, UserX, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminUsers() {
  const { toast } = useToast();
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");

  const handleAddAdmin = () => {
    toast({
      title: "Admin Added!",
      description: "The new admin user has been created successfully.",
    });
    setNewAdminEmail("");
    setNewAdminName("");
  };

  const handleRemoveAdmin = () => {
    toast({
      title: "Admin Removed",
      description: "The admin user has been removed from the platform.",
      variant: "destructive",
    });
  };

  return (
    <AdminPanelDashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Users</h2>
          <p className="text-muted-foreground">
            Manage administrator accounts and permissions
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin User</DialogTitle>
              <DialogDescription>
                Create a new administrator account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminName">Full Name</Label>
                <Input
                  id="adminName"
                  placeholder="John Doe"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email Address</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@aarthiq.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddAdmin}>
                <Plus className="mr-2 h-4 w-4" />
                Create Admin
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Active administrators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Full access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recently Added</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Administrator Accounts</CardTitle>
          <CardDescription>
            Manage admin users and their access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Admin User */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">Admin User</p>
                    <Badge className="bg-purple-500">Super Admin</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">admin@aarthiq.com</p>
                  <p className="text-xs text-muted-foreground mt-1">Full platform access • Added 1 year ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Current User
                </Button>
              </div>
            </div>

            {/* Admin User */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">John Doe</p>
                    <Badge className="bg-purple-500">Super Admin</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">john@aarthiq.com</p>
                  <p className="text-xs text-muted-foreground mt-1">Full platform access • Added 8 months ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRemoveAdmin}>
                  <UserX className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>

            {/* Admin User */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">Jane Smith</p>
                    <Badge>Admin</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">jane@aarthiq.com</p>
                  <p className="text-xs text-muted-foreground mt-1">Standard access • Added 3 months ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRemoveAdmin}>
                  <UserX className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>

            {/* Admin User */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">Rajesh Kumar</p>
                    <Badge>Admin</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">rajesh@aarthiq.com</p>
                  <p className="text-xs text-muted-foreground mt-1">Standard access • Added 1 month ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRemoveAdmin}>
                  <UserX className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>

            {/* Admin User */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold">Sita Thapa</p>
                    <Badge>Admin</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">sita@aarthiq.com</p>
                  <p className="text-xs text-muted-foreground mt-1">Standard access • Added 2 weeks ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRemoveAdmin}>
                  <UserX className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminPanelDashboardLayout>
  );
}
