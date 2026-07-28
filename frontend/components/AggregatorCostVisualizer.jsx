import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, EyeOff, ShieldAlert } from 'lucide-react';

const PITFALLS = [
  {
    id: 'commission',
    title: 'Up to 35% Commission Lost',
    subtitle: 'Every order on aggregator apps cuts deeply into your profit margins.',
    icon: TrendingDown,
    detailHeading: 'The 30% Profit Drain',
    description: 'On a ₹500 food order, delivery aggregators deduct ₹150 - ₹175 in commissions, GST, and platform charges. You end up earning less than the cost of ingredients!',
    metricBad: '-₹175 / order',
    metricGood: '₹0 Commission with MenuLink'
  },
  {
    id: 'ads',
    title: '5–8% Extra Spent on Ads',
    subtitle: 'Want visibility? Aggregators charge extra just to show your restaurant.',
    icon: AlertTriangle,
    detailHeading: 'Forced Bidding Wars',
    description: 'To stay on top of search results in your own neighborhood, aggregators force you to spend thousands in ad campaigns. If you stop paying ads, your orders drop.',
    metricBad: 'High Monthly Ad Fees',
    metricGood: 'Direct WhatsApp Loyalty'
  },
  {
    id: 'data',
    title: 'Zero Customer Data',
    subtitle: 'They own your customers. You get zero phone numbers or emails.',
    icon: EyeOff,
    detailHeading: 'Renting Your Own Customers',
    description: 'Delivery apps hide customer details behind masked numbers. You cannot contact your regular buyers, offer birthday discounts, or send special weekend menus.',
    metricBad: 'Masked Numbers',
    metricGood: '100% Direct Phone List'
  }
];

export default function AggregatorCostVisualizer() {
  const [activeId, setActiveId] = useState('commission');
  const activePitfall = PITFALLS.find(p => p.id === activeId);

  return (
    <section className="wrap visualizer-section">
      <div className="visualizer-header">
        <div className="alert-badge">
          <ShieldAlert size={14} /> THE HIDDEN COST OF AGGREGATORS
        </div>
        <h2>Stop Paying Food Platforms to Steal Your Customers</h2>
        <p>Click below to see how delivery apps cut your profits and how MenuLink fixes it.</p>
      </div>

      <div className="visualizer-grid">
        <div className="pitfall-tabs">
          {PITFALLS.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                className={`pitfall-tab ${isActive ? 'active' : ''}`}
                onClick={() => setActiveId(item.id)}
              >
                <div className="tab-icon">
                  <Icon size={20} />
                </div>
                <div className="tab-text">
                  <h4>{item.title}</h4>
                  <p>{item.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pitfall-detail-card">
          <div className="detail-header">
            <h3>{activePitfall.detailHeading}</h3>
            <p>{activePitfall.description}</p>
          </div>

          <div className="comparison-metric-box">
            <div className="metric-col bad-col">
              <span className="col-label">AGGREGATOR APP</span>
              <span className="col-value bad-text">{activePitfall.metricBad}</span>
            </div>
            <div className="vs-divider">VS</div>
            <div className="metric-col good-col">
              <span className="col-label">MENULINK</span>
              <span className="col-value good-text">{activePitfall.metricGood}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
