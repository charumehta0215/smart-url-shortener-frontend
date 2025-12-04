import { Link, useLocation } from "wouter";
import { LayoutDashboard, PieChart, Link as LinkIcon, LogOut, Plus, Link2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { tokenManager, userManager } from "@/lib/api";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const user = userManager.getUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    tokenManager.removeToken();
    userManager.removeUser();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLocation("/login");
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Get user initials for avatar from email
  const getInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans transition-colors duration-300">
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden sticky top-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <LinkIcon className="w-5 h-5" />
          <span>SmartShort</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="h-9 w-9"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 md:z-10
        w-64 bg-card border-r border-border h-screen flex flex-col
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-2xl">
            <LinkIcon className="w-6 h-6" />
            <span>SmartShort</span>
          </div>
          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={closeSidebar}
            className="md:hidden h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" onClick={closeSidebar}>
            <Button
              variant={location === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 font-medium"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/my-links" onClick={closeSidebar}>
            <Button
              variant={location === "/my-links" ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 font-medium"
            >
              <Link2 className="w-4 h-4" />
              Links
            </Button>
          </Link>
          
          {/* Global Analytics */}
          <Link href="/analytics" onClick={closeSidebar}>
            <Button
              variant={location.startsWith("/analytics") ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 font-medium"
            >
              <PieChart className="w-4 h-4" />
              Analytics
            </Button>
          </Link>
          {/* <div className="pt-4 mt-4 border-t border-border">
            <Link href="/dashboard">
              <Button className="w-full gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> Create New
              </Button>
            </Link>
          </div> */}
        </nav>

        <div className="p-4 border-t border-border space-y-4">
           <div className="flex items-center justify-between px-2">
              <span className="text-xs font-medium text-muted-foreground">Theme</span>
              <ThemeToggle />
           </div>
           
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {getInitials()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background transition-colors duration-300">
        <div className="container mx-auto p-4 md:p-8 max-w-6xl animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
