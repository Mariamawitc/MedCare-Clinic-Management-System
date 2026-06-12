import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {!isAuthenticated ? (
        <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link to="/" className="text-xl font-semibold text-sky-700">MedCare</Link>
            <nav className="flex gap-4 text-slate-600">
              <Link to="/auth/login" className="hover:text-sky-700">Login</Link>
              <Link to="/auth/register" className="hover:text-sky-700">Register</Link>
            </nav>
          </div>
        </header>
      ) : null}

      <div className={isAuthenticated ? 'flex' : ''}>
        {isAuthenticated && <Sidebar />}

        <div className="flex-1">
          {isAuthenticated && <Topbar />}
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
