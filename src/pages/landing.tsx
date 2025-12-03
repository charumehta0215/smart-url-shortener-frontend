import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BarChart2, Globe, Link as LinkIcon, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { tokenManager } from "@/lib/api";
import { useEffect } from "react";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  // Check if user is already logged in
  useEffect(() => {
    const token = tokenManager.getToken();
    if (token) {
      setLocation("/dashboard");
    }
  }, [setLocation]);
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="container mx-auto px-4 h-20 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b border-border/50">
        <div className="flex items-center gap-2 text-primary font-bold text-2xl">
          <LinkIcon className="w-6 h-6" />
          <span>SmartShort</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
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
                   {/* Abstract representation of dashboard */}
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
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Features</a>
            <a href="#" className="hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
          <p>© 2024 SmartShort Inc.</p>
        </div>
      </footer>
    </div>
  );
}
