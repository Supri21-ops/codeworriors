import React, { useState } from 'react';
import { COLORS } from '../../theme';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    // POST /api/auth/login
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        // store token, redirect
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch {
      setError('Network error.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.background.lightGray }}>
      {/* Left illustration */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg,#1A73E8,#00BFA6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: 320, textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700 }}>Welcome to CodeWarrior ERP</h2>
          <p>Login to manage your manufacturing workflow.</p>
        </div>
      </div>
      {/* Right card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.08)', width: 340 }} onSubmit={handleSubmit} aria-label="Login form">
          <h2 style={{ color: COLORS.primary.blue, fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Login</h2>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee' }} aria-label="Email" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee' }} aria-label="Password" />
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} id="remember" />
            <label htmlFor="remember" style={{ marginLeft: 8, fontSize: 14 }}>Remember me</label>
          </div>
          {error && <div style={{ color: COLORS.priority.urgent, marginBottom: 10 }}>{error}</div>}
          <button type="submit" style={{ width: '100%', background: COLORS.primary.blue, color: '#fff', padding: 12, borderRadius: 8, fontWeight: 700, border: 'none', marginBottom: 10 }}>Login</button>
          <button type="button" style={{ width: '100%', background: '#fff', color: COLORS.primary.blue, border: `1px solid ${COLORS.primary.blue}`, padding: 12, borderRadius: 8, fontWeight: 700, marginBottom: 10 }}>Login with Google</button>
          <a href="/auth/forgot" style={{ color: COLORS.primary.blue, fontSize: 14, textDecoration: 'underline', display: 'block', textAlign: 'center' }}>Forgot Password?</a>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
