import React, { useState } from 'react';
import { Bike, CheckCircle2, ArrowRight, Phone, MapPin, Store, Loader2 } from 'lucide-react';
import { registerRestaurantApi } from '../services/api';

export default function RegistrationSection() {
  const [formData, setFormData] = useState({
    businessName: '',
    location: '',
    mobileNumber: '',
    businessType: 'Restaurant'
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.businessName || !formData.mobileNumber) return;
    
    setLoading(true);
    await registerRestaurantApi({
      name: formData.businessName,
      ownerName: formData.businessName,
      phone: formData.mobileNumber,
      city: formData.location,
      category: formData.businessType,
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="wrap registration-section" id="register">
      <div className="registration-card">
        <div className="registration-left-graphic">
          <div className="scooter-badge">
            <Bike size={24} />
          </div>
          <div className="scooter-visual">
            <div className="scooter-circle">
              <span className="big-logo-mark">M</span>
            </div>
            <h3>Join 500+ Food Outlets</h3>
            <p>Start taking commission-free orders within 15 minutes.</p>
          </div>
          <div className="graphic-stats font-hand">
            <span>✓ 0% Commission Forever</span>
            <span>✓ Instant Direct Payouts</span>
            <span>✓ Free Setup Assistance</span>
          </div>
        </div>

        <div className="registration-right-form">
          <div className="form-head">
            <span className="badge-tag">GET STARTED TODAY</span>
            <h2>Build Your Commission-Free Menu</h2>
            <p>Enter your business details below to test or activate your MenuLink direct order engine.</p>
          </div>

          {submitted ? (
            <div className="success-box">
              <CheckCircle2 size={48} color="var(--green)" />
              <h3>Welcome to MenuLink! 🎉</h3>
              <p>
                We've reserved your menu link for <strong>{formData.businessName}</strong> ({formData.location || 'Your Location'}).
              </p>
              <span className="success-sub">Saved to Node.js Backend Database. Our team will reach out on WhatsApp ({formData.mobileNumber}) in under 10 minutes.</span>
              <button className="btn-primary" onClick={() => setSubmitted(false)} style={{ marginTop: '16px' }}>
                Submit Another Business
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="reg-form">
              <div className="form-group">
                <label>
                  <Store size={14} /> Business Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spice House or Bawarchi Tiffins"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>
                  <MapPin size={14} /> Location / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, Bengaluru, Mumbai..."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>
                  <Phone size={14} /> Mobile Number (WhatsApp)
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  pattern="[0-9]{10}"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Business Category</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  disabled={loading}
                >
                  <option value="Restaurant">Small / Medium Restaurant</option>
                  <option value="HomeChef">Home Chef / Cloud Kitchen</option>
                  <option value="Tiffin">Tiffin & Meal Service</option>
                  <option value="Bakery">Bakery & Sweet Shop</option>
                </select>
              </div>

              <button
                type="submit"
                className={`btn-primary form-submit-btn ${loading ? 'btn-loading' : ''}`}
                disabled={loading}
                style={loading ? { cursor: 'wait', opacity: 0.8 } : {}}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Connecting to Backend...
                  </>
                ) : (
                  <>Create My MenuLink <ArrowRight size={16} /></>
                )}
              </button>
              {loading && (
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '8px', textAlign: 'center' }}>
                  ⚡ Waking up Render backend database (may take a few seconds on first request)...
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
