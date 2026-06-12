import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      console.log('login response', data);
      navigate('/patient');
    } catch (err: any) {
      console.error(err);
      const serverMsg = err?.response?.data?.detail || err?.message || 'Unable to login. Check credentials.';
      setError(String(serverMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-lg lg:p-0">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden h-full rounded-l-3xl bg-sky-50 p-10 lg:block">
          <h2 className="text-2xl font-bold text-sky-700">Welcome Back</h2>
          <p className="mt-4 text-slate-600">Login to your MedCare account to manage appointments and view records.</p>
        </div>

        <div className="p-10">
          <h1 className="text-3xl font-semibold text-slate-900">Login</h1>
          <p className="mt-2 text-slate-600">Access your MedCare account.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                type="email"
                className="mt-2 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                className="mt-2 w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button disabled={loading} className="w-full rounded-xl bg-sky-600 px-4 py-3 text-white hover:bg-sky-700 disabled:opacity-60" type="submit">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Don’t have an account? <Link to="/auth/register" className="text-sky-600">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
