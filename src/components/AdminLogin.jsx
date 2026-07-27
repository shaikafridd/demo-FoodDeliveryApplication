import React, { useState } from 'react';
import { Lock, User, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLogin({ onLoginSuccess, onBackToHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Check credentials: admin / admin@menulink.in and password 12345
    const validUsername = username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'admin@menulink.in';
    const validPassword = password.trim() === '12345';

    if (validUsername && validPassword) {
      onLoginSuccess();
    } else {
      setError('Invalid admin credentials. (Hint: username is "admin" & password is "12345")');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <button className="back-btn" onClick={onBackToHome}>
          <ArrowLeft size={16} /> Back to Website
        </button>

        <div className="admin-login-header">
          <div className="admin-icon-badge">
            <ShieldCheck size={28} />
          </div>
          <h2>MenuLink Admin Portal</h2>
          <p>Single Super Admin Access</p>
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
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-hint-box">
            <span>🔑 Credentials: <strong>admin</strong> | <strong>12345</strong></span>
          </div>

          <button type="submit" className="btn-primary login-submit-btn">
            Login to Admin Portal
          </button>
        </form>
      </div>
    </div>
  );
}
