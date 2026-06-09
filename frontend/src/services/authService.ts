import api from './api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

const TOKEN_KEY = 'medcare_token';
const USER_KEY = 'medcare_user';

const authService = {
  login: async (payload: LoginPayload) => {
    const response = await api.post('/auth/login/', payload);
    const { access, user } = response.data;
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return response.data;
  },
  register: async (payload: RegisterPayload) => {
    return api.post('/auth/register/', payload);
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
};

export default authService;
