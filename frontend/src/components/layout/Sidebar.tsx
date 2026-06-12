import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="hidden w-72 shrink-0 flex-col gap-6 border-r border-slate-100 bg-white px-6 py-8 lg:flex">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-semibold">
          {user?.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0,2) || 'MC'}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{user?.fullName || 'User'}</div>
          <div className="text-xs text-slate-500">{user?.role || 'Member'}</div>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-2 text-slate-700">
        <Link to="/patient" className="rounded-md px-3 py-2 hover:bg-slate-50">Dashboard</Link>
        <Link to="/appointments" className="rounded-md px-3 py-2 hover:bg-slate-50">Appointments</Link>
        <Link to="/prescriptions" className="rounded-md px-3 py-2 hover:bg-slate-50">Prescriptions</Link>
        <Link to="/payments" className="rounded-md px-3 py-2 hover:bg-slate-50">Payments</Link>
        <Link to="/profile" className="rounded-md px-3 py-2 hover:bg-slate-50">Profile</Link>
      </nav>

      <div>
        <button
          className="w-full rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
          onClick={() => { localStorage.clear(); window.location.href = '/auth/login'; }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
