import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Smartphone, RefreshCw, MapPin, Building2, Palette } from 'lucide-react';

const VALUE_PILLS = [
  {
    id: 'pos',
    label: 'Seamless POS System Integration',
    icon: RefreshCw,
    heading: 'Sync Orders Straight to Your Kitchen Printer',
    description: 'Incoming WhatsApp and web orders automatically reflect on your POS billing terminal and kitchen display screen (KDS) without manual re-entry.',
    stat: '0 Manual Errors',
    subText: 'Supports Petpooja, UrbanPiper, RanceLab & custom APIs'
  },
  {
    id: 'reengagement',
    label: 'Automated Customer Re-Engagement',
    icon: Smartphone,
    heading: 'Turn One-Time Diners into Weekly Regulars',
    description: 'Send automated WhatsApp broadcast reminders, weekend discount links, and birthday coupons directly to customers who previously ordered from you.',
    stat: '3.4x Higher Repeat Rate',
    subText: '100% direct WhatsApp communication'
  },
  {
    id: 'multiloc',
    label: 'Centralized Multi-Location Management',
    icon: MapPin,
    heading: 'Manage 1 or 50 Outlets from One Dashboard',
    description: 'Easily update prices, disable out-of-stock items, manage outlet radius, and track multi-branch revenue from a single intuitive portal.',
    stat: '1-Click Price Updates',
    subText: 'Centralized menu & inventory control'
  },
  {
    id: 'corporate',
    label: 'Corporate Bulk Order Infrastructure',
    icon: Building2,
    heading: 'Capture High-Value Office & Event Catering Orders',
    description: 'Accept pre-scheduled bulk lunch boxes and corporate subscriptions with automated invoicing and split corporate payment links.',
    stat: '35% Larger Order Sizes',
    subText: 'Built-in advance booking & scheduled deliveries'
  },
  {
    id: 'brand',
    label: 'Branded Digital Experience',
    icon: Palette,
    heading: 'Your Brand, Your Logo, Your Customized Domain',
    description: 'Ditch generic aggregator screens. Give customers a premium, ultra-fast ordering app branded with your restaurant colors, logo, and cover photos.',
    stat: '100% Brand Ownership',
    subText: 'Custom domain (e.g. order.yourrestaurant.com)'
  }
];

export default function ValuePropPills() {
  const [activeId, setActiveId] = useState('pos');
  const activeItem = VALUE_PILLS.find(item => item.id === activeId);

  return (
    <section className="wrap value-pills-section">
      <div className="value-pills-grid">
        <div className="value-pills-left">
          <h2>From Cost Savings to Customer Loyalty</h2>
          <p>
            MenuLink provides commission-free direct ordering infrastructure that helps restaurants reclaim margins, own customer relationships, and scale operations efficiently.
          </p>

          <div className="value-detail-box">
            <div className="detail-badge">
              ✓ {activeItem.stat}
            </div>
            <h3>{activeItem.heading}</h3>
            <p>{activeItem.description}</p>
            <span className="detail-subtext">{activeItem.subText}</span>
          </div>
        </div>

        <div className="value-pills-right">
          {VALUE_PILLS.map((pill) => {
            const Icon = pill.icon;
            const isActive = pill.id === activeId;
            return (
              <button
                key={pill.id}
                className={`value-pill-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveId(pill.id)}
                onMouseEnter={() => setActiveId(pill.id)}
              >
                <div className="pill-dot" />
                <span className="pill-text">{pill.label}</span>
                <ArrowRight size={16} className="pill-arrow" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
