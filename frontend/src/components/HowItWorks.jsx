import React from 'react';

const STEPS = [
  { num: 1, title: "Create your menu", desc: "Add items and prices in minutes." },
  { num: 2, title: "Share your link", desc: "WhatsApp, Instagram, QR code — anywhere." },
  { num: 3, title: "Customer orders", desc: "Our AI agent takes the order in chat." },
  { num: 4, title: "Get paid instantly", desc: "UPI link, money straight to your account." },
];

export default function HowItWorks() {
  return (
    <section className="wrap steps" id="works">
      <h2>How it works</h2>
      <div className="steps-grid">
        {STEPS.map((step) => (
          <div key={step.num} className="step">
            <div className="step-num">{step.num}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
