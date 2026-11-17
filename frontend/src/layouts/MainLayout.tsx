import { Link, useLocation } from 'react-router-dom';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isDashboard = ['/patient', '/doctor', '/receptionist', '/admin'].includes(pathname);

  if (isDashboard) return <div className="min-h-screen bg-[#f4f7fc]">{children}</div>;

  return (
    <div className="min-h-screen bg-[#f7f9fd]">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-lg font-bold text-blue-700"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-700 text-lg text-white">✚</span>MedCare</Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="/#home" className="hover:text-blue-700">Home</a>
            <a href="/#doctors" className="hover:text-blue-700">Doctors</a>
            <a href="/#services" className="hover:text-blue-700">Services</a>
            <a href="/#about" className="hover:text-blue-700">About Us</a>
            <a href="/#contact" className="hover:text-blue-700">Contact</a>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <Link to="/auth/login" className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-500 hover:text-blue-700">Login</Link>
            <Link to="/auth/register" className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800">Register</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-8 sm:py-10">{children}</main>
      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">© {new Date().getFullYear()} MedCare Clinic. Care that keeps you connected.</footer>
    </div>
  );
};

export default MainLayout;
