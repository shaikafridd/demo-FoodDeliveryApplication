import React from 'react';

export default function Navbar({ onNavigate }) {
  const handleNavClick = (e, targetId) => {
    if (onNavigate) {
      onNavigate('home');
    }
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav>
      <div 
        className="logo" 
        onClick={(e) => handleNavClick(e, 'hero')} 
        style={{ cursor: 'pointer' }}
      >
        <div className="logo-mark">M</div>
        <span>MenuLink</span>
      </div>
      <div className="nav-links">
        <a href="#works" onClick={(e) => handleNavClick(e, 'works')}>How It Works</a>
        <a href="#compare" onClick={(e) => handleNavClick(e, 'compare')}>Pricing</a>
        <a href="#biz" onClick={(e) => handleNavClick(e, 'biz')}>For Restaurants</a>
        <a href="#demo" onClick={(e) => handleNavClick(e, 'demo')}>Live Demo</a>
      </div>
      <div className="nav-actions">
        <a className="btn-start" href="#register" onClick={(e) => handleNavClick(e, 'register')}>
          Start Free
        </a>
      </div>
    </nav>
  );
}
