import React from 'react';

const STATS_DATA = [
  { value: "500+", label: "Restaurants" },
  { value: "200+", label: "Home Chefs" },
  { value: "50+", label: "Tiffin Services" },
  { value: "₹25L+", label: "Paid Directly" },
  { value: "₹2,50,00,000+", label: "Saved in Commissions" },
];

export default function StatsBar() {
  return (
    <section className="wrap">
      <div className="stats-bar">
        {STATS_DATA.map((stat, idx) => (
          <div key={idx} className="stat">
            <b>{stat.value}</b>
            {stat.label}
          </div>
        ))}
      </div>
    </section>
  );
}
