import React, { useState } from 'react';
import { Lock, User, ShieldCheck, AlertCircle, ArrowLeft, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onBackToHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check password = 12345, allow admin/admin@menulink.in/superadmin or any valid input
    if (cleanPass === '12345') {
      onLoginSuccess();
    } else {
      setError('Incorrect password! Password is: 12345');
    }
  };

  const handleAutofill = () => {
    setUsername('admin');
    setPassword('12345');
    setError('');
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <button className="back-btn" onClick={onBackToHome}>
          <ArrowLeft size={16} /> Back to Website
        </button>

        <div className="admin-login-header">
          <div className="admin-icon-badge">
            <ShieldCheck size={32} />
          </div>
          <h2>MenuLink Admin Portal</h2>
          <p>Super Admin Access & Store Control</p>
        </div>

        {error && (
          <div className="admin-error-box">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label>
              <User size={14} /> Username / Email
            </label>
            <input
              type="text"
              placeholder="e.g. admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={14} /> Password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password (12345)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="login-hint-box">
            <div className="hint-header">
              <KeyRound size={14} /> Default Credentials
            </div>
            <div className="hint-details">
              Username: <strong>admin</strong> | Password: <strong>12345</strong>
            </div>
            <button
              type="button"
              className="autofill-btn"
              onClick={handleAutofill}
            >
              <Sparkles size={13} /> Auto-fill Admin Credentials
            </button>
          </div>

          <button type="submit" className="btn-primary login-submit-btn">
            Login to Admin Portal
          </button>
        </form>
      </div>
    </div>
  );
}
