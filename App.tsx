import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthModal } from "./components/AuthModal";

// Landing Pages
import { LandingPage } from "./pages/LandingPage";
import { AboutPage } from "./pages/AboutPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { PricingPage } from "./pages/PricingPage";
import { PricingDetailPage } from "./pages/PricingDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { CaseDetailPage } from "./pages/CaseDetailPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";

// Legal Pages
import { TermsOfService } from "./pages/legal/TermsOfService";
import { PrivacyPolicy } from "./pages/legal/PrivacyPolicy";
import { CookiePolicy } from "./pages/legal/CookiePolicy";

// Payment Pages
import { PaymentSuccessPage } from "./pages/payment/PaymentSuccessPage";
import { PaymentFailPage } from "./pages/payment/PaymentFailPage";

// Customer Pages
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { AnalysisReport } from "./pages/customer/AnalysisReport";
import { PaymentHistory } from "./pages/customer/PaymentHistory";
import { SubscriptionManagement } from "./pages/customer/SubscriptionManagement";

// Expert Pages
import { ExpertDashboard } from "./pages/expert/ExpertDashboard";
import { ExpertReview } from "./pages/expert/ExpertReview";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { GuidelineMaker } from "./pages/admin/GuidelineMaker";
import { MemberManagement } from "./pages/admin/MemberManagement";
import { MemberDetail } from "./pages/admin/MemberDetail";
import { MemberUsage } from "./pages/admin/MemberUsage";
import { ProjectManagement } from "./pages/admin/ProjectManagement";
import { PdfTemplatePreview } from "./pages/admin/PdfTemplatePreview";
import { PricingTierSamples } from "./pages/admin/PricingTierSamples";

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  const openAuthModal = (mode: "login" | "signup" = "login") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <LanguageProvider>
      <AuthProvider onOpenAuthModal={openAuthModal}>
        <AppRoutes />

        {/* Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authModalMode}
        />
      </AuthProvider>
    </LanguageProvider>
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
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/case-detail" element={<CaseDetailPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* Legal Pages */}
      <Route path="/legal/terms" element={<TermsOfService />} />
      <Route path="/legal/privacy" element={<PrivacyPolicy />} />
      <Route path="/legal/cookies" element={<CookiePolicy />} />

      {/* Payment Pages */}
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/fail" element={<PaymentFailPage />} />

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
      <Route
        path="/customer/payment-history"
        element={user?.role === "customer" || user?.role === "admin" ? <PaymentHistory /> : <Navigate to="/" />}
      />
      <Route
        path="/customer/subscription"
        element={user?.role === "customer" || user?.role === "admin" ? <SubscriptionManagement /> : <Navigate to="/" />}
      />

      {/* Expert Routes */}
      <Route
        path="/expert/dashboard"
        element={user?.role === "expert" || user?.role === "admin" ? <ExpertDashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/expert/review/:id"
        element={user?.role === "expert" || user?.role === "admin" ? <ExpertReview /> : <Navigate to="/" />}
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
        path="/admin/member/:id"
        element={user?.role === "admin" ? <MemberDetail /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/member-usage"
        element={user?.role === "admin" ? <MemberUsage /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/projects"
        element={user?.role === "admin" ? <ProjectManagement /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/pdf-preview"
        element={user?.role === "admin" ? <PdfTemplatePreview /> : <Navigate to="/" />}
      />
      <Route
        path="/admin/pricing-samples"
        element={user?.role === "admin" ? <PricingTierSamples /> : <Navigate to="/" />}
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;