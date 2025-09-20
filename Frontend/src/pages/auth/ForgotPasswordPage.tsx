import React, { useState } from 'react';
import { COLORS } from '../../theme';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email) {
      setError('Email is required.');
      return;
    }
    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('OTP sent to your email.');
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch {
      setError('Network error.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background.lightGray }}>
      <div style={{ flex: 1, background: 'linear-gradient(135deg,#1A73E8,#00BFA6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 320, textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700 }}>Forgot Password?</h2>
          <p>Enter your email to receive an OTP.</p>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', width: 340 }} onSubmit={handleSubmit} aria-label="Forgot password form">
          <h2 style={{ color: COLORS.primary.blue, fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Forgot Password</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee' }} aria-label="Email" />
          {error && <div style={{ color: COLORS.priority.urgent, marginBottom: 10 }}>{error}</div>}
          {success && <div style={{ color: COLORS.status.success, marginBottom: 10 }}>{success}</div>}
          <button type="submit" style={{ width: '100%', background: COLORS.primary.blue, color: '#fff', padding: 12, borderRadius: 8, fontWeight: 700, border: 'none', marginBottom: 10 }}>Send OTP</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
