import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Register = () => {
  const [fullName, setFullName] = useState('');
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
      const data = await authService.register({ fullName, email, password });
      console.log('register response', data);
      navigate('/auth/login');
    } catch (err: any) {
      console.error(err);
      const serverMsg = err?.response?.data?.detail || err?.message || 'Unable to register. Please try again.';
      setError(String(serverMsg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 shadow-lg lg:p-0">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden h-full rounded-l-3xl bg-sky-50 p-10 lg:block">
          <h2 className="text-2xl font-bold text-sky-700">Create Account</h2>
          <p className="mt-4 text-slate-600">Register to book appointments, manage records and access prescriptions.</p>
        </div>

        <div className="p-10">
          <h1 className="text-3xl font-semibold text-slate-900">Create Account</h1>
          <p className="mt-2 text-slate-600">Register to book appointments and manage your records.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full name</span>
              <input
                className="mt-2 w-full"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>
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
                  {loading ? 'Registering…' : 'Register'}
                </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account? <Link to="/auth/login" className="text-sky-600">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
