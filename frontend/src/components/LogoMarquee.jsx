import React from 'react';

const BRAND_LOGOS = [
  { name: "BABAI HOTEL", sub: "Est. 1942 • Tiffins", color: "#b5432b", bg: "#fdf0ed" },
  { name: "BIRYANI FACTORY", sub: "Mughlai & Biryani", color: "#2b2620", bg: "#efe6d0" },
  { name: "VELLANKI FOODS", sub: "Sweets & Namkeen", color: "#b5432b", bg: "#fbf5e8" },
  { name: "IDEAL KITCHEN", sub: "Cloud Kitchen", color: "#3d5c3a", bg: "#eef5ed" },
  { name: "AAZEBO", sub: "Mandi & Grill", color: "#1b2a4a", bg: "#eaeef5" },
  { name: "ARUGU", sub: "Regional Dining", color: "#8c5a2b", bg: "#f7f0e8" },
  { name: "SHAH GHOUSE", sub: "Hotel & Restaurant", color: "#9c27b0", bg: "#f8edf9" },
  { name: "PISTA HOUSE", sub: "Bakery & Haleem", color: "#3d5c3a", bg: "#eef5ed" },
];

export default function LogoMarquee() {
  const doubleBrands = [...BRAND_LOGOS, ...BRAND_LOGOS];

  return (
    <section className="partner-logo-section">
      <div className="wrap">
        <h3 className="partner-heading">TRUSTED BY 500+ FOOD BUSINESSES ACROSS INDIA</h3>
      </div>

      <div className="partner-marquee-container">
        <div className="partner-marquee-track">
          {doubleBrands.map((brand, idx) => (
            <div key={idx} className="partner-logo-card">
              <div className="partner-avatar" style={{ backgroundColor: brand.bg, color: brand.color }}>
                <span className="partner-avatar-text">{brand.name.split(' ')[0]}</span>
              </div>
              <div className="partner-details">
                <strong className="partner-title" style={{ color: brand.color }}>{brand.name}</strong>
                <span className="partner-sub">{brand.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
