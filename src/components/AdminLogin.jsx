import React, { useState } from 'react';
import { Lock, User, ShieldCheck, AlertCircle, ArrowLeft, Loader2, Key } from 'lucide-react';
import { adminLoginApi } from '../services/api';

export default function AdminLogin({ onLoginSuccess, onBackToHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    try {
      const res = await adminLoginApi(cleanUser, cleanPass);
      if (res && res.success) {
        onLoginSuccess();
      } else {
        setError('Invalid username or password. Please try again.');
      }
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <button className="back-btn" onClick={onBackToHome} disabled={loading}>
          <ArrowLeft size={16} /> Back to Main Site
        </button>

        <div className="admin-login-header">
          <div className="admin-icon-badge">
            <ShieldCheck size={36} color="var(--brand)" />
          </div>
          <h2>Admin Control Portal</h2>
          <p>Secure Enterprise Login & Management Dashboard</p>
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
              <User size={15} /> Username or Admin Email
            </label>
            <div className="input-icon-wrapper">
              <input
                type="text"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                autoFocus
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <Lock size={15} /> Password
            </label>
            <div className="input-icon-wrapper">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`btn-primary login-submit-btn ${loading ? 'btn-loading' : ''}`}
            disabled={loading}
            style={loading ? { cursor: 'wait', opacity: 0.8 } : {}}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Authenticating...
              </>
            ) : (
              <>
                <Key size={16} /> Login to Admin Portal
              </>
            )}
          </button>
          {loading && (
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '8px', textAlign: 'center' }}>
              ⚡ Verifying credentials with Render backend database...
            </p>
          )}
        </form>

        <div className="admin-security-footer">
          <ShieldCheck size={14} /> 256-bit Encrypted Session • Authorized Access Only
        </div>
      </div>
    </div>
  );
}
