import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../theme';

const OtpVerifyPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !otp) {
      setError('Email and OTP are required.');
      return;
    }
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setSuccess('OTP verified! Logging in...');
        localStorage.setItem('token', data.token);
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        setError(data.message || 'OTP verification failed.');
      }
    } catch {
      setError('Network error.');
    }
  };

  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background.lightGray }}>
      <div style={{ flex: 1, background: 'linear-gradient(135deg,#1A73E8,#00BFA6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 320, textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700 }}>OTP Verification</h2>
          <p>Enter the OTP sent to your email.</p>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', width: 340 }} onSubmit={handleSubmit} aria-label="OTP verify form">
          <h2 style={{ color: COLORS.primary.blue, fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Verify OTP</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee' }} aria-label="Email" />
          <input type="text" placeholder="OTP" value={otp} onChange={e => setOtp(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee' }} aria-label="OTP" />
          {error && <div style={{ color: COLORS.priority.urgent, marginBottom: 10 }}>{error}</div>}
          {success && <div style={{ color: COLORS.status.success, marginBottom: 10 }}>{success}</div>}
          <button type="submit" style={{ width: '100%', background: COLORS.primary.blue, color: '#fff', padding: 12, borderRadius: 8, fontWeight: 700, border: 'none', marginBottom: 10 }}>Verify OTP</button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerifyPage;
