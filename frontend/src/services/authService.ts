import api from './api';

interface LoginPayload {
  email: string;
  password: string;
}

export type UserRole = 'patient' | 'doctor' | 'receptionist' | 'admin';

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

const TOKEN_KEY = 'medcare_token';
const REFRESH_TOKEN_KEY = 'medcare_refresh_token';
const USER_KEY = 'medcare_user';

const createLocalSession = (role: UserRole, fullName = 'Demo User', email = 'demo@medcare.local') => {
  const user = {
    id: 'demo-user',
    fullName,
    first_name: fullName.split(' ')[0] || 'Demo',
    last_name: fullName.split(' ').slice(1).join(' ') || 'User',
    email,
    role,
  };

  localStorage.setItem(TOKEN_KEY, `demo-${role}-token`);
  localStorage.setItem(REFRESH_TOKEN_KEY, `demo-${role}-refresh-token`);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return { access: `demo-${role}-token`, refresh: `demo-${role}-refresh-token`, user };
};

const authService = {
  login: async (payload: LoginPayload) => {
    const response = await api.post('/token/', payload);
    const { access, refresh } = response.data;
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);

    const userResponse = await api.get('/users/me/');
    const user = userResponse.data;
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return { ...response.data, user };
  },
  register: async (payload: RegisterPayload) => {
    const [firstName, ...lastNameParts] = payload.fullName.trim().split(/\s+/);
    const response = await api.post('/users/register/', {
      email: payload.email,
      first_name: firstName || payload.fullName,
      last_name: lastNameParts.join(' ') || 'User',
      password: payload.password,
      password_confirm: payload.password,
      role: payload.role,
    });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  createLocalSession,
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
};

export default authService;
