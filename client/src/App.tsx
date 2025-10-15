import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { OutputFormatProvider } from "@/components/OutputFormatProvider";
import Home from "@/pages/Home";
import Security from "@/pages/Security";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import ReportVulnerability from "@/pages/ReportVulnerability";
import SystemStatus from "@/pages/SystemStatus";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/security" component={Security} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />
      <Route path="/report-vulnerability" component={ReportVulnerability} />
      <Route path="/system-status" component={SystemStatus} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <OutputFormatProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </OutputFormatProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
