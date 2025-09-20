import React, { useState } from 'react';
import { COLORS } from '../theme';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'USER' as 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'OPERATOR' | 'USER'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement signup API call
      console.log('Signup attempt:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to login on success
      window.location.href = '/login';
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }));
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${COLORS.primary.navy} 0%, ${COLORS.secondary.teal} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: COLORS.background.white,
        borderRadius: 12,
        padding: 40,
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: 500
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.primary.navy,
            margin: 0
          }}>
            Create Account
          </h1>
          <p style={{
            color: COLORS.background.steel,
            margin: '8px 0 0 0',
            fontSize: 16
          }}>
            Join the Manufacturing Management System
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 8,
                fontWeight: 600,
                color: COLORS.primary.navy
              }}>
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.firstName ? COLORS.priority.urgent : '#E5E7EB'}`,
                  borderRadius: 8,
                  fontSize: 16,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              {errors.firstName && (
                <p style={{ color: COLORS.priority.urgent, fontSize: 12, margin: '4px 0 0 0' }}>
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: 8,
                fontWeight: 600,
                color: COLORS.primary.navy
              }}>
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: `2px solid ${errors.lastName ? COLORS.priority.urgent : '#E5E7EB'}`,
                  borderRadius: 8,
                  fontSize: 16,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              {errors.lastName && (
                <p style={{ color: COLORS.priority.urgent, fontSize: 12, margin: '4px 0 0 0' }}>
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 600,
              color: COLORS.primary.navy
            }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errors.email ? COLORS.priority.urgent : '#E5E7EB'}`,
                borderRadius: 8,
                fontSize: 16,
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            {errors.email && (
              <p style={{ color: COLORS.priority.urgent, fontSize: 12, margin: '4px 0 0 0' }}>
                {errors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 600,
              color: COLORS.primary.navy
            }}>
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errors.username ? COLORS.priority.urgent : '#E5E7EB'}`,
                borderRadius: 8,
                fontSize: 16,
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            {errors.username && (
              <p style={{ color: COLORS.priority.urgent, fontSize: 12, margin: '4px 0 0 0' }}>
                {errors.username}
              </p>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 600,
              color: COLORS.primary.navy
            }}>
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #E5E7EB',
                borderRadius: 8,
                fontSize: 16,
                boxSizing: 'border-box',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="USER">User</option>
              <option value="OPERATOR">Operator</option>
              <option value="SUPERVISOR">Supervisor</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 600,
              color: COLORS.primary.navy
            }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errors.password ? COLORS.priority.urgent : '#E5E7EB'}`,
                borderRadius: 8,
                fontSize: 16,
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            {errors.password && (
              <p style={{ color: COLORS.priority.urgent, fontSize: 12, margin: '4px 0 0 0' }}>
                {errors.password}
              </p>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontWeight: 600,
              color: COLORS.primary.navy
            }}>
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errors.confirmPassword ? COLORS.priority.urgent : '#E5E7EB'}`,
                borderRadius: 8,
                fontSize: 16,
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: COLORS.priority.urgent, fontSize: 12, margin: '4px 0 0 0' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              background: isLoading ? COLORS.background.steel : COLORS.primary.blue,
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: 24,
          fontSize: 14,
          color: COLORS.background.steel
        }}>
          Already have an account?{' '}
          <a
            href="/login"
            style={{
              color: COLORS.primary.blue,
              textDecoration: 'none',
              fontWeight: 600
            }}
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};