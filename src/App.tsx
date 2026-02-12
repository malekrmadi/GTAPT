import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import GtaGpt from "./pages/GtaGpt";
import GtaChrome from "./pages/GtaChrome";
import GtaQuiz from "./pages/GtaQuiz";
import GtaExam from "./pages/GtaExam";
import Dashboard from "./pages/Dashboard";
import MyTickets from "./pages/MyTickets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<GtaGpt />} />
            <Route path="/chrome" element={<GtaChrome />} />
            <Route path="/quiz" element={<GtaQuiz />} />
            <Route path="/exam" element={<GtaExam />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<MyTickets />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
