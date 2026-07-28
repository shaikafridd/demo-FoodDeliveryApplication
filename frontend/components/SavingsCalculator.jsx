import React, { useState } from 'react';
import { Calculator, TrendingUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SavingsCalculator() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(150000); // Default ₹1.5 Lakhs

  // Aggregator commission ~ 30% + 5% ad fees = 35%
  const aggregatorLossMonthly = Math.round(monthlyRevenue * 0.35);
  const aggregatorLossYearly = aggregatorLossMonthly * 12;
  const menuLinkEarningsYearly = monthlyRevenue * 12;
  const totalSavedYearly = aggregatorLossYearly;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section className="wrap calculator-section" id="calculator">
      <div className="calculator-card">
        <div className="calculator-header">
          <div className="calc-badge">
            <Calculator size={14} /> LIVE SAVINGS CALCULATOR
          </div>
          <h2>Calculate How Much You Save With MenuLink</h2>
          <p>Drag the slider below to see how much money you stop giving away in delivery app commissions.</p>
        </div>

        <div className="calculator-body">
          <div className="slider-box">
            <div className="slider-label">
              <span>Your Estimated Monthly Online Orders:</span>
              <strong className="revenue-display">{formatCurrency(monthlyRevenue)}</strong>
            </div>
            <input
              type="range"
              min="30000"
              max="1000000"
              step="10000"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
              className="paper-slider"
            />
            <div className="slider-marks">
              <span>₹30K / mo</span>
              <span>₹5 Lakhs / mo</span>
              <span>₹10 Lakhs / mo</span>
            </div>
          </div>

          <div className="calc-grid">
            <div className="calc-stat-box bad-box">
              <span className="box-title">Delivery Aggregators (35% Fees)</span>
              <span className="box-amount bad-text">-{formatCurrency(aggregatorLossMonthly)} / mo</span>
              <span className="box-sub">Wasted commission & forced ad fees each year: {formatCurrency(aggregatorLossYearly)}</span>
            </div>

            <div className="calc-stat-box good-box">
              <div className="savings-badge">
                <Sparkles size={14} /> 100% YOUR EARNINGS
              </div>
              <span className="box-title">With MenuLink Direct Orders</span>
              <span className="box-amount good-text">₹0 Commission</span>
              <span className="box-sub">Keep {formatCurrency(menuLinkEarningsYearly)} in your bank account every year!</span>
            </div>
          </div>

          <div className="calculator-result-banner">
            <div className="result-text">
              <span className="result-tag">YOUR EXTRA PROFIT RETAINED</span>
              <h3>You save <span className="highlight-green">{formatCurrency(totalSavedYearly)}</span> every single year!</h3>
              <p>That's extra revenue you can invest into your kitchen, staff, or new outlets.</p>
            </div>
            <a href="#demo" className="btn-primary">
              Start Free Demo <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
