import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import GtaGpt from "./pages/GtaGpt";
import GtaChrome from "./pages/GtaChrome";
import GtaQuiz from "./pages/GtaQuiz";
import GtaExam from "./pages/GtaExam";
import GtaSkills from "./pages/GtaSkills";
import MyBacklog from "./pages/analyst/MyBacklog";
import SkillsManagement from "./pages/manager/SkillsManagement";
import KnowledgeBase from "./pages/manager/KnowledgeBase";
import BacklogManagement from "./pages/manager/BacklogManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoutes() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Routes>
        {user.role === "analyst" && (
          <>
            <Route path="/" element={<GtaGpt />} />
            <Route path="/skills" element={<GtaSkills />} />
            <Route path="/training" element={<GtaQuiz />} />
            <Route path="/backlog" element={<MyBacklog />} />
          </>
        )}
        {user.role === "manager" && (
          <>
            <Route path="/manager/skills" element={<SkillsManagement />} />
            <Route path="/manager/backlog" element={<BacklogManagement />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
