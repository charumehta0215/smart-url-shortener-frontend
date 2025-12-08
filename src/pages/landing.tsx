import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Globe, Link as LinkIcon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { tokenManager } from "@/lib/api";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { SEO } from "@/components/seo";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const token = tokenManager.getToken();
    if (token) {
      setLocation("/dashboard");
    }
  }, [setLocation]);

  // Determine which images to use based on theme (use resolvedTheme for system preference)
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";
  const imageSuffix = isDark ? "-dark" : "-light";
  return (
    <>
      <SEO
        title="SmartShort - Free URL Shortener with Analytics & Custom Links"
        description="Create short links instantly with SmartShort. Track clicks, analyze traffic, and optimize your marketing campaigns with AI-powered insights. Free forever with custom URLs and QR codes."
        keywords="url shortener, link shortener, short url, custom link, qr code generator, link analytics, click tracking, bitly alternative, free url shortener, link management"
        canonical="https://qr-url.vercel.app/"
      />
      <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="container mx-auto px-4 h-20 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b border-border/50">
        <div className="flex items-center gap-2 text-primary font-bold text-2xl">
          <LinkIcon className="w-6 h-6" />
          <span>SmartShort</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {/* <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link> */}
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* <img src="https://localhost:8080/anibQhRl" alt="Image" /> */}


      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-secondary/30 rounded-full blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-30" />
          
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 text-primary text-sm font-medium mb-6 border border-secondary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                New: AI-Powered Link Analytics
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                Shorten URLs, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Amplify Reach.</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                The intelligent link management platform for modern marketing teams. Track clicks, analyze geolocation, and optimize your campaigns with AI-driven insights.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary/20 rounded-full">
                    Start for free <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
             
              </div>
            </motion.div>

            {/* Hero Image / Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-20 relative mx-auto max-w-5xl"
            >
              <div className="rounded-xl border border-border shadow-2xl overflow-hidden bg-card">
                <div className="h-12 bg-muted/50 border-b border-border flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="aspect-[16/9] bg-secondary/10 flex items-center justify-center text-muted-foreground">
                   {/* Dashboard preview with theme-aware images */}
                   {mounted ? (
                     <div className="w-full h-full p-8 grid grid-cols-3 gap-4">
                    {/*
                    <div className="col-span-1 bg-background rounded-lg h-full shadow-sm overflow-hidden">
                          <img 
                            src={`/assets/Images/left${imageSuffix}.png`} 
                            alt="Sidebar navigation" 
                            className="w-full h-full object-cover" 
                          />
                        </div> 
                       */}
                        <div className="col-span-3 flex flex-col gap-4">
                           <div className="hidden md:block h-32 bg-background rounded-lg shadow-sm overflow-hidden">
                             <img 
                               src={`/assets/Images/top${imageSuffix}.png`} 
                               alt="Top section" 
                               className="w-full h-full object-fill" 
                             />
                           </div>
                           <div className=" flex-1 grid md:grid-cols-2 gap-4">
                              <div className="bg-background rounded-lg shadow-sm overflow-hidden">
                                <img 
                                  src={`/assets/Images/center1${imageSuffix}.png`} 
                                  alt="Analytics chart" 
                                  className="w-full h-full object-fill" 
                                />
                              </div>
                              <div className="bg-background rounded-lg shadow-sm overflow-hidden">
                                <img 
                                  src={`/assets/Images/center2${imageSuffix}.png`} 
                                  alt="Statistics" 
                                  className="w-full h-full object-fill" 
                                />
                              </div>
                           </div>
                        </div>
                     </div>
                   ) : (
                     <div className="w-full h-full p-8 grid grid-cols-4 gap-4 opacity-50">
                        <div className="col-span-1 bg-background rounded-lg h-full shadow-sm" />
                        <div className="col-span-3 flex flex-col gap-4">
                           <div className="h-32 bg-background rounded-lg shadow-sm" />
                           <div className="flex-1 grid grid-cols-2 gap-4">
                              <div className="bg-background rounded-lg shadow-sm" />
                              <div className="bg-background rounded-lg shadow-sm" />
                           </div>
                        </div>
                     </div>
                   )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to grow</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Powerful features to help you understand your audience and optimize your links.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
                <p className="text-muted-foreground">Track clicks, referrers, and conversions in real-time with detailed reports.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Global Reach</h3>
                <p className="text-muted-foreground">Understand where your traffic is coming from with precise geolocation data.</p>
              </div>
              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">AI Insights</h3>
                <p className="text-muted-foreground">Get automated summaries and actionable recommendations powered by AI.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground text-sm">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <LinkIcon className="w-5 h-5" />
            <span>SmartShort</span>
          </div>
          <div className="flex items-center gap-8">
            <a 
              href="https://x.com/CharuMe56048468" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-all hover:scale-110 duration-200"
              aria-label="X (Twitter)"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href="https://github.com/charumehta0215" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-all hover:scale-110 duration-200"
              aria-label="GitHub"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/in/charu-mehta150/"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-all hover:scale-110 duration-200"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
          <p>SmartUrlShortener</p>
        </div>
      </footer>
    </div>
    </>
  );
}
