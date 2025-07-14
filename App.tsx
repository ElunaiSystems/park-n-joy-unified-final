import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MapScreen from "./screens/MapScreen";
import TripPlannerScreen from "./screens/TripPlannerScreen";
import EmergencyScreen from "./screens/EmergencyScreen";
import ReferralScreen from "./screens/ReferralScreen";
import ModeratorScreen from "./screens/ModeratorScreen";
import FindStopsScreen from "./screens/FindStopsScreen";
import StadiumFinderScreen from "./screens/StadiumFinderScreen";
import ContributorScreen from "./screens/ContributorScreen";
import HotelCampgroundScreen from "./screens/HotelCampgroundScreen";
import AdminScreen from "./screens/AdminScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/plan" element={<TripPlannerScreen />} />
          <Route path="/emergency" element={<EmergencyScreen />} />
          <Route path="/share" element={<ReferralScreen />} />
          <Route path="/find-stops" element={<FindStopsScreen />} />
          <Route path="/stadium-finder" element={<StadiumFinderScreen />} />
          <Route path="/contribute" element={<ContributorScreen />} />
          <Route path="/hotels-camping" element={<HotelCampgroundScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
