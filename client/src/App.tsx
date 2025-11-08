import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { OutputFormatProvider } from "@/components/OutputFormatProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SessionClearProvider } from "@/components/SessionClearProvider";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
import FloatingTimer from "@/components/FloatingTimer";
import Home from "@/pages/Home";
import Security from "@/pages/Security";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import ReportVulnerability from "@/pages/ReportVulnerability";
import SystemStatus from "@/pages/SystemStatus";
import NotFound from "@/pages/not-found";

function Router() {
  useInactivityTimer();

  return (
    <>
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
      <FloatingTimer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <OutputFormatProvider>
            <SessionClearProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </SessionClearProvider>
          </OutputFormatProvider>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
