import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export type DashboardNavItem = { id: string; label: string; icon: string };

const palettes = {
  patient: 'from-violet-600 to-indigo-600',
  doctor: 'from-teal-600 to-emerald-600',
  receptionist: 'from-teal-600 to-cyan-700',
  admin: 'from-slate-900 to-slate-800',
} as const;

type DashboardLayoutProps = {
  role: keyof typeof palettes;
  items: DashboardNavItem[];
  children: (activeView: string) => ReactNode;
};

const DashboardLayout = ({ role, items, children }: DashboardLayoutProps) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const user = authService.getUser();
  const firstName = user?.first_name || 'there';
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'MedCare User';
  const activeLabel = items.find((item) => item.id === activeView)?.label || 'Dashboard';

  useEffect(() => {
    const handleDashboardNavigation = (event: Event) => {
      const targetView = (event as CustomEvent<string>).detail;
      if (items.some((item) => item.id === targetView)) setActiveView(targetView);
    };
    window.addEventListener('medcare:navigate-dashboard', handleDashboardNavigation);
    return () => window.removeEventListener('medcare:navigate-dashboard', handleDashboardNavigation);
  }, [items]);

  const openView = (id: string) => {
    if (id === 'logout') {
      authService.logout();
      navigate('/auth/login', { replace: true });
      return;
    }
    setActiveView(id);
    setMobileMenuOpen(false);
    setProfileOpen(false);
  };

  const navButton = (item: DashboardNavItem) => (
    <button
      key={item.id}
      type="button"
      onClick={() => openView(item.id)}
      aria-current={activeView === item.id ? 'page' : undefined}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${activeView === item.id ? 'bg-white/20 font-semibold text-white shadow-sm' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}
    >
      <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-sm">{item.icon}</span>
      <span>{item.label}</span>
      {item.id === 'notifications' && <span className="ml-auto rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">3</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fc] md:flex">
      <aside className={`hidden w-[245px] shrink-0 flex-col bg-gradient-to-b ${palettes[role]} p-4 text-white md:flex`}>
        <div className="flex items-center gap-2 px-2 py-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-xl font-bold text-sky-700">✚</span>
          <span className="text-lg font-semibold tracking-tight">MedCare</span>
        </div>
        <nav aria-label="Dashboard navigation" className="mt-7 space-y-1.5">
          {items.map(navButton)}
        </nav>
        <div className="mt-auto border-t border-white/15 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 font-semibold">{firstName.charAt(0).toUpperCase()}</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{fullName}</p>
              <p className="text-xs capitalize text-white/70">{role}</p>
            </div>
          </div>
          <button type="button" onClick={() => openView('logout')} className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/75 hover:bg-white/10 hover:text-white">
            <span aria-hidden="true">↪</span> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 md:hidden" aria-expanded={mobileMenuOpen} aria-label="Toggle dashboard menu">☰</button>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">MedCare workspace</p>
                <h1 className="truncate text-lg font-semibold text-slate-900">{activeLabel}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {searchOpen && <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dashboard" aria-label="Search dashboard" className="hidden w-48 rounded-xl border border-slate-200 px-3 py-2 text-sm md:block" />}
              <button type="button" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full text-lg text-slate-600 hover:bg-slate-100">⌕</button>
              <div className="relative">
                <button type="button" onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }} aria-label="Notifications" aria-expanded={notificationsOpen} className="relative grid h-10 w-10 place-items-center rounded-full text-lg text-slate-600 hover:bg-slate-100">♧<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500" /></button>
                {notificationsOpen && <div className="absolute right-0 top-12 z-30 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"><p className="font-semibold text-slate-900">Notifications</p><p className="mt-3 border-t pt-3 text-sm text-slate-600">You have 3 updates for today.</p><p className="mt-2 text-xs text-slate-400">Click Notifications in the sidebar for details.</p></div>}
              </div>
              <div className="relative">
                <button type="button" onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }} aria-label="Open profile menu" aria-expanded={profileOpen} className="grid h-10 w-10 place-items-center rounded-full bg-sky-100 font-semibold text-sky-800">{firstName.charAt(0).toUpperCase()}</button>
                {profileOpen && <div className="absolute right-0 top-12 z-30 w-56 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"><p className="font-semibold text-slate-900">{fullName}</p><p className="mt-1 text-xs capitalize text-slate-500">{role} account</p><button type="button" onClick={() => openView('profile')} className="mt-3 w-full rounded-lg bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">View profile</button><button type="button" onClick={() => openView('logout')} className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">Sign out</button></div>}
              </div>
            </div>
          </div>
          {searchOpen && <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dashboard" aria-label="Search dashboard" className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm md:hidden" />}
          {mobileMenuOpen && <nav aria-label="Mobile dashboard navigation" className={`mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-gradient-to-r ${palettes[role]} p-3 sm:grid-cols-3`}>{items.map(navButton)}</nav>}
        </header>
        <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-7 sm:py-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Welcome back, {firstName} <span aria-hidden="true">👋</span></p>
              <p className="mt-1 text-xs text-slate-400">Here&apos;s your health and clinic overview.</p>
            </div>
            <p className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">{new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}</p>
          </div>
          {children(activeView)}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
