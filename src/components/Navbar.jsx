import React from 'react';

export default function Navbar({ onNavigate, currentRoute }) {
  return (
    <nav>
      <div className="logo" onClick={() => onNavigate && onNavigate('home')} style={{ cursor: 'pointer' }}>
        <div className="logo-mark">M</div>
        <span>MenuLink</span>
      </div>
      <div className="nav-links">
        <a href="#works" onClick={() => onNavigate && onNavigate('home')}>How It Works</a>
        <a href="#compare" onClick={() => onNavigate && onNavigate('home')}>Pricing</a>
        <a href="#biz" onClick={() => onNavigate && onNavigate('home')}>For Restaurants</a>
        <a href="#demo" onClick={() => onNavigate && onNavigate('home')}>Live Demo</a>
      </div>
      <div className="nav-actions">
        <button 
          className="btn-admin-nav" 
          onClick={() => onNavigate && onNavigate('admin')}
        >
          🔐 Admin Portal
        </button>
        <a className="btn-start" href="#register" onClick={() => onNavigate && onNavigate('home')}>
          Get Started
        </a>
      </div>
    </nav>
  );
}
