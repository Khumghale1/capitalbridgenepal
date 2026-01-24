import React, { useState, useEffect, useMemo } from "react";
import { BusinessDashboardLayout } from "./BusinessDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Loader2,
  Download,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Phone,
  Mail,
  User,
  Clock,
  Filter,
  Bell,
} from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, isToday, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

type InterestStatus = "NOT_CONTACTED" | "INTERESTED" | "NOT_INTERESTED";

interface FollowUp {
  id: string;
  followUpNumber: number;
  remarks: string;
  nextFollowUpDate: string | null;
  createdAt: string;
}

interface Interest {
  id: string;
  investorName: string;
  email: string;
  phoneNumber: string;
  message: string | null;
  submittedAt: string;
  source: string;
  status: InterestStatus;
  contacted: boolean;
  followUpRemarks: string | null;
  followUps: FollowUp[];
}

interface StatusCounts {
  NOT_CONTACTED: number;
  INTERESTED: number;
  NOT_INTERESTED: number;
}

const STATUS_CONFIG = {
  NOT_CONTACTED: {
    label: "Not Contacted",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    badgeColor: "bg-gray-500",
  },
  INTERESTED: {
    label: "Interested",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    badgeColor: "bg-green-500",
  },
  NOT_INTERESTED: {
    label: "Not Interested",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    badgeColor: "bg-red-500",
  },
};

const DEFAULT_SOURCES = [
  "aarthiQ Platform",
  "Website",
  "Referral",
  "Social Media",
  "Manual Entry",
  "Other",
];

