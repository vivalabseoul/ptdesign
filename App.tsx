import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthModal } from "./components/AuthModal";

// Landing Pages
import { LandingPage } from "./pages/LandingPage";
import { AboutPage } from "./pages/AboutPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { PricingPage } from "./pages/PricingPage";
import { PricingDetailPage } from "./pages/PricingDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { CaseDetailPage } from "./pages/CaseDetailPage";

// Customer Pages
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { AnalysisReport } from "./pages/customer/AnalysisReport";

// Expert Pages
import { ExpertDashboard } from "./pages/expert/ExpertDashboard";
import { ExpertReview } from "./pages/expert/ExpertReview";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { GuidelineMaker } from "./pages/admin/GuidelineMaker";
import { MemberManagement } from "./pages/admin/MemberManagement";
import { ProjectManagement } from "./pages/admin/ProjectManagement";
import { PdfTemplatePreview } from "./pages/admin/PdfTemplatePreview";

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <AuthProvider onOpenAuthModal={openAuthModal}>
      <AppRoutes />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </AuthProvider>
  );
}

// Routes component to use auth context
function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/pricing-detail" element={<PricingDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/case-detail" element={<CaseDetailPage />} />

      {/* Customer Routes */}
      <Route
        path="/customer/dashboard"
        element={user?.role === "customer" || user?.role === "admin" ? <CustomerDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/customer/history"
        element={user?.role === "customer" || user?.role === "admin" ? <CustomerDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/customer/report/:id"
        element={(user?.role === "customer" || user?.role === "admin") ? <AnalysisReport /> : <Navigate to="/" />}
      />
      <Route
        path="/customer/analysis-report"
        element={<AnalysisReport />}
      />

      {/* Expert Routes */}
      <Route
        path="/expert/dashboard"
        element={user?.role === "expert" ? <ExpertDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/expert/review/:id"
        element={user?.role === "expert" ? <ExpertReview /> : <Navigate to="/" />}
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/guideline-maker"
        element={user?.role === "admin" ? <GuidelineMaker /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/members"
        element={user?.role === "admin" ? <MemberManagement /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/projects"
        element={user?.role === "admin" ? <ProjectManagement /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/pdf-preview"
        element={user?.role === "admin" ? <PdfTemplatePreview /> : <Navigate to="/" />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;