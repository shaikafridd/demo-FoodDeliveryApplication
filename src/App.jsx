import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LogoMarquee from './components/LogoMarquee';
import ValuePropPills from './components/ValuePropPills';
import IntegrationsMarquee from './components/IntegrationsMarquee';
import StatsBar from './components/StatsBar';
import SavingsCalculator from './components/SavingsCalculator';
import StickyStackingFeatures from './components/StickyStackingFeatures';
import AggregatorCostVisualizer from './components/AggregatorCostVisualizer';
import ComparisonTable from './components/ComparisonTable';
import HowItWorks from './components/HowItWorks';
import BusinessTypes from './components/BusinessTypes';
import ChatDemoSection from './components/ChatDemoSection';
import RegistrationSection from './components/RegistrationSection';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import FloatingQuickWidget from './components/FloatingQuickWidget';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <LogoMarquee />
        <ValuePropPills />
        <IntegrationsMarquee />
        <StatsBar />
        <StickyStackingFeatures />
        <SavingsCalculator />
        <AggregatorCostVisualizer />
        <ComparisonTable />
        <HowItWorks />
        <BusinessTypes />
        <ChatDemoSection />
        <RegistrationSection />
        <FinalCTA />
      </main>
      <Footer />
      <FloatingQuickWidget />
    </div>
  );
}
