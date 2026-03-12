import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Index = lazy(() => import("./pages/Index"));
const Nieuws = lazy(() => import("./pages/Nieuws"));
const NieuwsDetail = lazy(() => import("./pages/NieuwsDetail"));
const Agenda = lazy(() => import("./pages/Agenda"));
const AgendaDetail = lazy(() => import("./pages/AgendaDetail"));
const Sponsors = lazy(() => import("./pages/Sponsors"));
const SponsorDetail = lazy(() => import("./pages/SponsorDetail"));
const OverLevy = lazy(() => import("./pages/OverLevy"));
const ClubVan100 = lazy(() => import("./pages/ClubVan100"));
const Media = lazy(() => import("./pages/Media"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
              Even geduld terwijl de pagina wordt geladen...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/nieuws" element={<Nieuws />} />
            <Route path="/nieuws/:year/:slug" element={<NieuwsDetail />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/agenda/:year/:slug" element={<AgendaDetail />} />
            <Route path="/sponsors" element={<Sponsors />} />
            <Route path="/sponsors/:slug" element={<SponsorDetail />} />
            <Route path="/sponsor/:slug" element={<SponsorDetail />} />
            <Route path="/over-levy" element={<OverLevy />} />
            <Route path="/club-van-100" element={<ClubVan100 />} />
            <Route path="/media" element={<Media />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
