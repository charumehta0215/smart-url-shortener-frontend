import { Link, useLocation } from "wouter";
import { LayoutDashboard, PieChart, Link as LinkIcon, LogOut, Plus, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { tokenManager, userManager } from "@/lib/api";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const user = userManager.getUser();

  const handleLogout = () => {
    tokenManager.removeToken();
    userManager.removeUser();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLocation("/login");
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
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border h-auto md:h-screen flex flex-col sticky top-0 z-10 transition-colors duration-300">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-2xl">
            <LinkIcon className="w-6 h-6" />
            <span>SmartShort</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard">
            <Button
              variant={location === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 font-medium"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/my-links">
            <Button
              variant={location === "/my-links" ? "secondary" : "ghost"}
              className="w-full justify-start gap-3 font-medium"
            >
              <Link2 className="w-4 h-4" />
              Links
            </Button>
          </Link>
          
          {/* Global Analytics */}
          <Link href="/analytics">
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
