import { useState, useEffect, useRef } from "react";
import { BusinessDashboardLayout } from "./BusinessDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Image, Video, Trash2, Loader2, Plus, Link, Youtube, ExternalLink, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import type { BusinessMedia, MediaType } from "@/types/media";
import { MEDIA_TYPE_LABELS, ACCEPTED_FILE_TYPES, formatFileSize } from "@/types/media";

const GALLERY_LIMIT = 6;

export default function Materials() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [media, setMedia] = useState<BusinessMedia[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});

  // External URL dialog state
  const [externalUrlDialogOpen, setExternalUrlDialogOpen] = useState(false);
  const [externalUrlType, setExternalUrlType] = useState<'YOUTUBE_VIDEO' | 'WEBSITE'>('YOUTUBE_VIDEO');
  const [externalUrl, setExternalUrl] = useState('');
  const [externalUrlTitle, setExternalUrlTitle] = useState('');
  const [isAddingUrl, setIsAddingUrl] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBusinessAndMedia();
  }, []);

  const fetchBusinessAndMedia = async () => {
    try {
      setIsLoading(true);
      // First get the business profile to get the ID
      const profileResponse = await api.businessProfile.getOwnProfile() as { business?: { id: string } };
      const business = profileResponse.business || profileResponse as { id?: string };

      if (business?.id) {
        setBusinessId(business.id);
        // Then fetch media
        const mediaResponse = await api.upload.getMedia(business.id);
        setMedia(Array.isArray(mediaResponse.media) ? mediaResponse.media : []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description: "Failed to load media",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter media by type
  const documents = media.filter(m => ['REGISTRATION_CERTIFICATE', 'PAN_CERTIFICATE', 'FINANCIAL_DOCUMENT', 'PITCH_DECK', 'BROCHURE', 'DOCUMENT'].includes(m.mediaType));
  const galleryImages = media.filter(m => m.mediaType === 'GALLERY');
  const videos = media.filter(m => m.mediaType === 'VIDEO');
  const youtubeVideos = media.filter(m => m.mediaType === 'YOUTUBE_VIDEO');
  const websiteLinks = media.filter(m => m.mediaType === 'WEBSITE');

  // Handle file upload
  const handleFileUpload = async (mediaType: MediaType, files: FileList | null, uploadKey: string) => {
    if (!files || files.length === 0 || !businessId) return;

    // Check gallery limit
    if (mediaType === 'GALLERY' && galleryImages.length + files.length > GALLERY_LIMIT) {
      toast({
        title: "Gallery Limit",
        description: `You can only upload up to ${GALLERY_LIMIT} gallery images. You have ${galleryImages.length} already.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(prev => ({ ...prev, [uploadKey]: true }));

    for (const file of Array.from(files)) {
      try {
        setUploadProgress(prev => ({ ...prev, [uploadKey]: 0 }));

        await api.upload.uploadMedia(businessId, mediaType, file, {
          onProgress: (progress) => {
            setUploadProgress(prev => ({ ...prev, [uploadKey]: progress }));
          }
        });

        toast({
          title: "Upload Successful",
          description: `${file.name} uploaded successfully.`,
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: error instanceof Error ? error.message : "Failed to upload file",
          variant: "destructive",
        });
      }
    }

    setIsUploading(prev => ({ ...prev, [uploadKey]: false }));
    setUploadProgress(prev => ({ ...prev, [uploadKey]: 0 }));

    // Refresh media list
    const mediaResponse = await api.upload.getMedia(businessId);
    setMedia(Array.isArray(mediaResponse.media) ? mediaResponse.media : []);
  };

  // Handle delete
  const handleDelete = async (mediaId: string) => {
    try {
      await api.upload.deleteMedia(mediaId);
      toast({
        title: "Deleted",
        description: "Media deleted successfully.",
      });

      // Refresh media list
      if (businessId) {
        const mediaResponse = await api.upload.getMedia(businessId);
        setMedia(Array.isArray(mediaResponse.media) ? mediaResponse.media : []);
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete",
        variant: "destructive",
      });
    }
  };

  // Handle external URL addition
  const handleAddExternalUrl = async () => {
    if (!businessId || !externalUrl) return;

    setIsAddingUrl(true);
    try {
      await api.upload.addExternalUrl(businessId, externalUrlType, externalUrl, {
        title: externalUrlTitle || undefined,
      });

      toast({
        title: "Added",
        description: `${externalUrlType === 'YOUTUBE_VIDEO' ? 'YouTube video' : 'Website link'} added successfully.`,
      });

      setExternalUrlDialogOpen(false);
      setExternalUrl('');
      setExternalUrlTitle('');

      // Refresh media list
      const mediaResponse = await api.upload.getMedia(businessId);
      setMedia(Array.isArray(mediaResponse.media) ? mediaResponse.media : []);
    } catch (error) {
      toast({
        title: "Failed",
        description: error instanceof Error ? error.message : "Failed to add URL",
        variant: "destructive",
      });
    } finally {
      setIsAddingUrl(false);
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent, mediaType: MediaType, uploadKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload(mediaType, e.dataTransfer.files, uploadKey);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (isLoading) {
    return (
      <BusinessDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </BusinessDashboardLayout>
    );
  }

  return (
    <BusinessDashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Materials & Media</h2>
          <p className="text-muted-foreground">
            Upload and manage your business documents, images, and videos
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={externalUrlDialogOpen} onOpenChange={setExternalUrlDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Link className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add External Link</DialogTitle>
                <DialogDescription>
                  Add a YouTube video or website link to your profile
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex gap-2">
                  <Button
                    variant={externalUrlType === 'YOUTUBE_VIDEO' ? 'default' : 'outline'}
                    onClick={() => setExternalUrlType('YOUTUBE_VIDEO')}
                  >
                    <Youtube className="mr-2 h-4 w-4" />
                    YouTube
                  </Button>
                  <Button
                    variant={externalUrlType === 'WEBSITE' ? 'default' : 'outline'}
                    onClick={() => setExternalUrlType('WEBSITE')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Website
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    placeholder={externalUrlType === 'YOUTUBE_VIDEO' ? 'https://youtube.com/watch?v=...' : 'https://example.com'}
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title (optional)</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for this link"
                    value={externalUrlTitle}
                    onChange={(e) => setExternalUrlTitle(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setExternalUrlDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddExternalUrl} disabled={!externalUrl || isAddingUrl}>
                  {isAddingUrl ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Add Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Upload</CardTitle>
          <CardDescription>
            Drag and drop files or click to browse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={ACCEPTED_FILE_TYPES.DOCUMENT}
            multiple
            onChange={(e) => {
              handleFileUpload('DOCUMENT', e.target.files, 'quickUpload');
              e.target.value = '';
            }}
          />
          <div
            className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDrop={(e) => handleDrop(e, 'DOCUMENT', 'quickUpload')}
            onDragOver={handleDragOver}
          >
            {isUploading['quickUpload'] ? (
              <div className="space-y-4">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                <p className="text-sm font-medium">Uploading... {uploadProgress['quickUpload']}%</p>
                <Progress value={uploadProgress['quickUpload']} className="w-48 mx-auto" />
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-2">Drop files here or click to upload</p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Business Documents</CardTitle>
          <CardDescription>
            Financial statements, certificates, pitch deck, and other documents ({documents.length} files)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Upload documents from the Profile page or drag files above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.fileName || doc.title || MEDIA_TYPE_LABELS[doc.mediaType]}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.fileSize ? formatFileSize(doc.fileSize) : ''} • {MEDIA_TYPE_LABELS[doc.mediaType]}
                        {doc.uploadedAt && ` • ${new Date(doc.uploadedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {doc.fileUrl && (
                      <Button variant="outline" size="sm" onClick={() => window.open(doc.fileUrl, '_blank')}>
                        View
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(doc.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gallery Images */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Business Gallery</CardTitle>
          <CardDescription>
            Photos of your business, products, and team ({galleryImages.length}/{GALLERY_LIMIT} images)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            ref={galleryInputRef}
            type="file"
            className="hidden"
            accept={ACCEPTED_FILE_TYPES.GALLERY}
            multiple
            onChange={(e) => {
              handleFileUpload('GALLERY', e.target.files, 'gallery');
              e.target.value = '';
            }}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img) => (
              <div key={img.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                  {img.fileUrl ? (
                    <img
                      src={img.fileUrl}
                      alt={img.title || 'Gallery image'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {img.fileUrl && (
                    <Button size="sm" variant="secondary" onClick={() => window.open(img.fileUrl, '_blank')}>
                      View
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => handleDelete(img.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Add image button */}
            {galleryImages.length < GALLERY_LIMIT && (
              <div
                className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => galleryInputRef.current?.click()}
                onDrop={(e) => handleDrop(e, 'GALLERY', 'gallery')}
                onDragOver={handleDragOver}
              >
                {isUploading['gallery'] ? (
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">{uploadProgress['gallery']}%</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Add Image</p>
                  </div>
                )}
              </div>
            )}

            {/* Show remaining slots */}
            {galleryImages.length >= GALLERY_LIMIT && (
              <div className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Limit reached</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Videos */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Business Videos</CardTitle>
            <CardDescription>
              Video presentations and pitches ({videos.length} uploaded, {youtubeVideos.length} YouTube links)
            </CardDescription>
          </div>
          <input
            ref={videoInputRef}
            type="file"
            className="hidden"
            accept={ACCEPTED_FILE_TYPES.VIDEO}
            onChange={(e) => {
              handleFileUpload('VIDEO', e.target.files, 'video');
              e.target.value = '';
            }}
          />
          <Button variant="outline" size="sm" onClick={() => videoInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Video
          </Button>
        </CardHeader>
        <CardContent>
          {isUploading['video'] && (
            <div className="mb-4 p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Loader2 className="h-5 w-5 animate-spin" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Uploading video...</p>
                  <Progress value={uploadProgress['video']} className="mt-2" />
                </div>
                <span className="text-sm text-muted-foreground">{uploadProgress['video']}%</span>
              </div>
            </div>
          )}

          {videos.length === 0 && youtubeVideos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No videos uploaded yet</p>
              <p className="text-sm">Upload a video file or add a YouTube link</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Uploaded videos */}
              {videos.map((video) => (
                <div key={video.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Video className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{video.fileName || video.title || 'Uploaded Video'}</p>
                      <p className="text-sm text-muted-foreground">
                        {video.fileSize ? formatFileSize(video.fileSize) : ''}
                        {video.uploadedAt && ` • ${new Date(video.uploadedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {video.fileUrl && (
                      <Button variant="outline" size="sm" onClick={() => window.open(video.fileUrl, '_blank')}>
                        View
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(video.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* YouTube videos */}
              {youtubeVideos.map((video) => (
                <div key={video.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Youtube className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{video.title || 'YouTube Video'}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                        {video.externalUrl}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(video.externalUrl, '_blank')}>
                      Open
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(video.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Website Links */}
      {websiteLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Website Links</CardTitle>
            <CardDescription>
              External links related to your business ({websiteLinks.length} links)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {websiteLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{link.title || 'Website Link'}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                        {link.externalUrl}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(link.externalUrl, '_blank')}>
                      Open
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(link.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </BusinessDashboardLayout>
  );
}
