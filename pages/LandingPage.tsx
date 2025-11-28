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
  return (
    <>
      <Navigation />
      <Hero />
      <BeforeAfter />
      <DemoSection />      
      <ServiceFeatures />
      <ExpertTeam />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}