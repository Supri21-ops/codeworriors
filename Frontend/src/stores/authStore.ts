import { useState } from 'react';

export function useAuthStore() {
  // In real app, use context or zustand
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<{ role: string } | null>(null);

  // Mock: update token/user for demo
  function login(tokenValue: string, role: string) {
    setToken(tokenValue);
    setUser({ role });
    localStorage.setItem('token', tokenValue);
  }
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }

  return { token, user, login, logout };
}
