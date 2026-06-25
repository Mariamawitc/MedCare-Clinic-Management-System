import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import authService from '../services/authService';

interface User {
  id?: number;
  email: string;
  fullName: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'doctor' | 'receptionist' | 'admin';
  is_active?: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  setAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeUser = (user: any): User | null => {
  if (!user) return null;
  const fullName = user.fullName || [user.first_name, user.last_name].filter(Boolean).join(' ') || 'User';
  return {
    ...user,
    fullName,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const updateAuthState = () => {
    const newToken = authService.getToken();
    const newUser = normalizeUser(authService.getUser());
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(!!newToken);
  };

  useEffect(() => {
    updateAuthState();
    // Listen for storage changes (from other tabs or same tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'medcare_token' || e.key === 'medcare_user') {
        updateAuthState();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    updateAuthState();
    return response.user;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
        setAuthState: updateAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
