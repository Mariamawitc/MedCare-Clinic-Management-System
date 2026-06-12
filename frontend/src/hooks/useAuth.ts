import { useMemo } from 'react';
import authService from '../services/authService';

const useAuth = () => {
  const disableAuth = import.meta.env.VITE_DISABLE_AUTH === 'true';

  if (disableAuth) {
    const demoUser = { fullName: 'Demo User', email: 'demo@local', role: 'patient' };
    return { isAuthenticated: true, user: demoUser, token: 'dev-token' };
  }

  const token = authService.getToken();
  const user = authService.getUser();

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  return { isAuthenticated, user, token };
};

export default useAuth;
