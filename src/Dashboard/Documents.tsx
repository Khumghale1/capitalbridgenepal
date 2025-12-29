import { DashboardLayout } from "./DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Search,
  Upload,
  File,
  Calendar,
  Eye,
  Folder,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Documents() {
  const documents = [
    {
      id: 1,
      name: "Investment Agreement - Tech Startup Nepal",
      type: "Agreement",
      category: "Legal",
      size: "2.4 MB",
      date: "2024-12-15",
      status: "Signed",
    },
    {
      id: 2,
      name: "Q4 2024 Financial Report",
      type: "Report",
      category: "Financial",
      size: "1.8 MB",
      date: "2024-12-20",
      status: "New",
    },
    {
      id: 3,
      name: "Tax Documents 2024",
      type: "Tax",
      category: "Tax",
      size: "856 KB",
      date: "2024-12-10",
      status: "Reviewed",
    },
    {
      id: 4,
      name: "Investment Certificate - Coffee Export",
      type: "Certificate",
      category: "Legal",
      size: "324 KB",
      date: "2024-11-20",
      status: "Signed",
    },
    {
      id: 5,
      name: "Business Plan - Organic Farming",
      type: "Business Plan",
      category: "Business",
      size: "5.2 MB",
      date: "2024-10-10",
      status: "Reviewed",
    },
    {
      id: 6,
      name: "Return Statement - Q3 2024",
      type: "Statement",
      category: "Financial",
      size: "412 KB",
      date: "2024-09-30",
      status: "Reviewed",
    },
  ];

  const folders = [
    { name: "Legal Documents", count: 8, icon: Folder },
    { name: "Financial Reports", count: 12, icon: Folder },
    { name: "Tax Documents", count: 5, icon: Folder },
    { name: "Certificates", count: 6, icon: Folder },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "default";
      case "Signed":
        return "secondary";
      case "Reviewed":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
            <p className="text-muted-foreground">
              Access and manage your investment documents
            </p>
          </div>
          <Button variant="hero">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search documents..."
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="tax">Tax</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="recent">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="size">File Size</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Folders Section */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Organized document folders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {folders.map((folder) => (
                <div
                  key={folder.name}
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <folder.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{folder.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {folder.count} files
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
            <CardDescription>View and manage your documents</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="signed">Signed</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-3 mt-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{doc.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="recent">
                <div className="text-center py-8 text-muted-foreground">
                  Recent documents will appear here
                </div>
              </TabsContent>
              <TabsContent value="signed">
                <div className="text-center py-8 text-muted-foreground">
                  Signed documents will appear here
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Storage Info */}
        <Card>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
            <CardDescription>Document storage usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Used Storage</span>
                <span className="text-sm text-muted-foreground">12.4 GB of 50 GB</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: "24.8%" }}
                />
              </div>
              <div className="grid grid-cols-4 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-xs text-muted-foreground">Legal</span>
                  </div>
                  <p className="text-sm font-medium">4.2 GB</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">Financial</span>
                  </div>
                  <p className="text-sm font-medium">5.8 GB</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <span className="text-xs text-muted-foreground">Tax</span>
                  </div>
                  <p className="text-sm font-medium">1.2 GB</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                    <span className="text-xs text-muted-foreground">Other</span>
                  </div>
                  <p className="text-sm font-medium">1.2 GB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
