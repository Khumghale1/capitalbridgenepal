import { BusinessDashboardLayout } from "./BusinessDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Image, Video, File, Trash2 } from "lucide-react";

export default function Materials() {
  return (
    <BusinessDashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Materials & Media</h2>
          <p className="text-muted-foreground">
            Upload and manage your business documents, images, and videos
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      {/* Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Upload</CardTitle>
          <CardDescription>
            Drag and drop files or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-2">Drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, JPG, PNG, MP4 (Max 10MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Business Documents</CardTitle>
          <CardDescription>
            Financial statements, business plans, and other documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Business Plan 2024.pdf</p>
                  <p className="text-sm text-muted-foreground">2.4 MB • Uploaded 2 days ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View</Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Financial Statement 2023.pdf</p>
                  <p className="text-sm text-muted-foreground">1.8 MB • Uploaded 1 week ago</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View</Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Business Images</CardTitle>
          <CardDescription>
            Photos of your business, products, and team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative group">
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center border">
                <Image className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary">View</Button>
                <Button size="sm" variant="secondary">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Badge className="absolute top-2 right-2">Office</Badge>
            </div>

            <div className="relative group">
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center border">
                <Image className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary">View</Button>
                <Button size="sm" variant="secondary">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Badge className="absolute top-2 right-2">Team</Badge>
            </div>

            <div className="relative group">
              <div className="aspect-square rounded-lg bg-muted flex items-center justify-center border">
                <Image className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary">View</Button>
                <Button size="sm" variant="secondary">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Badge className="absolute top-2 right-2">Product</Badge>
            </div>

            <div className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Add Image</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Videos */}
      <Card>
        <CardHeader>
          <CardTitle>Business Videos</CardTitle>
          <CardDescription>
            Video presentations and pitches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Video className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Business Pitch Video.mp4</p>
                  <p className="text-sm text-muted-foreground">15.2 MB • 3:45 duration</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View</Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Video className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Product Demo.mp4</p>
                  <p className="text-sm text-muted-foreground">8.7 MB • 2:10 duration</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View</Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </BusinessDashboardLayout>
  );
}
