import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Copy, Check, Link2, MousePointerClick, ExternalLink, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout";
import { linkApi, analyticsApi, tokenManager } from "@/lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function Dashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [generatedQr, setGeneratedQr] = useState("");

  // Protect route
  useEffect(() => {
    const token = tokenManager.getToken();
    if (!token) {
      setLocation("/login");
    }
  }, [setLocation]);

  // Fetch global analytics
  const { data: globalAnalytics } = useQuery({
    queryKey: ["analytics", "global"],
    queryFn: () => analyticsApi.getGlobalAnalytics(),
    retry: false,
  });

  // Fetch user links
  const { data: linksData } = useQuery({
    queryKey: ["userLinks"],
    queryFn: linkApi.getUserLinks,
    retry: 1,
  });

  const analytics = globalAnalytics?.data;
  const links = linksData?.data?.links || [];
  const recentLinks = links.slice(0, 5);

  // Create link mutation
  const createLinkMutation = useMutation({
    mutationFn: (longURL: string) => linkApi.createShortLink({ longURL }),
    onSuccess: (response) => {
      if (response.data) {
        setGeneratedLink(response.data.shortURL || `${window.location.origin}/${response.data.slug}`);
        queryClient.invalidateQueries({ queryKey: ["userLinks"] });
        queryClient.invalidateQueries({ queryKey: ["analytics", "global"] });
        toast({
          title: "Link Generated!",
          description: "Your smart link is ready to share.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create link",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleShorten = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    createLinkMutation.mutate(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
    });
  };

  const handleGenerateQr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrUrl) return;
    setGeneratedQr(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrUrl}`);
  };

  // Prepare chart data
  const browserData = analytics?.browsers 
    ? Object.entries(analytics.browsers).map(([name, value]) => ({ name, value }))
    : [];

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview </p>
        </div>

        {/* Creation Section with Tabs */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-50 rounded-3xl -z-10" />
          <Card className="border-primary/10 shadow-lg shadow-primary/5 bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-2xl font-bold">Create & Generate</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="shorten" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="shorten" className="gap-2">
                    <Link2 className="w-4 h-4" /> Shorten Link
                  </TabsTrigger>
                  <TabsTrigger value="qr" className="gap-2">
                    <QrCode className="w-4 h-4" /> QR Code
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="shorten" className="mt-0">
                  <form onSubmit={handleShorten} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Destination URL</label>
                      <div className="flex gap-3">
                        <Input
                          placeholder="https://example.com/your-long-url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="flex-1 h-12"
                          disabled={createLinkMutation.isPending}
                        />
                        <Button 
                          type="submit" 
                          size="lg"
                          disabled={createLinkMutation.isPending || !url}
                          className="px-8 gap-2"
                        >
                          {createLinkMutation.isPending ? "Generating..." : "Shorten"}
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {generatedLink && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="pt-6 border-t border-border"
                        >
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-secondary/30 p-4 rounded-xl border border-secondary">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="text-sm text-muted-foreground">Your short link:</p>
                                <p className="text-lg font-bold text-primary tracking-tight">{generatedLink}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                              <Button variant="outline" className="flex-1 md:flex-none gap-2" onClick={handleCopy}>
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy"}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </TabsContent>

                <TabsContent value="qr" className="mt-0">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Destination URL</label>
                        <Input 
                          placeholder="https://example.com" 
                          className="h-12"
                          value={qrUrl}
                          onChange={(e) => setQrUrl(e.target.value)}
                        />
                      </div>
                      <Button 
                        onClick={handleGenerateQr}
                        className="w-full h-12 gap-2" 
                        disabled={!qrUrl}
                      >
                        <QrCode className="w-4 h-4" /> Generate QR Code
                      </Button>
                    </div>
                    
                    {generatedQr && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex-1 flex flex-col items-center justify-center"
                      >
                        <div className="bg-white p-4 rounded-lg shadow-lg">
                          <img src={generatedQr} alt="QR Code" className="w-64 h-64" />
                        </div>
                        <Button 
                          variant="outline" 
                          className="mt-4 gap-2"
                          onClick={async () => {
                            try {
                              const response = await fetch(generatedQr);
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = 'qr-code.png';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              window.URL.revokeObjectURL(url);
                              toast({
                                title: "QR Code Downloaded",
                                description: "Your QR code has been saved.",
                              });
                            } catch (error) {
                              toast({
                                title: "Download Failed",
                                description: "Could not download QR code. Please try again.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          Download QR Code
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>

      

        {/* Recent Links and Devices Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Links */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Links</CardTitle>
              <Link href="/my-links">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentLinks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No links created yet</p>
                  <p className="text-sm mt-1">Create your first short link above</p>
                </div>
              ) : (
                <div className="space-y-3">
                    {recentLinks.map((link: any) => {
                      const cleanUrl = link.longURL.replace(/^https?:\/\//, '');
                      const truncatedUrl = cleanUrl.length > 30 ? cleanUrl.substring(0, 30) + '...' : cleanUrl;
                      
                      return (
                        <div key={link._id} className="flex items-center justify-between py-7 px-3 rounded-lg border transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-[#6366f1]">
                                /{link.slug}
                              </p>
                              <Badge variant="secondary" className="text-xs shrink-0">
                                {link.clicksCount || 0} clicks
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {truncatedUrl}
                            </p>
                          </div>
                          <a href={`${window.location.origin}/${link.slug}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="sm" className="gap-2 shrink-0">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Devices Chart */}
          <div>
              {/* Quick Stats Cards */}
        <div className="grid grid-cols-1  gap-4 mb-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Links</CardTitle>
              <Link2 className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalLinks || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Short Links Created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
              <MousePointerClick className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalClicks || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All time engagements</p>
            </CardContent>
          </Card>
         
        </div>
         <Card>
            <CardHeader>
              <CardTitle>Devices</CardTitle>
            </CardHeader>
            <CardContent>
              {browserData.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No device data yet
                </div>
              ) : (
                <>
                  <div className="h-[200px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={browserData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {browserData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <span className="text-2xl font-bold block">{analytics?.totalClicks || 0}</span>
                        <span className="text-xs text-muted-foreground">Total</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {browserData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-xs text-muted-foreground">{entry.name}</span>
                        <span className="text-xs font-medium">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          </div>
         
        </div>
      </div>
    </Layout>
  );
}
