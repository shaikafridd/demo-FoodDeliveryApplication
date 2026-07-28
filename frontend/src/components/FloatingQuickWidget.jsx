import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowUpRight, X } from 'lucide-react';

const RECENT_ORDERS = [
  { restaurant: "Spice House", order: "1x Butter Chicken & Naan", amount: "₹480", time: "2 mins ago" },
  { restaurant: "Annapurna Tiffins", order: "Monthly Lunch Plan", amount: "₹2,400", time: "Just now" },
  { restaurant: "Mamma's Kitchen", order: "2x Homemade Biryani", amount: "₹650", time: "5 mins ago" },
  { restaurant: "South Tiffin Express", order: "3x Masala Dosa Combo", amount: "₹340", time: "1 min ago" },
];

export default function FloatingQuickWidget() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % RECENT_ORDERS.length);
        setVisible(true);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed) return null;

  const currentOrder = RECENT_ORDERS[currentIdx];

  return (
    <div className={`floating-toast ${visible ? 'show' : 'hide'}`}>
      <button className="toast-close" onClick={() => setDismissed(true)}>
        <X size={14} />
      </button>
      <div className="toast-icon">
        <ShoppingBag size={18} />
      </div>
      <div className="toast-content">
        <div className="toast-title">
          <strong>{currentOrder.restaurant}</strong>
          <span className="toast-time">{currentOrder.time}</span>
        </div>
        <p className="toast-desc">
          {currentOrder.order} • <strong>{currentOrder.amount}</strong>
        </p>
        <span className="toast-tag">✓ 0% Commission Paid!</span>
      </div>
      <a href="#demo" className="toast-cta">
        Try Demo <ArrowUpRight size={14} />
      </a>
    </div>
  );
}
