import React, { useState } from 'react';
import { Play, Pause, Sparkles, CheckCircle2, ShoppingCart } from 'lucide-react';

export default function HeroVideoMockup() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'rotateY(-8deg) rotateX(4deg)',
    transition: 'transform 0.5s ease',
  });

  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = x - xc;
    const dy = y - yc;
    
    const rotateX = (dy / yc) * -20; // max tilt up/down 20 degrees
    const rotateY = (dx / xc) * 20;  // max tilt left/right 20 degrees
    
    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
      transition: 'transform 0.08s linear',
      boxShadow: `${-rotateY * 0.8}px ${rotateX * 0.8 + 20}px 45px rgba(0, 0, 0, 0.35)`,
      animation: 'none' // Disable floating animation on hover
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'rotateY(-8deg) rotateX(4deg)',
      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  return (
    <div className="hero-video-wrapper">
      <div className="hero-phone-3d-container">
        {/* Ambient Glow Rings */}
        <div className="ambient-glow glow-1" />
        <div className="ambient-glow glow-2" />

        {/* Floating Stat Badges around 3D Phone */}
        <div className="floating-badge badge-top-right">
          <Sparkles size={14} color="var(--green)" /> 100% Direct Payouts
        </div>

        <div className="floating-badge badge-bottom-left">
          <CheckCircle2 size={14} color="var(--red)" /> ₹0 Aggregator Fees
        </div>

        {/* 3D Phone Shell */}
        <div 
          className="phone-3d-shell"
          style={tiltStyle}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="phone-notch">
            <div className="camera-dot" />
            <div className="speaker-bar" />
          </div>

          <div className="phone-video-screen">
            {/* Animated Video Canvas Simulation */}
            <div className={`video-content-simulator ${isPlaying ? 'playing' : 'paused'}`}>
              <div className="sim-header">
                <span className="sim-title">Spice House • Direct Ordering</span>
                <span className="sim-url">order.spicehouse.com</span>
              </div>

              <div className="sim-video-body">
                <div className="sim-banner">
                  <h4>⚡ 0% Commission Direct Menu</h4>
                  <p>Order directly on WhatsApp & Pay via UPI</p>
                </div>

                <div className="sim-order-flow font-hand">
                  <div className="sim-step step-1">
                    <span className="sim-num">1</span> Customer Scans QR Code
                  </div>
                  <div className="sim-step step-2">
                    <span className="sim-num">2</span> Selects Butter Chicken & Naan
                  </div>
                  <div className="sim-step step-3">
                    <span className="sim-num">3</span> AI Agent Confirms Order
                  </div>
                  <div className="sim-step step-4">
                    <span className="sim-num">4</span> Instant UPI Money to Bank!
                  </div>
                </div>

                <div className="sim-animated-rider">
                  <div className="rider-icon">🛵</div>
                  <div className="rider-track">
                    <div className="rider-pulse" />
                  </div>
                  <span className="rider-text">Instant Delivery Dispatched</span>
                </div>
              </div>

              {/* Video Play/Pause overlay button */}
              <button
                className="video-control-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "Pause Preview" : "Play Preview"}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? "LIVE VIDEO DEMO" : "PAUSED"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
