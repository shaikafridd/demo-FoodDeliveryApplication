import React from 'react';
import { ChefHat, Calendar, Store } from 'lucide-react';

const BUSINESSES = [
  {
    title: "Home Chef",
    desc: "Sell homemade meals with your own branded menu.",
    icon: ChefHat,
    bgGradient: "linear-gradient(135deg, #e07a5f, #f4f1de)",
  },
  {
    title: "Tiffin Service",
    desc: "Recurring lunch and dinner subscriptions, made simple.",
    icon: Calendar,
    bgGradient: "linear-gradient(135deg, #3d5c3a, #81b29a)",
  },
  {
    title: "Small Restaurant",
    desc: "Take direct orders without paying commission.",
    icon: Store,
    bgGradient: "linear-gradient(135deg, #b5432b, #f2cc8f)",
  },
];

export default function BusinessTypes() {
  return (
    <section className="wrap biz" id="biz">
      <h2>Built for every food business</h2>
      <div className="biz-grid">
        {BUSINESSES.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div key={idx} className="biz-card">
              <div className="biz-photo" style={{ background: b.bgGradient }}>
                <Icon size={44} strokeWidth={1.5} color="#ffffff" />
              </div>
              <div className="biz-body">
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
