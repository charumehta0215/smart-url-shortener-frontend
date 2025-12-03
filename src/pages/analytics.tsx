import { useParams, Link as WouterLink, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { Globe, Sparkles, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout";
import { motion } from "framer-motion";
import { useMemo, useEffect } from "react";
import { analyticsApi, tokenManager } from "@/lib/api";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        {label && (
          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        )}
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{entry.value}</span> {entry.name || 'clicks'}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const params = useParams();
  const slug = params.slug as string | undefined;
  const [, setLocation] = useLocation();
  const isGlobal = !slug; // If no slug, show global analytics

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    const token = tokenManager.getToken();
    if (!token) {
      setLocation("/login");
    }
  }, [setLocation]);

  // Fetch per-link analytics
  const { data: linkAnalyticsData, isLoading: linkLoading, error: linkError } = useQuery({
    queryKey: ["analytics", slug],
    queryFn: () => analyticsApi.getAnalytics(slug!),
    enabled: !!slug,
    retry: false,
  });

  // Fetch global analytics
  const { data: globalAnalyticsData, isLoading: globalLoading, error: globalError } = useQuery({
    queryKey: ["analytics", "global"],
    queryFn: () => analyticsApi.getGlobalAnalytics(),
    enabled: isGlobal,
    retry: false,
  });

  const analyticsData = isGlobal ? globalAnalyticsData : linkAnalyticsData;
  const isLoading = isGlobal ? globalLoading : linkLoading;
  const error = isGlobal ? globalError : linkError;

  const analytics = analyticsData?.data;

  // Transform Data for Charts - MUST be before any returns
  const chartData = useMemo(() => {
    if (!analytics) return { clicksByDate: [], browsers: [], referrers: [], geo: [], topLinks: [] };
    
    const clicksByDateData = Object.entries(analytics.clicksByDate).map(([date, clicks]) => ({ date, clicks }));
    const browsersData = Object.entries(analytics.browsers).map(([name, value]) => ({ name, value }));
    const referrersData = Object.entries(analytics.referrers).map(([name, value]) => ({ name, value }));
    const geoData = Object.entries(analytics.geo).map(([country, value]) => ({ 
      country, 
      value, 
      percentage: (value / analytics.totalClicks) * 100 
    }));
    
    const topLinksData = isGlobal && (analytics as any).topLinks ? (analytics as any).topLinks : [];
    
    return {
      clicksByDate: clicksByDateData,
      browsers: browsersData,
      referrers: referrersData,
      geo: geoData,
      topLinks: topLinksData
    };
  }, [analytics, isGlobal]);

  // Calculate Top Performers - MUST be before any returns
  const topLocation = useMemo(() => {
    const sorted = [...chartData.geo].sort((a, b) => b.value - a.value);
    return sorted.length > 0 ? sorted[0] : { country: "N/A", value: 0 };
  }, [chartData.geo]);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

  // NOW we can do conditional returns
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    console.error("Analytics error:", error);
    const errorMessage = error instanceof Error ? error.message : "Server error occurred";
    const isNotFound = errorMessage.includes("Short Url not found");
    
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-destructive mb-2">
            {isNotFound ? "Link Not Found" : "Failed to load analytics"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {isNotFound 
              ? `The link "${slug}" doesn't exist or you don't have permission to view it.`
              : errorMessage
            }
          </p>
          <WouterLink href="/my-links">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Links
            </Button>
          </WouterLink>
        </div>
      </Layout>
    );
  }

  if (!analytics) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </Layout>
    );
  }

  const hasData = analytics.totalClicks > 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <WouterLink href="/dashboard" className="hover:text-primary transition-colors">Dashboard</WouterLink>
             <span>/</span>
             <span>Analytics</span>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-3xl font-bold tracking-tight">
                 {isGlobal ? "Global Analytics" : "Analytics"}
               </h1>
               {isGlobal ? (
                 <div className="flex items-center gap-2 mt-2">
                   <span className="text-sm text-muted-foreground"> Overview </span>
                   <Badge variant="secondary" className="font-semibold">
                     {(analytics as any).totalLinks} links
                   </Badge>
                   <Badge variant="secondary" className="font-semibold">
                     {analytics.totalClicks} total clicks
                   </Badge>
                 </div>
               ) : (
                 <p className="text-muted-foreground mt-1">
                   Overview for <span className="font-mono text-primary">{window.location.origin}/{slug}</span>
                 </p>
               )}
            </div>
          </div>
          
          {/* AI Summary Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900 rounded-lg p-4 flex items-start gap-4"
          >
             <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full shrink-0 text-blue-600 dark:text-blue-300">
                <Sparkles className="w-5 h-5" />
             </div>
             <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">AI Insights</h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-line leading-relaxed">
                   {analytics.aiSummary}
                </p>
             </div>
          </motion.div>
        </div>

        {/* Main Grid Layout - Only show if there's data */}
        {hasData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Performance Stats */}
          <div className="space-y-6">
             {/* Referrer Chart */}
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground">Total Engagements by referrer</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={chartData.referrers} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                            <XAxis type="number" hide />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              width={100} 
                              tick={{fontSize: 10}}
                              tickFormatter={(value) => {
                                const cleanUrl = value.replace(/^https?:\/\//, '');
                                const domain = cleanUrl.split('/')[0];
                                return domain.length > 15 ? domain.substring(0, 15) + '...' : domain;
                              }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </CardContent>
             </Card>
            

          </div>

          {/* Column 2: Middle Charts */}
          <div className="space-y-6">
             {/* Total Engagements Over Time */}
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground">Total Engagements over time</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={chartData.clicksByDate}>
                            <defs>
                               <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorClicks)" />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                </CardContent>
             </Card>

            
          </div>

          {/* Column 3: Device & Lists */}
          <div className="space-y-6">
             {/* Device Donut */}
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground">Engagements by device (Browsers)</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="h-[170px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                               data={chartData.browsers}
                               cx="50%"
                               cy="50%"
                               innerRadius={60}
                               outerRadius={80}
                               paddingAngle={5}
                               dataKey="value"
                            >
                               {chartData.browsers.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                               ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                         </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="text-center">
                            <span className="text-3xl font-bold block">{analytics.totalClicks}</span>
                            <span className="text-xs text-muted-foreground">Total</span>
                         </div>
                      </div>
                   </div>
                   {/* Legend */}
                   <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {chartData.browsers.map((entry, index) => (
                         <div key={index} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-xs text-muted-foreground">{entry.name}</span>
                            <span className="text-xs font-medium">{entry.value}</span>
                         </div>
                      ))}
                   </div>
                </CardContent>
             </Card>      
          </div>




             {/* Top Links (Global Analytics Only) */}
             <div className="space-y-6 ">
             {isGlobal && chartData.topLinks.length > 0 && (
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground">Top performing links</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                       {chartData.topLinks.slice(0, 5).map((link: any, index: number) => {
                         const cleanUrl = link.longURL.replace(/^https?:\/\//, '');
                         const truncatedUrl = cleanUrl.length > 20 ? cleanUrl.substring(0, 20) + '...' : cleanUrl;
                         
                         return (
                           <div key={link.slug} className="flex items-start justify-between text-sm gap-4">
                             <div className="flex items-start gap-2 flex-1 min-w-0">
                               <span className="text-xs text-muted-foreground w-4 mt-0.5">{index + 1}</span>
                               <div className="flex-1 min-w-0">
                                 <a 
                                   href={`${window.location.origin}/${link.slug}`}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="font-medium text-[#6366f1] mb-1 hover:underline block"
                                 >
                                   /{link.slug}
                                 </a>
                                 <a 
                                   href={link.longURL}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   className="text-xs text-muted-foreground truncate hover:text-foreground transition-colors block"
                                 >
                                   {truncatedUrl}
                                 </a>
                               </div>
                             </div>
                             <span className="font-bold text-[#6366f1] shrink-0">{link.clicks} clicks</span>
                           </div>
                         );
                       })}
                   </div>
                 </CardContent>
               </Card>
             )}
             </div>
          <div className="space-y-6 ">
             {/* Top Performing Location */}
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground">Top performing location</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="flex flex-col items-center text-center py-4">
                      <Globe className="w-8 h-8 text-primary mb-2" />
                      <h3 className="text-xl font-bold text-foreground">{topLocation.country}</h3>
                      <p className="text-sm text-muted-foreground">{topLocation.value} Engagements</p>
                   </div>
                </CardContent>
             </Card>
             
          </div>

          <div className="space-y-6 ">
            {/* Location List */}
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                   <CardTitle className="text-sm font-medium text-muted-foreground">Engagements by location</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="space-y-4">
                      <div className="flex justify-between text-xs text-muted-foreground border-b pb-2">
                         <span>Country</span>
                         <div className="flex gap-4">
                            <span>Engagements</span>
                            <span>%</span>
                         </div>
                      </div>
                      {chartData.geo.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          No location data available yet
                        </div>
                      ) : (
                        chartData.geo.map((item, index) => (
                         <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                               <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                               <span className="font-medium">{item.country}</span>
                            </div>
                            <div className="flex gap-8 text-right">
                               <span className="font-bold w-8">{item.value}</span>
                               <span className="text-muted-foreground w-8">{item.percentage.toFixed(1)}%</span>
                            </div>
                         </div>
                        ))
                      )}
                   </div>
                </CardContent>
             </Card>
          </div>

        </div>
        )}
      </div>
    </Layout>
  );
}
