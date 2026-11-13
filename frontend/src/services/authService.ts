import api from './api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
  phone_number?: string;
}

const TOKEN_KEY = 'medcare_token';
const USER_KEY = 'medcare_user';

const authService = {
  login: async (payload: LoginPayload) => {
    const response = await api.post('/token/', payload);
    const { access } = response.data;
    localStorage.setItem(TOKEN_KEY, access);

    try {
      const me = await api.get('/users/me/');
      localStorage.setItem(USER_KEY, JSON.stringify(me.data));
    } catch (error) {
      localStorage.removeItem(USER_KEY);
    }

    return response.data;
  },
  register: async (payload: RegisterPayload) => {
    const safePayload = {
      ...payload,
      role: 'patient',
    };
    return api.post('/users/register/', safePayload);
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
