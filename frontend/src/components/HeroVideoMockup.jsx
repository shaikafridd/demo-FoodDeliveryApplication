import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Check } from 'lucide-react';

const STEPS_DATA = [
  {
    title: "1. Scan Menu QR Code",
    subtitle: "Instantly browse the digital menu"
  },
  {
    title: "2. Choose Food Item",
    subtitle: "Select Butter Chicken Combo (₹280)"
  },
  {
    title: "3. Direct WhatsApp Chat",
    subtitle: "AI confirms your items instantly"
  },
  {
    title: "4. Zero-Fee UPI Payment",
    subtitle: "Paid directly to bank account"
  },
  {
    title: "5. Dispatched Immediately",
    subtitle: "Delivery dispatched with tracking"
  }
];

export default function HeroVideoMockup() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'rotateY(-8deg) rotateX(4deg)',
    transition: 'transform 0.5s ease',
  });

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 5);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = x - xc;
    const dy = y - yc;
    
    const rotateX = (dy / yc) * -20;
    const rotateY = (dx / xc) * 20;
    
    setTiltStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
      transition: 'transform 0.08s linear',
      boxShadow: `${-rotateY * 0.8}px ${rotateX * 0.8 + 20}px 45px rgba(0, 0, 0, 0.35)`,
      animation: 'none'
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
            {/* Top Indicator / Segment Progress Bars */}
            <div className="sim-progress-bar">
              {[0, 1, 2, 3, 4].map((stepIdx) => (
                <div key={stepIdx} className="sim-progress-segment">
                  <div 
                    className={`sim-progress-fill ${
                      stepIdx === currentStep && isPlaying ? 'active' : ''
                    } ${stepIdx < currentStep ? 'completed' : ''}`}
                    style={{
                      transitionDuration: stepIdx === currentStep && isPlaying ? '3.5s' : '0s'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* URL/Browser Bar Simulation */}
            <div className="sim-header">
              <span className="sim-title">{STEPS_DATA[currentStep].title}</span>
              <span className="sim-url">{STEPS_DATA[currentStep].subtitle}</span>
            </div>

            {/* Main Screen Canvas */}
            <div className="sim-screen-content">
              {currentStep === 0 && (
                <div className="sim-phase">
                  <div className="qr-container">
                    <div className="qr-box">
                      <div className="qr-dots" />
                      <div className="scan-line" />
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '0.7rem', fontWeight: 800, textAlign: 'center' }}>
                      Scan QR to Order
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="sim-phase">
                  <div className="sim-cart-header">
                    <span>🛒 Shopping Cart</span>
                    <span className="cart-indicator">1</span>
                  </div>
                  <div className="menu-sim-card">
                    <div className="menu-sim-img">🍗🍛</div>
                    <div className="menu-sim-details">
                      <div>
                        <h4>Butter Chicken Combo</h4>
                        <span>₹280</span>
                      </div>
                      <button className="btn-sim-add">
                        Added
                      </button>
                    </div>
                  </div>
                  <div className="sim-cursor" />
                </div>
              )}

              {currentStep === 2 && (
                <div className="sim-phase" style={{ gap: '6px' }}>
                  <div className="wa-sim-chat">
                    <div style={{ fontSize: '0.62rem', color: 'var(--green)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--line)', paddingBottom: '4px', marginBottom: '4px' }}>
                      WhatsApp Business AI
                    </div>
                    <div className="wa-sim-bubble user">
                      I want to order Butter Chicken Combo! 🍛
                    </div>
                    <div className="wa-sim-bubble bot">
                      Awesome choice! 🍗 1x Butter Chicken Combo. Total ₹280. Click this link to pay instantly via UPI.
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="sim-phase">
                  <div className="upi-sim-card">
                    <div className="upi-checkmark-wrapper">
                      <Check size={28} strokeWidth={3} />
                    </div>
                    <span className="upi-amount-txt">₹280.00</span>
                    <span className="upi-status-txt">Payment Successful</span>
                    <div style={{ background: '#eff6ee', border: '1px solid #b5d6b2', padding: '4px 10px', borderRadius: '12px', fontSize: '0.62rem', fontWeight: 800, color: 'var(--green)', marginTop: '10px' }}>
                      🎉 ₹0 Commission Charged
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="sim-phase">
                  <div className="dispatch-sim-box">
                    <div className="road-track-sim">
                      <div className="scooter-sim-sprite">🛵</div>
                    </div>
                    <div className="delivery-sim-banner">
                      <h5>Instant Payout & Dispatch</h5>
                      <p>Food is cooked & rider dispatched immediately!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Play/Pause overlay button */}
            <button
              className="video-control-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause Preview" : "Play Preview"}
              style={{ borderTop: '1px solid var(--line)' }}
            >
              <span>{isPlaying ? "PAUSE INTERACTIVE DEMO" : "RESUME DEMO"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
