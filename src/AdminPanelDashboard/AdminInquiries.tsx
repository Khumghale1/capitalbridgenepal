import { useState, useEffect, useMemo } from "react";
import { AdminPanelDashboardLayout } from "./AdminPanelDashboardLayout";
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
  Bell,
  Building2,
  Search,
  ArrowLeft,
  Users,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
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

interface Business {
  id: string;
  name: string;
  logoUrl?: string;
  registrationNumber?: string;
  contactEmail?: string;
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
  business: Business;
}

interface StatusCounts {
  NOT_CONTACTED: number;
  INTERESTED: number;
  NOT_INTERESTED: number;
  total: number;
}

interface BusinessWithCount {
  id: string;
  name: string;
  logoUrl?: string;
  _count: { interests: number };
  statusCounts?: {
    NOT_CONTACTED: number;
    INTERESTED: number;
    NOT_INTERESTED: number;
  };
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

export default function AdminInquiries() {
  const { toast } = useToast();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<InterestStatus>("NOT_CONTACTED");
  const [globalStatusCounts, setGlobalStatusCounts] = useState<StatusCounts>({
    NOT_CONTACTED: 0,
    INTERESTED: 0,
    NOT_INTERESTED: 0,
    total: 0,
  });

  // View state: null = grid view, Business = detail view
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithCount | null>(null);

  // Business grid
  const [businesses, setBusinesses] = useState<BusinessWithCount[]>([]);
  const [businessSearch, setBusinessSearch] = useState("");

  // Sources
  const [sources, setSources] = useState<string[]>(DEFAULT_SOURCES);

  // Expanded rows for follow-ups
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Today's follow-ups count
  const [todayFollowUpsCount, setTodayFollowUpsCount] = useState(0);

  // Add follow-up dialog
  const [addFollowUpOpen, setAddFollowUpOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null);
  const [newFollowUpRemarks, setNewFollowUpRemarks] = useState("");
  const [newFollowUpDate, setNewFollowUpDate] = useState<Date | undefined>(undefined);
  const [isAddingFollowUp, setIsAddingFollowUp] = useState(false);

  // Edit follow-up dialog
  const [editFollowUpOpen, setEditFollowUpOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUp | null>(null);
  const [editFollowUpRemarks, setEditFollowUpRemarks] = useState("");
  const [editFollowUpDate, setEditFollowUpDate] = useState<Date | undefined>(undefined);
  const [isEditingFollowUp, setIsEditingFollowUp] = useState(false);
  const [editingInterest, setEditingInterest] = useState<Interest | null>(null);

  // Delete follow-up dialog
  const [deleteFollowUpOpen, setDeleteFollowUpOpen] = useState(false);
  const [deletingFollowUp, setDeletingFollowUp] = useState<FollowUp | null>(null);
  const [isDeletingFollowUp, setIsDeletingFollowUp] = useState(false);
  const [deletingInterest, setDeletingInterest] = useState<Interest | null>(null);

  useEffect(() => {
    fetchAllData();
    fetchSources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.interests.getAll({ limit: 1000 });
      const allInterests = response.interests || [];
      setInterests(allInterests);

      if (response.statusCounts) {
        setGlobalStatusCounts(response.statusCounts);
      }

      // Calculate businesses with their counts
      const businessMap = new Map<string, BusinessWithCount>();
      allInterests.forEach((interest: Interest) => {
        const bizId = interest.business.id;
        if (!businessMap.has(bizId)) {
          businessMap.set(bizId, {
            id: interest.business.id,
            name: interest.business.name,
            logoUrl: interest.business.logoUrl,
            _count: { interests: 0 },
            statusCounts: { NOT_CONTACTED: 0, INTERESTED: 0, NOT_INTERESTED: 0 },
          });
        }
        const biz = businessMap.get(bizId)!;
        biz._count.interests++;
        if (biz.statusCounts) {
          biz.statusCounts[interest.status]++;
        }
      });
      setBusinesses(Array.from(businessMap.values()).sort((a, b) => a.name.localeCompare(b.name)));

      // Calculate today's follow-ups
      const todayCount = allInterests.filter((interest: Interest) =>
        interest.followUps.some(
          (f) => f.nextFollowUpDate && isToday(parseISO(f.nextFollowUpDate))
        )
      ).length;
      setTodayFollowUpsCount(todayCount);
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

  const fetchSources = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.interests.getSources();
      setSources(response.sources || DEFAULT_SOURCES);
    } catch (error) {
      console.error("Failed to fetch sources:", error);
    }
  };

  // Filter businesses by search
  const filteredBusinesses = useMemo(() => {
    if (!businessSearch) return businesses;
    return businesses.filter((b) =>
      b.name.toLowerCase().includes(businessSearch.toLowerCase())
    );
  }, [businesses, businessSearch]);

  // Get interests for selected business
  const businessInterests = useMemo(() => {
    if (!selectedBusiness) return [];
    return interests.filter((i) => i.business.id === selectedBusiness.id);
  }, [interests, selectedBusiness]);

  // Filter by status tab
  const filteredInterests = useMemo(() => {
    return businessInterests.filter((i) => i.status === activeTab);
  }, [businessInterests, activeTab]);

  // Status counts for selected business
  const businessStatusCounts = useMemo(() => {
    const counts = { NOT_CONTACTED: 0, INTERESTED: 0, NOT_INTERESTED: 0 };
    businessInterests.forEach((i) => {
      counts[i.status]++;
    });
    return counts;
  }, [businessInterests]);

  // Check if interest has today's follow-up
  const hasTodayFollowUp = (interest: Interest) => {
    return interest.followUps.some(
      (f) => f.nextFollowUpDate && isToday(parseISO(f.nextFollowUpDate))
    );
  };

  const handleBusinessClick = (business: BusinessWithCount) => {
    setSelectedBusiness(business);
    setActiveTab("NOT_CONTACTED");
    setExpandedRows(new Set());
  };

  const handleBackToGrid = () => {
    setSelectedBusiness(null);
    setBusinessSearch("");
  };

  const handleStatusChange = async (interest: Interest, newStatus: InterestStatus) => {
    try {
      setUpdatingId(interest.id);
      await api.interests.update(interest.id, {
        status: newStatus,
        businessId: interest.business.id,
      });

      setInterests((prev) =>
        prev.map((i) => (i.id === interest.id ? { ...i, status: newStatus } : i))
      );

      // Update global counts
      setGlobalStatusCounts((prev) => ({
        ...prev,
        [interest.status]: prev[interest.status] - 1,
        [newStatus]: prev[newStatus] + 1,
      }));

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

  const handleSourceChange = async (interest: Interest, newSource: string) => {
    try {
      setUpdatingId(interest.id);
      await api.interests.update(interest.id, {
        source: newSource,
        businessId: interest.business.id,
      });

      setInterests((prev) =>
        prev.map((i) => (i.id === interest.id ? { ...i, source: newSource } : i))
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

  const openAddFollowUpDialog = (interest: Interest) => {
    setSelectedInterest(interest);
    setNewFollowUpRemarks("");
    setNewFollowUpDate(undefined);
    setAddFollowUpOpen(true);
  };

  const handleAddFollowUp = async () => {
    if (!selectedInterest || !newFollowUpRemarks.trim()) return;

    try {
      setIsAddingFollowUp(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.interests.addFollowUp(
        selectedInterest.id,
        newFollowUpRemarks,
        selectedInterest.business.id,
        newFollowUpDate ? format(newFollowUpDate, "yyyy-MM-dd") : null
      );

      const updatedInterest = {
        ...selectedInterest,
        contacted: true,
        followUps: [...selectedInterest.followUps, response.followUp],
      };

      setInterests((prev) =>
        prev.map((interest) =>
          interest.id === selectedInterest.id ? updatedInterest : interest
        )
      );

      // Keep selectedInterest in sync for modal
      setSelectedInterest(updatedInterest);

      setExpandedRows((prev) => new Set(prev).add(selectedInterest.id));

      toast({
        title: "Success",
        description: "Follow-up added successfully",
      });

      setAddFollowUpOpen(false);
      setNewFollowUpRemarks("");
      setNewFollowUpDate(undefined);
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

  const openEditFollowUpDialog = (followUp: FollowUp, interest: Interest) => {
    setEditingFollowUp(followUp);
    setEditFollowUpRemarks(followUp.remarks);
    setEditFollowUpDate(
      followUp.nextFollowUpDate ? parseISO(followUp.nextFollowUpDate) : undefined
    );
    setEditingInterest(interest);
    setEditFollowUpOpen(true);
  };

  const handleEditFollowUp = async () => {
    if (!editingFollowUp || !editFollowUpRemarks.trim() || !editingInterest) return;

    try {
      setIsEditingFollowUp(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.interests.updateFollowUp(
        editingFollowUp.id,
        editFollowUpRemarks,
        editingInterest.business.id,
        editFollowUpDate ? format(editFollowUpDate, "yyyy-MM-dd") : null
      );

      const updatedFollowUps = editingInterest.followUps.map((f) =>
        f.id === editingFollowUp.id
          ? { ...f, remarks: response.followUp.remarks, nextFollowUpDate: response.followUp.nextFollowUpDate }
          : f
      );

      const updatedInterest = {
        ...editingInterest,
        followUps: updatedFollowUps,
      };

      setInterests((prev) =>
        prev.map((interest) =>
          interest.id === editingInterest.id ? updatedInterest : interest
        )
      );

      // Keep selectedInterest in sync for modal
      if (selectedInterest && selectedInterest.id === editingInterest.id) {
        setSelectedInterest(updatedInterest);
      }

      toast({
        title: "Success",
        description: "Follow-up updated successfully",
      });

      setEditFollowUpOpen(false);
      setEditingFollowUp(null);
      setEditFollowUpRemarks("");
      setEditFollowUpDate(undefined);
      setEditingInterest(null);
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

  const openDeleteFollowUpDialog = (followUp: FollowUp, interest: Interest) => {
    setDeletingFollowUp(followUp);
    setDeletingInterest(interest);
    setDeleteFollowUpOpen(true);
  };

  const handleDeleteFollowUp = async () => {
    if (!deletingFollowUp || !deletingInterest) return;

    try {
      setIsDeletingFollowUp(true);
      await api.interests.deleteFollowUp(deletingFollowUp.id, deletingInterest.business.id);

      const updatedFollowUps = deletingInterest.followUps.filter((f) => f.id !== deletingFollowUp.id);

      const updatedInterest = {
        ...deletingInterest,
        followUps: updatedFollowUps,
      };

      setInterests((prev) =>
        prev.map((interest) =>
          interest.id === deletingInterest.id ? updatedInterest : interest
        )
      );

      // Keep selectedInterest in sync for modal
      if (selectedInterest && selectedInterest.id === deletingInterest.id) {
        setSelectedInterest(updatedInterest);
      }

      toast({
        title: "Success",
        description: "Follow-up deleted successfully",
      });

      setDeleteFollowUpOpen(false);
      setDeletingFollowUp(null);
      setDeletingInterest(null);
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
    const dataToExport = selectedBusiness ? businessInterests : interests;

    if (dataToExport.length === 0) {
      toast({
        title: "No data",
        description: "There are no inquiries to download",
        variant: "destructive",
      });
      return;
    }

    const maxFollowUps = Math.max(0, ...dataToExport.map((i) => i.followUps?.length || 0));

    const headers = [
      "Business Name",
      "Investor Name",
      "Email",
      "Phone Number",
      "Message",
      "Source",
      "Status",
      ...Array.from({ length: maxFollowUps }, (_, i) => `Follow-up ${i + 1}`),
      ...Array.from({ length: maxFollowUps }, (_, i) => `Next Follow-up Date ${i + 1}`),
      "Submitted At",
    ];

    const rows = dataToExport.map((interest) => {
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
        interest.business.name,
        interest.investorName,
        interest.email,
        interest.phoneNumber,
        interest.message || "",
        interest.source,
        STATUS_CONFIG[interest.status].label,
        ...followUpData,
        ...followUpDates,
        format(parseISO(interest.submittedAt), "dd/MM/yyyy HH:mm"),
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
    const fileName = selectedBusiness
      ? `${selectedBusiness.name.replace(/[^a-z0-9]/gi, "_")}_inquiries_${new Date().toISOString().split("T")[0]}.csv`
      : `all_investment_inquiries_${new Date().toISOString().split("T")[0]}.csv`;
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "CSV file downloaded successfully",
    });
  };

  // Open inquiry detail modal
  const openInquiryDetail = (interest: Interest) => {
    setSelectedInterest(interest);
    setExpandedRows(new Set([interest.id])); // Auto-expand follow-ups
  };

  // Close inquiry detail modal
  const closeInquiryDetail = () => {
    setSelectedInterest(null);
  };

  // Render compact inquiry card for grid
  const renderInquiryGridCard = (interest: Interest) => {
    const isTodayAction = hasTodayFollowUp(interest);
    const nextFollowUp = interest.followUps.find(
      (f) => f.nextFollowUpDate && isToday(parseISO(f.nextFollowUpDate))
    );

    return (
      <Card
        key={interest.id}
        className={cn(
          "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary",
          isTodayAction && "ring-2 ring-yellow-400"
        )}
        onClick={() => openInquiryDetail(interest)}
      >
        <CardContent className="p-4 flex flex-col items-center text-center">
          {/* User Avatar */}
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-3 border-2 border-primary/20">
            <User className="h-7 w-7 text-primary" />
          </div>

          {/* Name */}
          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{interest.investorName}</h3>

          {/* Contact Info */}
          <div className="text-xs text-muted-foreground space-y-0.5 mb-2 w-full">
            <p className="flex items-center justify-center gap-1 truncate">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{interest.email}</span>
            </p>
            <p className="flex items-center justify-center gap-1">
              <Phone className="h-3 w-3 flex-shrink-0" />
              {interest.phoneNumber}
            </p>
          </div>

          {/* Status Badge */}
          <Badge className={cn("text-xs mb-2", STATUS_CONFIG[interest.status].color)}>
            {STATUS_CONFIG[interest.status].label}
          </Badge>

          {/* Follow-ups count and today indicator */}
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              <Clock className="h-2.5 w-2.5 mr-1" />
              {interest.followUps.length} follow-up{interest.followUps.length !== 1 ? "s" : ""}
            </Badge>
            {isTodayAction && (
              <Badge className="bg-yellow-500 text-xs px-1.5 py-0">
                <Bell className="h-2.5 w-2.5 mr-0.5" />
                Today
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render business card for grid
  const renderBusinessCard = (business: BusinessWithCount) => {
    const hasToday = interests.some(
      (i) =>
        i.business.id === business.id &&
        i.followUps.some((f) => f.nextFollowUpDate && isToday(parseISO(f.nextFollowUpDate)))
    );

    return (
      <Card
        key={business.id}
        className={cn(
          "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary",
          hasToday && "ring-2 ring-yellow-400"
        )}
        onClick={() => handleBusinessClick(business)}
      >
        <CardContent className="p-4 flex flex-col items-center text-center">
          {/* Logo */}
          <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-3 overflow-hidden border">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={business.name}
                className="h-16 w-16 object-contain"
              />
            ) : (
              <Building2 className="h-10 w-10 text-primary" />
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{business.name}</h3>

          {/* Lead count */}
          <p className="text-xs text-muted-foreground mb-2">
            {business._count.interests} lead{business._count.interests !== 1 ? "s" : ""}
          </p>

          {/* Status indicators */}
          <div className="flex gap-1 flex-wrap justify-center">
            {business.statusCounts && business.statusCounts.NOT_CONTACTED > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {business.statusCounts.NOT_CONTACTED} new
              </Badge>
            )}
            {business.statusCounts && business.statusCounts.INTERESTED > 0 && (
              <Badge className="bg-green-500 text-xs px-1.5 py-0">
                {business.statusCounts.INTERESTED}
              </Badge>
            )}
            {hasToday && (
              <Badge className="bg-yellow-500 text-xs px-1.5 py-0">
                <Bell className="h-2.5 w-2.5" />
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminPanelDashboardLayout>
      {/* Header */}
      <div className="mb-6">
        {selectedBusiness ? (
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBackToGrid}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border">
                {selectedBusiness.logoUrl ? (
                  <img
                    src={selectedBusiness.logoUrl}
                    alt={selectedBusiness.name}
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <Building2 className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{selectedBusiness.name}</h2>
                <p className="text-muted-foreground text-sm">
                  {businessInterests.length} investment inquiries
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Investment Inquiries CRM</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Select a business to manage their investment inquiries
            </p>
          </>
        )}
      </div>

      {/* Stats Cards - Always visible */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedBusiness ? businessInterests.length : globalStatusCounts.total}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Contacted</CardTitle>
            <div className="h-3 w-3 rounded-full bg-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedBusiness ? businessStatusCounts.NOT_CONTACTED : globalStatusCounts.NOT_CONTACTED}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interested</CardTitle>
            <div className="h-3 w-3 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedBusiness ? businessStatusCounts.INTERESTED : globalStatusCounts.INTERESTED}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Interested</CardTitle>
            <div className="h-3 w-3 rounded-full bg-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedBusiness ? businessStatusCounts.NOT_INTERESTED : globalStatusCounts.NOT_INTERESTED}
            </div>
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

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">{error}</p>
            <Button onClick={fetchAllData} variant="outline" className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {!isLoading && !error && (
        <>
          {/* GRID VIEW - Select Business */}
          {!selectedBusiness && (
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Select a Business
                    </CardTitle>
                    <CardDescription>
                      {businesses.length} businesses with investment inquiries
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search businesses..."
                        className="pl-10 w-[250px]"
                        value={businessSearch}
                        onChange={(e) => setBusinessSearch(e.target.value)}
                      />
                    </div>
                    <Button onClick={downloadCSV} variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Export All</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredBusinesses.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                    <p className="text-muted-foreground font-medium">
                      {businessSearch ? "No businesses match your search" : "No businesses with inquiries"}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {filteredBusinesses.map(renderBusinessCard)}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* DETAIL VIEW - Business Inquiries */}
          {selectedBusiness && (
            <Card>
              <CardHeader className="pb-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Investment Inquiries</CardTitle>
                    <CardDescription>Manage leads for {selectedBusiness.name}</CardDescription>
                  </div>
                  <Button onClick={downloadCSV} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as InterestStatus)}>
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="NOT_CONTACTED" className="text-xs sm:text-sm">
                      Not Contacted
                      <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
                        {businessStatusCounts.NOT_CONTACTED}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="INTERESTED" className="text-xs sm:text-sm">
                      Interested
                      <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
                        {businessStatusCounts.INTERESTED}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="NOT_INTERESTED" className="text-xs sm:text-sm">
                      Not Interested
                      <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
                        {businessStatusCounts.NOT_INTERESTED}
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                          {filteredInterests.map(renderInquiryGridCard)}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Add Follow-up Dialog */}
      <Dialog open={addFollowUpOpen} onOpenChange={setAddFollowUpOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Follow-up</DialogTitle>
            <DialogDescription>
              {selectedInterest && (
                <>
                  Adding follow-up for <strong>{selectedInterest.investorName}</strong>
                </>
              )}
            </DialogDescription>
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

      {/* Inquiry Detail Modal */}
      <Dialog open={selectedInterest !== null && !addFollowUpOpen && !editFollowUpOpen && !deleteFollowUpOpen} onOpenChange={(open) => !open && closeInquiryDetail()}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          {selectedInterest && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedInterest.investorName}</DialogTitle>
                    <DialogDescription>
                      Submitted on {format(parseISO(selectedInterest.submittedAt), "dd MMM yyyy, hh:mm a")}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <a href={`mailto:${selectedInterest.email}`} className="text-sm font-medium hover:underline">
                        {selectedInterest.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <a href={`tel:${selectedInterest.phoneNumber}`} className="text-sm font-medium hover:underline">
                        {selectedInterest.phoneNumber}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Message */}
                {selectedInterest.message && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Message</p>
                    <p className="text-sm">{selectedInterest.message}</p>
                  </div>
                )}

                {/* Source & Status Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Lead Source</label>
                    <Select
                      value={selectedInterest.source}
                      onValueChange={(value) => {
                        handleSourceChange(selectedInterest, value);
                        setSelectedInterest({ ...selectedInterest, source: value });
                      }}
                      disabled={updatingId === selectedInterest.id}
                    >
                      <SelectTrigger className="w-full">
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
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                    <Select
                      value={selectedInterest.status}
                      onValueChange={(value) => {
                        handleStatusChange(selectedInterest, value as InterestStatus);
                        setSelectedInterest({ ...selectedInterest, status: value as InterestStatus });
                      }}
                      disabled={updatingId === selectedInterest.id}
                    >
                      <SelectTrigger className={cn("w-full", STATUS_CONFIG[selectedInterest.status].color)}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NOT_CONTACTED">Not Contacted</SelectItem>
                        <SelectItem value="INTERESTED">Interested</SelectItem>
                        <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Follow-ups Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Follow-ups ({selectedInterest.followUps.length})
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAddFollowUpDialog(selectedInterest)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-[250px] overflow-y-auto">
                    {selectedInterest.followUps.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No follow-ups yet</p>
                    ) : (
                      selectedInterest.followUps.map((followUp) => (
                        <div
                          key={followUp.id}
                          className={cn(
                            "bg-muted/50 p-3 rounded-lg text-sm",
                            followUp.nextFollowUpDate &&
                              isToday(parseISO(followUp.nextFollowUpDate)) &&
                              "bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300"
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditFollowUpDialog(followUp, selectedInterest);
                                }}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDeleteFollowUpDialog(followUp, selectedInterest);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm mb-2">{followUp.remarks}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <span>Created: {format(parseISO(followUp.createdAt), "dd MMM yyyy")}</span>
                            {followUp.nextFollowUpDate && (
                              <Badge
                                variant={isToday(parseISO(followUp.nextFollowUpDate)) ? "default" : "secondary"}
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
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeInquiryDetail}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminPanelDashboardLayout>
  );
}
