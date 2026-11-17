import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (password !== passwordConfirm) {
      setError('The passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await authService.register({ first_name: firstName, last_name: lastName, email, password, password_confirm: passwordConfirm });
      navigate('/auth/login', { replace: true, state: { registered: true } });
    } catch {
      setError('We couldn’t create your account. Check your details or try another email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5 md:grid-cols-[0.9fr_1.1fr]">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-sky-600 p-10 text-white md:flex md:flex-col md:justify-between">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[35px] border-white/10" />
        <div><Link to="/" className="inline-flex items-center gap-2 font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-xl text-blue-700">✚</span>MedCare</Link><p className="mt-20 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Care starts here</p><h1 className="mt-3 text-4xl font-bold leading-tight">A healthier you<br />starts with a plan.</h1><p className="mt-5 max-w-sm leading-7 text-blue-100">Create your account to book visits, keep records, and stay connected to your care team.</p></div>
        <p className="text-sm text-blue-100">Your health journey, made simpler.</p>
        <span aria-hidden="true" className="absolute bottom-24 right-12 text-[7rem] text-white/15">✚</span>
      </div>
      <div className="p-6 sm:p-10 lg:p-12">
        <Link to="/" className="inline-flex items-center gap-2 font-bold text-blue-700 md:hidden"><span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-700 text-white">✚</span>MedCare</Link>
        <div className="mx-auto max-w-md">
          <div className="mb-7 text-center"><p className="text-3xl text-blue-700">✚</p><h2 className="mt-2 text-2xl font-bold text-slate-900">Create account</h2><p className="mt-1 text-sm text-slate-500">Register to get started</p></div>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="block sm:col-span-2"><span className="text-sm font-semibold text-slate-700">Full name</span><div className="mt-2 grid grid-cols-2 gap-3"><input autoComplete="given-name" placeholder="First name" aria-label="First name" className="w-full rounded-xl border-slate-200 py-3" value={firstName} onChange={(event) => setFirstName(event.target.value)} required /><input autoComplete="family-name" placeholder="Last name" aria-label="Last name" className="w-full rounded-xl border-slate-200 py-3" value={lastName} onChange={(event) => setLastName(event.target.value)} required /></div></label>
            <label className="block sm:col-span-2"><span className="text-sm font-semibold text-slate-700">Email address</span><input type="email" autoComplete="email" placeholder="you@example.com" className="mt-2 w-full rounded-xl border-slate-200 py-3" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <label className="block sm:col-span-2"><span className="text-sm font-semibold text-slate-700">Password</span><span className="relative mt-2 block"><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a password" className="w-full rounded-xl border-slate-200 py-3 pr-14" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 text-sm font-medium text-slate-500">{showPassword ? 'Hide' : 'Show'}</button></span></label>
            <label className="block sm:col-span-2"><span className="text-sm font-semibold text-slate-700">Confirm password</span><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Confirm your password" className="mt-2 w-full rounded-xl border-slate-200 py-3" value={passwordConfirm} onChange={(event) => setPasswordConfirm(event.target.value)} minLength={8} required /></label>
            {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:col-span-2">{error}</p>}
            <button type="submit" disabled={submitting} className="rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white shadow-md shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70 sm:col-span-2">{submitting ? 'Creating account…' : 'Register'}</button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-500">Already have an account? <Link to="/auth/login" className="font-semibold text-blue-700 hover:underline">Login</Link></p>
        </div>
      </div>
    </section>
  );
};

export default Register;
