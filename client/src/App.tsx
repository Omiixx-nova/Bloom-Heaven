import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import CreateBouquet from "@/pages/CreateBouquet";
import CreateMessage from "@/pages/CreateMessage";
import PublicView from "@/pages/PublicView";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login">
        <AuthPage mode="login" />
      </Route>
      <Route path="/register">
        <AuthPage mode="register" />
      </Route>
      
      {/* Protected Routes (Auth check inside components for simpler routing logic) */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/create" component={CreateBouquet} />
      <Route path="/bouquet/:id/message" component={CreateMessage} />
      
      {/* Public Routes */}
      <Route path="/scan/:id" component={PublicView} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Navigation />
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
