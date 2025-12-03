import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import LandingPage from "@/pages/landing";
import MyLinks from "@/pages/my-links";
import RedirectPage from "@/pages/redirect";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={AuthPage} />
      <Route path="/register" component={AuthPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/my-links" component={MyLinks} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/analytics/:slug" component={Analytics} />
      <Route path="/:slug" component={RedirectPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
