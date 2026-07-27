import React from 'react';

export default function Navbar() {
  return (
    <nav>
      <div className="logo">
        <div className="logo-mark">M</div>
        <span>MenuLink</span>
      </div>
      <div className="nav-links">
        <a href="#works">How It Works</a>
        <a href="#compare">Pricing</a>
        <a href="#biz">For Restaurants</a>
      </div>
      <div className="nav-actions">
        <a className="btn-login" href="#login" onClick={(e) => { e.preventDefault(); alert("Login feature available soon!"); }}>Login</a>
        <a className="btn-start" href="#demo">Start Free</a>
      </div>
    </nav>
  );
}
