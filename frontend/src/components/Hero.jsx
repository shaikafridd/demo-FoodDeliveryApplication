import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import HeroVideoMockup from './HeroVideoMockup';

export default function Hero() {
  return (
    <section className="wrap hero" id="hero">
      <div className="hero-left-content">
        <div className="tag-box">
          NO COMMISSION · INSTANT PAYMENTS · WHATSAPP ORDERS
        </div>
        <h1>
          <span className="green">Keep 100%</span>
          <span>of every order.</span>
          <span className="red">Get paid instantly.</span>
        </h1>
        <p className="sub">
          Create your digital menu, share your link, receive orders on WhatsApp and get paid directly via UPI. No commissions. No delays. Just your earnings.
        </p>
        <div className="hero-ctas">
          <a className="btn-primary" href="#register">
            Start Saving Today <ArrowRight size={16} />
          </a>
          <a className="btn-outline" href="#demo">
            <Play size={16} fill="currentColor" /> Try Live Demo
          </a>
        </div>
      </div>

      <HeroVideoMockup />
    </section>
  );
}
