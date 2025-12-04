import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  QrCode,
  ExternalLink,
  BarChart2,
  Search,
  Calendar,
  ChevronDown,
  ChevronUp,
  Trash2,
  Check,
  Edit2,
  Share2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
const DialogPortal = DialogPrimitive.Portal;
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout";
import { linkApi, tokenManager } from "@/lib/api";

export default function MyLinks() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    const token = tokenManager.getToken();
    if (!token) {
      setLocation("/login");
    }
  }, [setLocation]);
  
  // Edit modal state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editSlug, setEditSlug] = useState("");
  const [editUrl, setEditUrl] = useState("");
  
  // Delete modal state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingLink, setDeletingLink] = useState<any>(null);
  
  // Share modal state
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [sharingLink, setSharingLink] = useState<any>(null);

  // Check if user is authenticated
  const token = tokenManager.getToken();
  if (!token) {
    setLocation("/login");
    return null;
  }

  // Fetch user links
  const { data: linksData, isLoading, error } = useQuery({
    queryKey: ["userLinks"],
    queryFn: linkApi.getUserLinks,
    retry: 1,
  });

  // Handle authentication errors
  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("401") || errorMessage.includes("authentication")) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your links.",
        variant: "destructive",
      });
      setTimeout(() => setLocation("/login"), 1500);
    } else {
      toast({
        title: "Error loading links",
        description: errorMessage || "Failed to fetch your links. Please try again.",
        variant: "destructive",
      });
    }
  }

  const links = linksData?.data?.links || [];

  const handleCopy = (shortURL: string, id: string) => {
    navigator.clipboard.writeText(shortURL);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({
      title: "Copied to clipboard",
      description: shortURL,
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleEditClick = (link: any) => {
    setEditSlug(link.slug);
    setEditUrl(link.longURL);
    setDeletingLink(link); // Store the original link for reference
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editSlug || !deletingLink) return;
    
    // Check if slug actually changed
    if (editSlug === deletingLink.slug) {
      toast({
        title: "No changes",
        description: "The slug is the same as before",
        variant: "destructive",
      });
      return;
    }

    try {
      await linkApi.updateLink(deletingLink.slug, { newSlug: editSlug });
      
      toast({
        title: "Link updated",
        description: `Successfully updated to ${window.location.origin}/${editSlug}`,
      });
      
      // Refetch links
      queryClient.invalidateQueries({ queryKey: ["userLinks"] });
      
      setEditDialogOpen(false);
      setDeletingLink(null);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update link",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (link: any) => {
    setDeletingLink(link);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLink) return;

    try {
      await linkApi.deleteLink(deletingLink.slug);
      
      toast({
        title: "Link deleted",
        description: `${window.location.origin}/${deletingLink.slug} has been deleted`,
        variant: "destructive",
      });
      
      // Refetch links
      queryClient.invalidateQueries({ queryKey: ["userLinks"] });
      
      setDeleteDialogOpen(false);
      setDeletingLink(null);
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete link",
        variant: "destructive",
      });
    }
  };

  const handleShare = (link: any) => {
    setSharingLink(link);
    setShareDialogOpen(true);
  };

  const handleSocialShare = (platform: string) => {
    if (!sharingLink) return;
    
    const shortURL = `${window.location.origin}/${sharingLink.slug}`;
    const text = `Check out this link: ${sharingLink.longURL}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shortURL)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortURL)}`;
        break;
      case 'gmail':
        shareUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent('Check out this link')}&body=${encodeURIComponent(text + '\n\n' + shortURL)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shortURL)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shortURL);
        toast({
          title: "Link copied",
          description: "Link copied to clipboard",
        });
        setShareDialogOpen(false);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setShareDialogOpen(false);
    }
  };

  // Date filtering helper
  const isWithinDateRange = (createdAt: string) => {
    // If no date filter or "all", show everything
    if (dateFilter === "all") return true;
    
    // If link has no createdAt, show it in "all" only
    if (!createdAt) return false;
    
    const linkDate = new Date(createdAt);
    const now = new Date();
    
    switch (dateFilter) {
      case "today":
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return linkDate >= today;
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return linkDate >= weekAgo;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return linkDate >= monthAgo;
      default:
        return true;
    }
  };

  const filteredLinks = links.filter((link: any) => {
    const matchesSearch = link.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.longURL.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = isWithinDateRange(link.createdAt);
    return matchesSearch && matchesDate;
  });

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load links. Please try again.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              My Links {!isLoading && <span className="text-muted-foreground text-2xl">({links.length})</span>}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your shortened URLs
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Links"
                className="pl-10 h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as "all" | "today" | "week" | "month")}
                className="h-10 pl-10 pr-8 py-2 rounded-md border border-input bg-card text-foreground text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none cursor-pointer min-w-[160px]"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
              <ChevronDown className="absolute right-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Links List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground mt-4">Loading your links...</p>
            </Card>
          ) : filteredLinks.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No links found matching your search.</p>
            </Card>
          ) : (
            filteredLinks.map((link: any) => (
              <Card
                key={link._id}
                className="group hover:border-primary/50 transition-all overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Main Card Content */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col gap-4">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <a 
                                href={`${window.location.origin}/${link.slug}?source=internal`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-base sm:text-lg text-foreground hover:text-primary transition-colors break-all"
                              >
                                {window.location.host}/{link.slug}
                              </a>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground break-all">
                              {link.longURL}
                            </p>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {new Date(link.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(link)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit2 size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(link)}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-muted-foreground mb-4">
                          <span className="flex items-center gap-1.5 text-primary">
                            <BarChart2 className="w-4 h-4" />
                            {link.clicksCount.toLocaleString()} clicks
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            Created {new Date(link.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-xs sm:text-sm"
                            onClick={() => handleCopy(`${window.location.origin}/${link.slug}`, link._id)}
                          >
                            {copiedId === link._id ? (
                              <>
                                <Check className="w-3 h-3 sm:w-4 sm:h-4" /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 sm:w-4 sm:h-4" /> Copy
                              </>
                            )}
                          </Button>

                          <Button
                            variant="default"
                            size="sm"
                            className="gap-2 text-xs sm:text-sm"
                            onClick={() => setLocation(`/analytics/${link.slug}`)}
                          >
                            <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4" /> Analytics
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-xs sm:text-sm"
                            onClick={() => window.open(link.longURL, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" /> Visit
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-xs sm:text-sm"
                            onClick={() => handleShare(link)}
                          >
                            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" /> Share
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 col-span-2 sm:col-span-1 sm:ml-auto text-xs sm:text-sm"
                            onClick={() => toggleExpand(link._id)}
                          >
                            {expandedId === link._id ? (
                              <>
                                <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" /> More
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedId === link._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 border-t border-border/50">
                          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                            {/* Left Column - Details */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold text-foreground mb-3">
                                  Link Details
                                </h4>
                                <div className="space-y-3 text-xs sm:text-sm">
                                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 py-2 border-b border-border/50">
                                    <span className="text-muted-foreground">Short URL:</span>
                                    <a 
                                      href={`${window.location.origin}/${link.slug}?source=internal`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-medium text-primary hover:underline break-all"
                                    >
                                      {window.location.origin}/{link.slug}
                                    </a>
                                  </div>
                                  <div className="flex justify-between py-2 border-b border-border/50">
                                    <span className="text-muted-foreground">Total Clicks:</span>
                                    <span className="font-medium">{link.clicksCount.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between py-2">
                                    <span className="text-muted-foreground">Created:</span>
                                    <span className="font-medium">{new Date(link.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-foreground mb-3">
                                  Original URL
                                </h4>
                                <div className="bg-secondary/30 p-3 rounded-lg text-xs break-all">
                                  {link.longURL}
                                </div>
                              </div>
                            </div>

                            {/* Right Column - QR Code & Actions */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-semibold text-foreground mb-3">
                                  QR Code
                                </h4>
                                <div className="bg-white p-4 rounded-lg  shadow-sm flex justify-center item-center">
                                  <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.origin}/${link.slug}?source=internal`}
                                    alt="QR Code"
                                    className="w-32 h-32"
                                  />
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full mt-3 gap-2"
                                  onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${window.location.origin}/${link.slug}?source=internal`, '_blank')}
                                >
                                  <QrCode className="w-4 h-4" /> Download QR Code
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Edit Link Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Link</DialogTitle>
              <DialogDescription>
                Update your shortened link details below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-slug" className="text-sm font-medium">
                  Short URL Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{window.location.origin}/</span>
                  <Input
                    id="edit-slug"
                    value={editSlug}
                    onChange={(e) => setEditSlug(e.target.value)}
                    placeholder="your-slug"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-url" className="text-sm font-medium text-muted-foreground">
                  Destination URL (Read-only)
                </label>
                <Input
                  id="edit-url"
                  value={editUrl}
                  disabled
                  className="bg-secondary/50 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Note: Only the short URL slug can be updated. The destination URL cannot be changed.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="max-w-sm p-4">
            <AlertDialogHeader className="space-y-1">
              <AlertDialogTitle className="text-base">Delete Link?</AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                Delete <span className="font-medium text-foreground">/{deletingLink?.slug}</span>? This can't be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 mt-3">
              <AlertDialogCancel className="m-0 h-9">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 m-0 h-9"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogPortal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-900 p-8 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-3xl">
              <button
                onClick={() => setShareDialogOpen(false)}
                className="absolute right-6 top-6 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Share Link</h2>
                  <p className="text-sm text-muted-foreground">Spread the word about this link!</p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">Shareable Link</label>
                  <div className="flex gap-2">
                    <div className="flex-1 px-4 py-3 bg-secondary/50 rounded-lg text-sm text-foreground truncate">
                      {window.location.origin}/{sharingLink?.slug}
                    </div>
                    <Button
                      onClick={() => handleSocialShare('copy')}
                      className="px-6"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* <label className="text-sm font-semibold text-foreground">Share via</label> */}
                  <div className="flex items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleSocialShare('whatsapp')}
                        className="w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                      >
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-[#25D366]">WhatsApp</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleSocialShare('linkedin')}
                        className="w-16 h-16 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                      >
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-[#0A66C2]">LinkedIn</span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleSocialShare('twitter')}
                        className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                      >
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-black">X</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => handleSocialShare('gmail')}
                        className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                      >
                        <svg className="w-9 h-9" viewBox="0 0 256 193" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#4285F4" d="M58.182 192.05V93.14L27.507 65.077 0 49.504v125.091c0 9.658 7.825 17.455 17.455 17.455h40.727Z"/>
                          <path fill="#34A853" d="M197.818 192.05h40.727c9.659 0 17.455-7.826 17.455-17.455V49.505l-31.156 17.837-27.026 25.798v98.91Z"/>
                          <path fill="#EA4335" d="m58.182 93.14-4.174-38.647 4.174-36.989L128 69.868l69.818-52.364 4.669 34.992-4.669 40.644L128 145.504z"/>
                          <path fill="#FBBC04" d="M197.818 17.504V93.14L256 49.504V26.231c0-21.585-24.64-33.89-41.89-20.945l-16.292 12.218Z"/>
                          <path fill="#C5221F" d="m0 49.504 26.759 20.07L58.182 93.14V17.504L41.89 5.286C24.61-7.66 0 4.646 0 26.23v23.273Z"/>
                        </svg>
                      </button>
                      <span className="text-sm font-medium text-[#EA4335]">Gmail</span>
                    </div>
                  </div>
                </div>

              </div>
            </DialogPrimitive.Content>
          </DialogPortal>
        </Dialog>
      </div>
    </Layout>
  );
}
