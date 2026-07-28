import React from 'react';
import { Zap } from 'lucide-react';

const POS_TILES = [
  {
    name: "LUCID POS",
    customRender: (
      <div className="tile-logo lucid-logo">
        <span className="lucid-pink">LUCID</span>
        <span className="lucid-blue">POS</span>
        <span className="tile-sub">Restaurant Management Software</span>
      </div>
    )
  },
  {
    name: "summer.",
    customRender: (
      <div className="tile-logo summer-box">
        <span>summer.</span>
      </div>
    )
  },
  {
    name: "Paytm",
    customRender: (
      <div className="tile-logo paytm-logo">
        <span className="paytm-dark">Pay</span>
        <span className="paytm-blue">tm</span>
      </div>
    )
  },
  {
    name: "explorex",
    customRender: (
      <div className="tile-logo explorex-logo">
        <span className="explorex-icon">❖</span>
        <span>explorex</span>
      </div>
    )
  },
  {
    name: "RanceLab",
    customRender: (
      <div className="tile-logo rancelab-box">
        <div className="rancelab-dot" />
        <div>
          <span className="rancelab-title">RanceLab</span>
          <span className="rancelab-sub">Simplifying Business Practices</span>
        </div>
      </div>
    )
  },
  {
    name: "URBAN PIPER",
    customRender: (
      <div className="tile-logo urban-box">
        <span>URBAN</span>
        <span>PIPER</span>
      </div>
    )
  },
  {
    name: "eZee",
    customRender: (
      <div className="tile-logo ezee-logo">
        <span className="ezee-arc">☾</span>
        <span className="ezee-text">eZee</span>
      </div>
    )
  },
  {
    name: "posify",
    customRender: (
      <div className="tile-logo posify-logo">
        <span className="posify-leaf">🌱</span>
        <span>posify</span>
      </div>
    )
  }
];

const LOGISTICS_TILES = [
  {
    name: "LOADSHARE",
    customRender: (
      <div className="tile-logo loadshare-logo">
        <span className="ls-icon">L</span>
        <div>
          <span className="ls-main">LOADSHARE</span>
          <span className="ls-sub">NETWORKS</span>
        </div>
      </div>
    )
  },
  {
    name: "pidge",
    customRender: (
      <div className="tile-logo pidge-box">
        <span>pidge</span>
      </div>
    )
  },
  {
    name: "PORTER",
    customRender: (
      <div className="tile-logo porter-box">
        <span>PORTER</span>
      </div>
    )
  },
  {
    name: "qwqer",
    customRender: (
      <div className="tile-logo qwqer-logo">
        <div className="qwqer-mascot">🧢</div>
        <span>_QWQER</span>
      </div>
    )
  },
  {
    name: "rapido",
    customRender: (
      <div className="tile-logo rapido-logo">
        <span className="rapido-dots">••</span>
        <span>rapido</span>
      </div>
    )
  },
  {
    name: "shadowfax",
    customRender: (
      <div className="tile-logo shadowfax-logo">
        <span className="sf-wing">➢</span>
        <div>
          <span className="sf-main">shadowfax</span>
          <span className="sf-sub">we deliver.</span>
        </div>
      </div>
    )
  },
  {
    name: "y",
    customRender: (
      <div className="tile-logo y-box">
        <span>Y</span>
      </div>
    )
  },
  {
    name: "borzo",
    customRender: (
      <div className="tile-logo borzo-logo">
        <span>borzo</span>
      </div>
    )
  }
];

export default function IntegrationsMarquee() {
  const row1 = [...POS_TILES, ...POS_TILES];
  const row2 = [...LOGISTICS_TILES, ...LOGISTICS_TILES];

  return (
    <section className="wrap directoo-integrations-section" id="integrations">
      <div className="integrations-header">
        <span className="section-super-title">Integrations</span>
        <h2>Works with the Tools You Already Use</h2>
        <p>Connect your existing POS software & delivery logistics fleet with 1-click integration.</p>
      </div>

      <div className="directoo-marquee-banner">
        {/* Row 1: POS Software (Slide Left) */}
        <div className="marquee-row-wrapper">
          <div className="marquee-row-track track-slide-left">
            {row1.map((tile, idx) => (
              <div key={`r1-${idx}`} className="directoo-logo-card">
                {tile.customRender}
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Delivery & Logistics (Slide Right) */}
        <div className="marquee-row-wrapper">
          <div className="marquee-row-track track-slide-right">
            {row2.map((tile, idx) => (
              <div key={`r2-${idx}`} className="directoo-logo-card">
                {tile.customRender}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