export default function InvestmentInquiries() {
  const { toast } = useToast();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<InterestStatus>("NOT_CONTACTED");
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    NOT_CONTACTED: 0,
    INTERESTED: 0,
    NOT_INTERESTED: 0,
  });

  // Lead sources
  const [sources, setSources] = useState<string[]>(DEFAULT_SOURCES);
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [addSourceOpen, setAddSourceOpen] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [isAddingSource, setIsAddingSource] = useState(false);

  // Expanded rows for follow-ups
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Add follow-up dialog
  const [addFollowUpOpen, setAddFollowUpOpen] = useState(false);
  const [selectedInterestId, setSelectedInterestId] = useState<string | null>(null);
  const [newFollowUpRemarks, setNewFollowUpRemarks] = useState("");
  const [newFollowUpDate, setNewFollowUpDate] = useState<Date | undefined>(undefined);
  const [isAddingFollowUp, setIsAddingFollowUp] = useState(false);

  // Edit follow-up dialog
  const [editFollowUpOpen, setEditFollowUpOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
  const [editFollowUpRemarks, setEditFollowUpRemarks] = useState("");
  const [editFollowUpDate, setEditFollowUpDate] = useState<Date | undefined>(undefined);
  const [isEditingFollowUp, setIsEditingFollowUp] = useState(false);
  const [editingInterestId, setEditingInterestId] = useState<string | null>(null);

  // Delete follow-up dialog
  const [deleteFollowUpOpen, setDeleteFollowUpOpen] = useState(false);
  const [deletingFollowUp, setDeletingFollowUp] = useState<FollowUp | null>(null);
  const [isDeletingFollowUp, setIsDeletingFollowUp] = useState(false);
  const [deletingInterestId, setDeletingInterestId] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
    fetchLeadSources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.businessProfile.getOwnInterests();
      setInterests(response.interests || []);
      if (response.statusCounts) {
        setStatusCounts(response.statusCounts);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load inquiries";
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

  const fetchLeadSources = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.businessProfile.getLeadSources();
      setSources(response.sources || DEFAULT_SOURCES);
    } catch (error) {
      console.error("Failed to fetch lead sources:", error);
    }
  };

  // Filter interests by status and source
  const filteredInterests = useMemo(() => {
    return interests.filter((interest) => {
      const statusMatch = interest.status === activeTab;
      const sourceMatch = sourceFilter === "all" || interest.source === sourceFilter;
      return statusMatch && sourceMatch;
    });
  }, [interests, activeTab, sourceFilter]);

  // Get today's follow-ups count
  const todayFollowUpsCount = useMemo(() => {
    return interests.filter((interest) =>
      interest.followUps.some(
        (f) => f.nextFollowUpDate && isToday(parseISO(f.nextFollowUpDate))
      )
    ).length;
  }, [interests]);

  // Check if interest has today's follow-up
  const hasTodayFollowUp = (interest: Interest) => {
    return interest.followUps.some(
      (f) => f.nextFollowUpDate && isToday(parseISO(f.nextFollowUpDate))
    );
  };

  const handleStatusChange = async (interestId: string, newStatus: InterestStatus) => {
    try {
      setUpdatingId(interestId);
      await api.businessProfile.updateInterest(interestId, { status: newStatus });

      setInterests((prev) =>
        prev.map((interest) =>
          interest.id === interestId ? { ...interest, status: newStatus } : interest
        )
      );

      // Update counts
      const oldStatus = interests.find((i) => i.id === interestId)?.status;
      if (oldStatus) {
        setStatusCounts((prev) => ({
          ...prev,
          [oldStatus]: prev[oldStatus] - 1,
          [newStatus]: prev[newStatus] + 1,
        }));
      }

      toast({
        title: "Updated",
        description: `Lead moved to ${STATUS_CONFIG[newStatus].label}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSourceChange = async (interestId: string, newSource: string) => {
    try {
      setUpdatingId(interestId);
      await api.businessProfile.updateInterest(interestId, { source: newSource });

      setInterests((prev) =>
        prev.map((interest) =>
          interest.id === interestId ? { ...interest, source: newSource } : interest
        )
      );

      toast({
        title: "Updated",
        description: "Lead source updated",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddSource = async () => {
    if (!newSourceName.trim()) return;

    try {
      setIsAddingSource(true);
      await api.businessProfile.addLeadSource(newSourceName.trim());

      setSources((prev) => [...prev, newSourceName.trim()]);
      setNewSourceName("");
      setAddSourceOpen(false);

      toast({
        title: "Success",
        description: "Lead source added successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add source";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAddingSource(false);
    }
  };

  const toggleRowExpanded = (interestId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(interestId)) {
        newSet.delete(interestId);
      } else {
        newSet.add(interestId);
      }
      return newSet;
    });
  };

  const openAddFollowUpDialog = (interestId: string) => {
    setSelectedInterestId(interestId);
    setNewFollowUpRemarks("");
    setNewFollowUpDate(undefined);
    setAddFollowUpOpen(true);
  };

  const handleAddFollowUp = async () => {
    if (!selectedInterestId || !newFollowUpRemarks.trim()) return;

    try {
      setIsAddingFollowUp(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.businessProfile.addFollowUp(
        selectedInterestId,
        newFollowUpRemarks,
        newFollowUpDate ? format(newFollowUpDate, "yyyy-MM-dd") : null
      );

      setInterests((prev) =>
        prev.map((interest) => {
          if (interest.id === selectedInterestId) {
            return {
              ...interest,
              contacted: true,
              followUps: [...interest.followUps, response.followUp],
            };
          }
          return interest;
        })
      );

      // Auto-expand the row to show the new follow-up
      setExpandedRows((prev) => new Set(prev).add(selectedInterestId));

      toast({
        title: "Success",
        description: "Follow-up added successfully",
      });

      setAddFollowUpOpen(false);
      setNewFollowUpRemarks("");
      setNewFollowUpDate(undefined);
      setSelectedInterestId(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add follow-up";
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
    setEditFollowUpDate(
      followUp.nextFollowUpDate ? parseISO(followUp.nextFollowUpDate) : undefined
    );
    setEditingInterestId(interestId);
    setEditFollowUpOpen(true);
  };

  const handleEditFollowUp = async () => {
    if (!editingFollowUp || !editFollowUpRemarks.trim()) return;

    try {
      setIsEditingFollowUp(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.businessProfile.updateFollowUp(
        editingFollowUp.id,
        editFollowUpRemarks,
        editFollowUpDate ? format(editFollowUpDate, "yyyy-MM-dd") : null
      );

      setInterests((prev) =>
        prev.map((interest) => {
          if (interest.id === editingInterestId) {
            return {
              ...interest,
              followUps: interest.followUps.map((f) =>
                f.id === editingFollowUp.id
                  ? { ...f, remarks: response.followUp.remarks, nextFollowUpDate: response.followUp.nextFollowUpDate }
                  : f
              ),
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
      setEditFollowUpDate(undefined);
      setEditingInterestId(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update follow-up";
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

      setInterests((prev) =>
        prev.map((interest) => {
          if (interest.id === deletingInterestId) {
            return {
              ...interest,
              followUps: interest.followUps.filter((f) => f.id !== deletingFollowUp.id),
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
      const errorMessage = error instanceof Error ? error.message : "Failed to delete follow-up";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeletingFollowUp(false);
    }
  };

  const downloadCSV = () => {
    if (interests.length === 0) {
      toast({
        title: "No data",
        description: "There are no inquiries to download",
        variant: "destructive",
      });
      return;
    }

    const maxFollowUps = Math.max(0, ...interests.map((i) => i.followUps?.length || 0));

    const headers = [
      "Name",
      "Email",
      "Phone Number",
      "Message",
      "Source",
      "Status",
      ...Array.from({ length: maxFollowUps }, (_, i) => `Follow-up ${i + 1}`),
      ...Array.from({ length: maxFollowUps }, (_, i) => `Next Follow-up Date ${i + 1}`),
    ];

    const rows = interests.map((interest) => {
      const followUpData = Array.from({ length: maxFollowUps }, (_, i) => {
        const followUp = interest.followUps?.find((f) => f.followUpNumber === i + 1);
        return followUp?.remarks || "";
      });

      const followUpDates = Array.from({ length: maxFollowUps }, (_, i) => {
        const followUp = interest.followUps?.find((f) => f.followUpNumber === i + 1);
        return followUp?.nextFollowUpDate
          ? format(parseISO(followUp.nextFollowUpDate), "dd/MM/yyyy")
          : "";
      });

      return [
        interest.investorName,
        interest.email,
        interest.phoneNumber,
        interest.message || "",
        interest.source,
        STATUS_CONFIG[interest.status].label,
        ...followUpData,
        ...followUpDates,
      ];
    });

    const escapeCSV = (value: string) => {
      if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [headers.join(","), ...rows.map((row) => row.map(escapeCSV).join(","))].join(
      "\n"
    );

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `investment_inquiries_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "CSV file downloaded successfully",
    });
  };

  // Render mobile card view
  const renderMobileCard = (interest: Interest) => {
    const isExpanded = expandedRows.has(interest.id);
    const isTodayAction = hasTodayFollowUp(interest);

    return (
      <Card
        key={interest.id}
        className={cn(
          "mb-4 transition-all",
          isTodayAction && "ring-2 ring-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10"
        )}
      >
        <CardContent className="p-4">
          {/* Today's Action Badge */}
          {isTodayAction && (
            <Badge className="mb-2 bg-yellow-500 text-white">
              <Bell className="h-3 w-3 mr-1" />
              Today's Action
            </Badge>
          )}

          {/* Header with name and status */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{interest.investorName}</span>
            </div>
            <Select
              value={interest.status}
              onValueChange={(value) => handleStatusChange(interest.id, value as InterestStatus)}
              disabled={updatingId === interest.id}
            >
              <SelectTrigger className={cn("w-[140px] h-8 text-xs", STATUS_CONFIG[interest.status].color)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_CONTACTED">Not Contacted</SelectItem>
                <SelectItem value="INTERESTED">Interested</SelectItem>
                <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contact info */}
          <div className="space-y-2 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${interest.email}`} className="hover:underline">
                {interest.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href={`tel:${interest.phoneNumber}`} className="hover:underline">
                {interest.phoneNumber}
              </a>
            </div>
          </div>

          {/* Message */}
          {interest.message && (
            <p className="text-sm bg-muted/50 p-2 rounded mb-3 line-clamp-2">{interest.message}</p>
          )}

          {/* Source */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-muted-foreground">Source:</span>
            <Select
              value={interest.source}
              onValueChange={(value) => handleSourceChange(interest.id, value)}
              disabled={updatingId === interest.id}
            >
              <SelectTrigger className="h-7 text-xs w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Follow-ups section */}
          <div className="border-t pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between mb-2"
              onClick={() => toggleRowExpanded(interest.id)}
            >
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Follow-ups ({interest.followUps.length})
              </span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {isExpanded && (
              <div className="space-y-2 mb-3">
                {interest.followUps.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No follow-ups yet</p>
                ) : (
                  interest.followUps.map((followUp) => (
                    <div
                      key={followUp.id}
                      className={cn(
                        "bg-muted/50 p-3 rounded-lg text-sm",
                        followUp.nextFollowUpDate &&
                          isToday(parseISO(followUp.nextFollowUpDate)) &&
                          "bg-yellow-100 dark:bg-yellow-900/30"
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <Badge variant="outline" className="text-xs">
                          #{followUp.followUpNumber}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => openEditFollowUpDialog(followUp, interest.id)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive"
                            onClick={() => openDeleteFollowUpDialog(followUp, interest.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mb-1">{followUp.remarks}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Created: {format(parseISO(followUp.createdAt), "dd MMM yyyy")}</span>
                        {followUp.nextFollowUpDate && (
                          <Badge
                            variant={
                              isToday(parseISO(followUp.nextFollowUpDate)) ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(parseISO(followUp.nextFollowUpDate), "dd MMM yyyy")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => openAddFollowUpDialog(interest.id)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Follow-up
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render desktop table row
  const renderTableRow = (interest: Interest) => {
    const isExpanded = expandedRows.has(interest.id);
    const isTodayAction = hasTodayFollowUp(interest);

    return (
      <React.Fragment key={interest.id}>
        <TableRow
          className={cn(
            isTodayAction && "bg-yellow-50 dark:bg-yellow-900/10 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
          )}
        >
          <TableCell>
            {isTodayAction && (
              <Badge className="bg-yellow-500 text-white mb-1">
                <Bell className="h-3 w-3 mr-1" />
                Today
              </Badge>
            )}
            <div className="font-medium">{interest.investorName}</div>
            <div className="text-xs text-muted-foreground">
              {format(parseISO(interest.submittedAt), "dd MMM yyyy")}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <a href={`mailto:${interest.email}`} className="hover:underline text-sm">
                {interest.email}
              </a>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <a href={`tel:${interest.phoneNumber}`} className="hover:underline text-sm">
                {interest.phoneNumber}
              </a>
            </div>
          </TableCell>
          <TableCell className="max-w-[200px]">
            <p className="truncate text-sm" title={interest.message || ""}>
              {interest.message || "-"}
            </p>
          </TableCell>
          <TableCell>
            <Select
              value={interest.source}
              onValueChange={(value) => handleSourceChange(interest.id, value)}
              disabled={updatingId === interest.id}
            >
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Select
              value={interest.status}
              onValueChange={(value) => handleStatusChange(interest.id, value as InterestStatus)}
              disabled={updatingId === interest.id}
            >
              <SelectTrigger className={cn("w-[140px] h-8 text-xs", STATUS_CONFIG[interest.status].color)}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_CONTACTED">Not Contacted</SelectItem>
                <SelectItem value="INTERESTED">Interested</SelectItem>
                <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleRowExpanded(interest.id)}
              className="text-xs"
            >
              {interest.followUps.length} Follow-ups
              {isExpanded ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </Button>
          </TableCell>
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

        {/* Expanded follow-ups row */}
        {isExpanded && (
          <TableRow className="bg-muted/30">
            <TableCell colSpan={7} className="p-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm mb-3">Follow-up History</h4>
                {interest.followUps.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No follow-ups recorded yet</p>
                ) : (
                  <div className="grid gap-2">
                    {interest.followUps.map((followUp) => (
                      <div
                        key={followUp.id}
                        className={cn(
                          "flex items-start justify-between bg-background p-3 rounded-lg border",
                          followUp.nextFollowUpDate &&
                            isToday(parseISO(followUp.nextFollowUpDate)) &&
                            "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">#{followUp.followUpNumber}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(parseISO(followUp.createdAt), "dd MMM yyyy, HH:mm")}
                            </span>
                            {followUp.nextFollowUpDate && (
                              <Badge
                                variant={isToday(parseISO(followUp.nextFollowUpDate)) ? "default" : "secondary"}
                              >
                                <Calendar className="h-3 w-3 mr-1" />
                                Next: {format(parseISO(followUp.nextFollowUpDate), "dd MMM yyyy")}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{followUp.remarks}</p>
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditFollowUpDialog(followUp, interest.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => openDeleteFollowUpDialog(followUp, interest.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  return (
    <BusinessDashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Investment Inquiries</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage inquiries and messages from potential investors
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{interests.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Contacted</CardTitle>
            <div className="h-3 w-3 rounded-full bg-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.NOT_CONTACTED}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interested</CardTitle>
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.INTERESTED}</div>
          </CardContent>
        </Card>

        <Card className={cn(todayFollowUpsCount > 0 && "ring-2 ring-yellow-400")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Actions</CardTitle>
            <Bell className={cn("h-4 w-4", todayFollowUpsCount > 0 ? "text-yellow-500" : "text-muted-foreground")} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayFollowUpsCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={addSourceOpen} onOpenChange={setAddSourceOpen}>
            <Button variant="outline" size="icon" onClick={() => setAddSourceOpen(true)} title="Add Source">
              <Plus className="h-4 w-4" />
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Lead Source</DialogTitle>
                <DialogDescription>Create a custom lead source for tracking</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="Enter source name..."
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddSourceOpen(false)} disabled={isAddingSource}>
                  Cancel
                </Button>
                <Button onClick={handleAddSource} disabled={isAddingSource || !newSourceName.trim()}>
                  {isAddingSource ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Source"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Button onClick={downloadCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download CSV</span>
        </Button>
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

      {/* Main Content with Tabs */}
      {!isLoading && !error && (
        <Card>
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle>Lead Management</CardTitle>
                <CardDescription>Track and manage your investment leads</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as InterestStatus)}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="NOT_CONTACTED" className="text-xs sm:text-sm">
                  Not Contacted
                  <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
                    {statusCounts.NOT_CONTACTED}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="INTERESTED" className="text-xs sm:text-sm">
                  Interested
                  <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
                    {statusCounts.INTERESTED}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="NOT_INTERESTED" className="text-xs sm:text-sm">
                  Not Interested
                  <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
                    {statusCounts.NOT_INTERESTED}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {["NOT_CONTACTED", "INTERESTED", "NOT_INTERESTED"].map((status) => (
                <TabsContent key={status} value={status}>
                  {filteredInterests.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                      <p className="text-muted-foreground font-medium">No inquiries in this category</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Leads will appear here when their status matches this tab
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Mobile View - Cards */}
                      <div className="block lg:hidden">{filteredInterests.map(renderMobileCard)}</div>

                      {/* Desktop View - Table */}
                      <div className="hidden lg:block overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[140px]">Name</TableHead>
                              <TableHead className="min-w-[200px]">Contact</TableHead>
                              <TableHead className="min-w-[180px]">Message</TableHead>
                              <TableHead className="min-w-[140px]">Source</TableHead>
                              <TableHead className="min-w-[150px]">Status</TableHead>
                              <TableHead className="min-w-[120px]">Follow-ups</TableHead>
                              <TableHead className="min-w-[60px]">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>{filteredInterests.map(renderTableRow)}</TableBody>
                        </Table>
                      </div>
                    </>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Add Follow-up Dialog */}
      <Dialog open={addFollowUpOpen} onOpenChange={setAddFollowUpOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Follow-up</DialogTitle>
            <DialogDescription>Add a new follow-up note and schedule next action</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Follow-up Note</label>
              <Textarea
                placeholder="Enter follow-up remarks..."
                value={newFollowUpRemarks}
                onChange={(e) => setNewFollowUpRemarks(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Next Follow-up Date (Optional)</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newFollowUpDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {newFollowUpDate ? format(newFollowUpDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={newFollowUpDate}
                    onSelect={setNewFollowUpDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
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
                "Add Follow-up"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Follow-up Dialog */}
      <Dialog open={editFollowUpOpen} onOpenChange={setEditFollowUpOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Follow-up</DialogTitle>
            <DialogDescription>Update the follow-up note and next action date</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Follow-up Note</label>
              <Textarea
                placeholder="Enter follow-up remarks..."
                value={editFollowUpRemarks}
                onChange={(e) => setEditFollowUpRemarks(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Next Follow-up Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editFollowUpDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {editFollowUpDate ? format(editFollowUpDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={editFollowUpDate}
                    onSelect={setEditFollowUpDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
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
                "Save Changes"
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
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BusinessDashboardLayout>
  );
}
