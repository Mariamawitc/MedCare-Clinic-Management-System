import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const dashboardPathByRole: Record<string, string> = {
    patient: '/patient',
    doctor: '/doctor',
    receptionist: '/receptionist',
    admin: '/admin',
  };

  const dashboardPath = user?.role ? dashboardPathByRole[user.role] || '/patient' : '/patient';

  // Define visible nav items per role
  const navItemsByRole: Record<string, { label: string; key: string }[]> = {
    patient: [
      { label: 'Appointments', key: 'appointments' },
      { label: 'Prescriptions', key: 'prescriptions' },
      { label: 'Payments', key: 'payments' },
      { label: 'Profile', key: 'profile' },
    ],
    doctor: [
      { label: 'Appointments', key: 'appointments' },
      { label: 'Prescriptions', key: 'prescriptions' },
      { label: 'Profile', key: 'profile' },
    ],
    receptionist: [
      { label: 'Appointments', key: 'appointments' },
      { label: 'Profile', key: 'profile' },
    ],
    admin: [],
  };

  const visibleNavItems = user?.role ? navItemsByRole[user.role] || [] : [];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const getLinkClass = (path: string) => {
    const baseClass = "rounded-md px-3 py-2 transition-colors";
    const activeClass = isActive(path) 
      ? "bg-sky-100 text-sky-700 font-semibold" 
      : "hover:bg-slate-50 text-slate-700";
    return `${baseClass} ${activeClass}`;
  };

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

      <nav className="mt-6 flex flex-1 flex-col gap-2">
        <Link to={dashboardPath} className={getLinkClass(dashboardPath)}>Dashboard</Link>
        {visibleNavItems.map((item) => (
          <Link 
            key={item.key}
            to={`${dashboardPath}/${item.key}`} 
            className={getLinkClass(`${dashboardPath}/${item.key}`)}
          >
            {item.label}
          </Link>
        ))}
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
