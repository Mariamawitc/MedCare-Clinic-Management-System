const AdminDashboard = () => (
  <section className="space-y-6">
    <header className="rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
      <p className="mt-2 text-slate-600">Manage users, doctors, clinic operations, and view system reports.</p>
    </header>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Clinic reports</h2>
        <p className="mt-3 text-slate-600">Generate appointment, revenue, and performance summaries.</p>
      </div>
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Staff management</h2>
        <p className="mt-3 text-slate-600">Add doctors, receptionists, and administrators to the system.</p>
      </div>
    </div>
  </section>
);

export default AdminDashboard;
