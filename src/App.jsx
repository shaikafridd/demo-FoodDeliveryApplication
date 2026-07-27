import React, { useState, useEffect } from 'react';
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
import AdminLogin from './components/AdminLogin';
import AdminPortal from './components/AdminPortal';

export default function App() {
  const [route, setRoute] = useState('home'); // 'home' | 'admin'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Sync with window location hash (#admin or /admin)
    const handleHash = () => {
      if (window.location.hash === '#admin' || window.location.pathname === '/admin') {
        setRoute('admin');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (targetRoute) => {
    setRoute(targetRoute);
    if (targetRoute === 'admin') {
      window.location.hash = 'admin';
    } else {
      window.location.hash = '';
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setRoute('home');
    window.location.hash = '';
  };

  if (route === 'admin') {
    return (
      <div className="app-container">
        {isAdminAuthenticated ? (
          <AdminPortal onLogout={handleLogout} />
        ) : (
          <AdminLogin 
            onLoginSuccess={handleLoginSuccess} 
            onBackToHome={() => handleNavigate('home')} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar onNavigate={handleNavigate} currentRoute={route} />
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
