import { useMemo } from 'react';
import authService from '../services/authService';

const normalizeUser = (user: any) => {
  if (!user) return null;

  const fullName = user.fullName || [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Demo User';

  return {
    ...user,
    fullName,
  };
};

const useAuth = () => {
  const disableAuth = import.meta.env.VITE_DISABLE_AUTH === 'true';

  if (disableAuth) {
    const demoUser = { fullName: 'Demo User', email: 'demo@local', role: 'admin' };
    return { isAuthenticated: true, user: demoUser, token: 'dev-token' };
  }

  const token = authService.getToken();
  const user = normalizeUser(authService.getUser());

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  return { isAuthenticated, user, token };
};

export default useAuth;
