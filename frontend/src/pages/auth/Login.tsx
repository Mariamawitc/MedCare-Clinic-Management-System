import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await authService.login({ email, password });
      const dashboardByRole: Record<string, string> = { patient: '/patient', doctor: '/doctor', receptionist: '/receptionist', admin: '/admin' };
      navigate(dashboardByRole[authService.getUser()?.role] ?? '/auth/login', { replace: true });
    } catch {
      setError('We couldn’t sign you in. Check your email and password, then try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 md:grid-cols-[0.9fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-sky-600 p-10 text-white md:flex md:flex-col md:justify-between">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />
        <div><Link to="/" className="inline-flex items-center gap-2 font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-xl text-blue-700">✚</span>MedCare</Link><p className="mt-20 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Welcome back</p><h1 className="mt-3 text-4xl font-bold leading-tight">Your care,<br />all in one place.</h1><p className="mt-5 max-w-sm leading-7 text-blue-100">Sign in to manage appointments, records, and updates from your clinic.</p></div>
        <p className="text-sm text-blue-100">Trusted care for every stage of life.</p>
        <span aria-hidden="true" className="absolute bottom-24 right-12 text-[7rem] text-white/15">✚</span>
      </div>
      <div className="p-6 sm:p-10 lg:p-14">
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-blue-700 md:hidden"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-700 text-white">✚</span>MedCare</Link>
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center"><p className="text-3xl text-blue-700">✚</p><h2 className="mt-2 text-2xl font-bold text-slate-900">Welcome back!</h2><p className="mt-1 text-sm text-slate-500">Log in to your account</p></div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block"><span className="text-sm font-semibold text-slate-700">Email address</span><input type="email" autoComplete="username" placeholder="you@example.com" className="mt-2 w-full rounded-xl border-slate-200 py-3" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label className="block"><span className="text-sm font-semibold text-slate-700">Password</span><span className="relative mt-2 block"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" className="w-full rounded-xl border-slate-200 py-3 pr-14" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 text-sm font-medium text-slate-500">{showPassword ? 'Hide' : 'Show'}</button></span></label>
            {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
            <div className="text-right"><button type="button" onClick={() => setError('Ask your clinic administrator to reset your password.')} className="text-xs font-medium text-blue-700 hover:underline">Forgot password?</button></div>
            <button type="submit" disabled={submitting} className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70">{submitting ? 'Signing in…' : 'Login'}</button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">Don&apos;t have an account? <Link to="/auth/register" className="font-semibold text-blue-700 hover:underline">Register</Link></p>
        </div>
      </div>
    </section>
  );
};

export default Login;
