import { useState, useEffect } from "react";
import { BusinessDashboardLayout } from "./BusinessDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Loader2, Download, Check, X, Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface FollowUp {
  id: string;
  followUpNumber: number;
  remarks: string;
  createdAt: string;
}

interface Interest {
  id: string;
  investorName: string;
  email: string;
  phoneNumber: string;
  message: string | null;
  submittedAt: string;
  contacted: boolean;
  followUpRemarks: string | null;
  followUps: FollowUp[];
}


export default function InvestmentInquiries() {
  const { toast } = useToast();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Add follow-up dialog
  const [addFollowUpOpen, setAddFollowUpOpen] = useState(false);
  const [selectedInterestId, setSelectedInterestId] = useState<string | null>(null);
  const [newFollowUpRemarks, setNewFollowUpRemarks] = useState("");
  const [isAddingFollowUp, setIsAddingFollowUp] = useState(false);

  // Edit follow-up dialog
  const [editFollowUpOpen, setEditFollowUpOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
  const [editFollowUpRemarks, setEditFollowUpRemarks] = useState("");
  const [isEditingFollowUp, setIsEditingFollowUp] = useState(false);
  const [editingInterestId, setEditingInterestId] = useState<string | null>(null);

  // Delete follow-up dialog
  const [deleteFollowUpOpen, setDeleteFollowUpOpen] = useState(false);
  const [deletingFollowUp, setDeletingFollowUp] = useState<FollowUp | null>(null);
  const [isDeletingFollowUp, setIsDeletingFollowUp] = useState(false);
  const [deletingInterestId, setDeletingInterestId] = useState<string | null>(null);

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

  const handleContactedChange = async (interestId: string, contacted: boolean) => {
    try {
      setUpdatingId(interestId);
      await api.businessProfile.updateInterest(interestId, { contacted });

      setInterests(prev =>
        prev.map(interest =>
          interest.id === interestId
            ? { ...interest, contacted }
            : interest
        )
      );

      toast({
        title: "Updated",
        description: `Marked as ${contacted ? 'contacted' : 'not contacted'}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const openAddFollowUpDialog = (interestId: string) => {
    setSelectedInterestId(interestId);
    setNewFollowUpRemarks("");
    setAddFollowUpOpen(true);
  };

  const handleAddFollowUp = async () => {
    if (!selectedInterestId || !newFollowUpRemarks.trim()) return;

    try {
      setIsAddingFollowUp(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.businessProfile.addFollowUp(selectedInterestId, newFollowUpRemarks);

      // Update the local state with the new follow-up
      setInterests(prev =>
        prev.map(interest => {
          if (interest.id === selectedInterestId) {
            return {
              ...interest,
              contacted: true,
              followUps: [...interest.followUps, response.followUp]
            };
          }
          return interest;
        })
      );

      toast({
        title: "Success",
        description: "Follow-up added successfully",
      });

      setAddFollowUpOpen(false);
      setNewFollowUpRemarks("");
      setSelectedInterestId(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add follow-up';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAddingFollowUp(false);
    }
  };

  const openEditFollowUpDialog = (followUp: FollowUp, interestId: string) => {
    setEditingFollowUp(followUp);
    setEditFollowUpRemarks(followUp.remarks);
    setEditingInterestId(interestId);
    setEditFollowUpOpen(true);
  };

  const handleEditFollowUp = async () => {
    if (!editingFollowUp || !editFollowUpRemarks.trim()) return;

    try {
      setIsEditingFollowUp(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.businessProfile.updateFollowUp(editingFollowUp.id, editFollowUpRemarks);

      // Update the local state
      setInterests(prev =>
        prev.map(interest => {
          if (interest.id === editingInterestId) {
            return {
              ...interest,
              followUps: interest.followUps.map(f =>
                f.id === editingFollowUp.id ? { ...f, remarks: response.followUp.remarks } : f
              )
            };
          }
          return interest;
        })
      );

      toast({
        title: "Success",
        description: "Follow-up updated successfully",
      });

      setEditFollowUpOpen(false);
      setEditingFollowUp(null);
      setEditFollowUpRemarks("");
      setEditingInterestId(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update follow-up';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsEditingFollowUp(false);
    }
  };

  const openDeleteFollowUpDialog = (followUp: FollowUp, interestId: string) => {
    setDeletingFollowUp(followUp);
    setDeletingInterestId(interestId);
    setDeleteFollowUpOpen(true);
  };

  const handleDeleteFollowUp = async () => {
    if (!deletingFollowUp || !deletingInterestId) return;

    try {
      setIsDeletingFollowUp(true);
      await api.businessProfile.deleteFollowUp(deletingFollowUp.id);

      // Update the local state
      setInterests(prev =>
        prev.map(interest => {
          if (interest.id === deletingInterestId) {
            return {
              ...interest,
              followUps: interest.followUps.filter(f => f.id !== deletingFollowUp.id)
            };
          }
          return interest;
        })
      );

      toast({
        title: "Success",
        description: "Follow-up deleted successfully",
      });

      setDeleteFollowUpOpen(false);
      setDeletingFollowUp(null);
      setDeletingInterestId(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete follow-up';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeletingFollowUp(false);
    }
  };

  // Calculate max follow-ups to determine column count
  const maxFollowUps = Math.max(0, ...interests.map(i => i.followUps?.length || 0));

  const downloadCSV = () => {
    if (interests.length === 0) {
      toast({
        title: "No data",
        description: "There are no inquiries to download",
        variant: "destructive",
      });
      return;
    }

    // CSV headers - dynamic based on max follow-ups
    const headers = [
      "Name", "Email", "Phone Number", "Message", "Contacted",
      ...Array.from({ length: maxFollowUps }, (_, i) => `Follow-up ${i + 1}`)
    ];

    // CSV rows
    const rows = interests.map(interest => {
      const followUpData = Array.from({ length: maxFollowUps }, (_, i) => {
        const followUp = interest.followUps?.find(f => f.followUpNumber === i + 1);
        if (followUp) {
          const date = new Date(followUp.createdAt);
          const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
          return `${followUp.remarks}\n${formattedDate}`;
        }
        return "";
      });

      return [
        interest.investorName,
        interest.email,
        interest.phoneNumber,
        interest.message || "",
        interest.contacted ? "Yes" : "No",
        ...followUpData
      ];
    });

    // Escape CSV values
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `investment_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "CSV file downloaded successfully",
    });
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
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {interests.filter(i => i.contacted).length}
            </div>
            <p className="text-xs text-muted-foreground">Follow-ups done</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <X className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {interests.filter(i => !i.contacted).length}
            </div>
            <p className="text-xs text-muted-foreground">Not contacted yet</p>
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

      {/* Inquiries Table */}
      {!isLoading && !error && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Inquiries</CardTitle>
              <CardDescription>
                Investment inquiries from potential investors
              </CardDescription>
            </div>
            <Button onClick={downloadCSV} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Name</TableHead>
                      <TableHead className="min-w-[180px]">Email</TableHead>
                      <TableHead className="min-w-[120px]">Phone Number</TableHead>
                      <TableHead className="min-w-[200px]">Message</TableHead>
                      <TableHead className="min-w-[100px]">Contacted</TableHead>
                      {/* Dynamic Follow-up columns */}
                      {Array.from({ length: maxFollowUps }, (_, i) => (
                        <TableHead key={`followup-header-${i}`} className="min-w-[150px]">
                          Follow-up {i + 1}
                        </TableHead>
                      ))}
                      <TableHead className="min-w-[60px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interests.map((interest) => (
                      <TableRow key={interest.id}>
                        <TableCell className="font-medium">{interest.investorName}</TableCell>
                        <TableCell>{interest.email}</TableCell>
                        <TableCell>{interest.phoneNumber}</TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="truncate" title={interest.message || ""}>
                            {interest.message || "-"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={interest.contacted ? "yes" : "no"}
                            onValueChange={(value) => handleContactedChange(interest.id, value === "yes")}
                            disabled={updatingId === interest.id}
                          >
                            <SelectTrigger className="w-[80px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        {/* Dynamic Follow-up cells */}
                        {Array.from({ length: maxFollowUps }, (_, i) => {
                          const followUp = interest.followUps?.find(f => f.followUpNumber === i + 1);
                          return (
                            <TableCell key={`followup-${interest.id}-${i}`} className="min-w-[180px]">
                              {followUp ? (
                                <div className="text-sm">
                                  <p className="truncate max-w-[120px]" title={followUp.remarks}>{followUp.remarks}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(followUp.createdAt).toLocaleDateString()}
                                  </p>
                                  <div className="flex gap-1 mt-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => openEditFollowUpDialog(followUp, interest.id)}
                                      title="Edit Follow-up"
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-destructive hover:text-destructive"
                                      onClick={() => openDeleteFollowUpDialog(followUp, interest.id)}
                                      title="Delete Follow-up"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          );
                        })}
                        {/* Add Follow-up button */}
                        <TableCell>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openAddFollowUpDialog(interest.id)}
                            title="Add Follow-up"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Follow-up Dialog */}
      <Dialog open={addFollowUpOpen} onOpenChange={setAddFollowUpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Follow-up</DialogTitle>
            <DialogDescription>
              Add a new follow-up note for this inquiry
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter follow-up remarks..."
              value={newFollowUpRemarks}
              onChange={(e) => setNewFollowUpRemarks(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFollowUpOpen(false)} disabled={isAddingFollowUp}>
              Cancel
            </Button>
            <Button onClick={handleAddFollowUp} disabled={isAddingFollowUp || !newFollowUpRemarks.trim()}>
              {isAddingFollowUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Follow-up'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Follow-up Dialog */}
      <Dialog open={editFollowUpOpen} onOpenChange={setEditFollowUpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Follow-up</DialogTitle>
            <DialogDescription>
              Update the follow-up remarks
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter follow-up remarks..."
              value={editFollowUpRemarks}
              onChange={(e) => setEditFollowUpRemarks(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFollowUpOpen(false)} disabled={isEditingFollowUp}>
              Cancel
            </Button>
            <Button onClick={handleEditFollowUp} disabled={isEditingFollowUp || !editFollowUpRemarks.trim()}>
              {isEditingFollowUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Follow-up Dialog */}
      <Dialog open={deleteFollowUpOpen} onOpenChange={setDeleteFollowUpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Follow-up</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this follow-up? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteFollowUpOpen(false)} disabled={isDeletingFollowUp}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFollowUp} disabled={isDeletingFollowUp}>
              {isDeletingFollowUp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BusinessDashboardLayout>
  );
}
