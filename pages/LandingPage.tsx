import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Hero } from "../components/Hero";
import { BeforeAfter } from "../components/BeforeAfter";
import { ServiceFeatures } from "../components/ServiceFeatures";
import { DemoSection } from "../components/DemoSection";
import { ExpertTeam } from "../components/ExpertTeam";
import { Pricing } from "../components/Pricing";
import { FAQ } from "../components/FAQ";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";

export function LandingPage() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (data: { url: string; siteName: string }) => {
    setIsAnalyzing(true);
    // Placeholder - implement actual analysis logic
    console.log("Analyzing:", data);
    setIsAnalyzing(false);
  };

  return (
    <>
      <Navigation />
      <Hero
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
        isAuthenticated={false}
        onNavigateToDashboard={() => navigate("/dashboard")}
      />
      <BeforeAfter />
      <ServiceFeatures />
      <DemoSection />
      <ExpertTeam />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}