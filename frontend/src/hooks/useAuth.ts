import { useMemo } from 'react';
import authService from '../services/authService';

const useAuth = () => {
  const token = authService.getToken();
  const user = authService.getUser();

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  return { isAuthenticated, user, token };
};

export default useAuth;
