import React from 'react';
import useAuth from '../../hooks/useAuth';

const Topbar = () => {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-10 w-full bg-white py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button className="hidden rounded-md bg-slate-100 px-3 py-2 lg:inline">Menu</button>
          <div className="text-sm text-slate-600">Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''} 👋</div>
        </div>

        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 text-slate-500 hover:bg-slate-50">🔔</button>
          <div className="flex items-center gap-3">
            <div className="hidden text-sm text-slate-700 sm:block">{user?.email || ''}</div>
            <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-semibold">{user?.fullName?.split(' ').map((n: string) => n[0]).join('').slice(0,2) || 'MC'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
