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
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('menulink_admin_auth') === 'true';
  });

  useEffect(() => {
    // Sync with window location hash & pathname (/admin, /admin/dashboard, #admin, etc.)
    const handleHash = () => {
      const hash = window.location.hash || '';
      const path = window.location.pathname || '';
      if (hash.includes('admin') || path.startsWith('/admin')) {
        setRoute('admin');
      } else {
        setRoute('home');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handleHash);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handleHash);
    };
  }, []);

  const handleNavigate = (targetRoute) => {
    setRoute(targetRoute);
    if (targetRoute === 'admin') {
      window.location.hash = 'admin';
    } else {
      if (window.location.hash.includes('admin')) {
        window.location.hash = '';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('menulink_admin_auth', 'true');
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('menulink_admin_auth');
    setRoute('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
