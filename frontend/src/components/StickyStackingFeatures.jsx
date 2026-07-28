import React from 'react';
import { Percent, Truck, Users, Tag } from 'lucide-react';

const STACK_CARDS = [
  {
    step: "01 / 04",
    title: "0% Commission & Instant Payouts",
    desc: "No hidden charges, no platform cuts, and no 15-day wait times. Get money credited straight to your bank account via instant UPI.",
    icon: Percent,
    highlight: "Keep 100% of revenue",
    accentColor: "var(--green)"
  },
  {
    step: "02 / 04",
    title: "Automated WhatsApp Orders",
    desc: "Customers scan your QR code or click your link, pick items on a beautiful digital menu, and complete their order directly in WhatsApp.",
    icon: Truck,
    highlight: "Zero app download required",
    accentColor: "var(--red)"
  },
  {
    step: "03 / 04",
    title: "Own 100% Customer Data",
    desc: "Delivery platforms hide your customer phone numbers. MenuLink gives you total ownership of customer contacts to send offers & build real loyalty.",
    icon: Users,
    highlight: "Build true brand loyalty",
    accentColor: "var(--green)"
  },
  {
    step: "04 / 04",
    title: "Custom Branded Menus & QR Codes",
    desc: "Get print-ready QR codes for table tops, takeaway boxes, and Instagram bios. Update prices & items in real-time in 10 seconds.",
    icon: Tag,
    highlight: "Full control over pricing",
    accentColor: "var(--red)"
  }
];

export default function StickyStackingFeatures() {
  return (
    <section className="wrap stacking-section">
      <div className="stacking-intro">
        <h2>Your Restaurant. Your Orders. Your Profits.</h2>
        <p>Why rent customers from delivery apps when you can own your ordering system?</p>
      </div>

      <div className="stacking-container">
        {STACK_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="sticky-card"
              style={{ top: `${80 + idx * 24}px` }}
            >
              <div className="sticky-card-content">
                <div className="card-left">
                  <span className="card-step-badge">{card.step}</span>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <span className="card-highlight" style={{ color: card.accentColor }}>
                    ✓ {card.highlight}
                  </span>
                </div>
                <div className="card-right-graphic">
                  <div className="graphic-icon-wrap" style={{ borderColor: card.accentColor }}>
                    <Icon size={48} color={card.accentColor} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
