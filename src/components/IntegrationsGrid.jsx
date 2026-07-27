import React from 'react';
import { Layers, ShieldCheck, Zap } from 'lucide-react';

const INTEGRATIONS = [
  { name: "Paytm POS", category: "Payments", tag: "Instant Settlement" },
  { name: "UrbanPiper", category: "POS Sync", tag: "Menu Auto-Sync" },
  { name: "Explorex", category: "Restaurant OS", tag: "Order Management" },
  { name: "RanceLab", category: "Billing Software", tag: "Inventory Sync" },
  { name: "eZee Tech", category: "Hospitality POS", tag: "Cloud Integration" },
  { name: "Porter", category: "Delivery Logistics", tag: "Direct Courier" },
  { name: "Borzo Express", category: "Logistics", tag: "Instant Rider" },
  { name: "Dunzo Direct", category: "Delivery Partner", tag: "Hyperlocal" },
  { name: "LoadShare", category: "Delivery Logistics", tag: "Fleet Management" },
  { name: "Pidge Delivery", category: "Logistics", tag: "On-demand" },
  { name: "Pine Labs", category: "Payment Terminal", tag: "Card & UPI" },
  { name: "Petpooja", category: "Restaurant POS", tag: "API Sync" },
];

export default function IntegrationsGrid() {
  return (
    <section className="wrap integrations-section" id="integrations">
      <div className="integrations-header">
        <div className="integrations-badge">
          <Zap size={14} /> ZERO FRICTION SETUP
        </div>
        <h2>Works with the Tools You Already Use</h2>
        <p>No need to change your existing billing POS or delivery courier. MenuLink connects seamlessly with leading software and delivery partners across India.</p>
      </div>

      <div className="integrations-grid">
        {INTEGRATIONS.map((item, idx) => (
          <div key={idx} className="integration-card">
            <div className="integration-logo-placeholder">
              <span className="logo-text">{item.name.charAt(0)}</span>
            </div>
            <div className="integration-info">
              <h4>{item.name}</h4>
              <span className="integration-cat">{item.category}</span>
            </div>
            <span className="integration-tag">
              <ShieldCheck size={12} /> {item.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
