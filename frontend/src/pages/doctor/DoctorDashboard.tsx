const DoctorDashboard = () => (
  <section className="space-y-6">
    <header className="rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Doctor Dashboard</h1>
      <p className="mt-2 text-slate-600">Manage appointments, review patient records, and create prescriptions.</p>
    </header>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Today&apos;s schedule</h2>
        <p className="mt-3 text-slate-600">View consultations and patient details for the current day.</p>
      </div>
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Prescriptions</h2>
        <p className="mt-3 text-slate-600">Create new prescriptions and manage medication history.</p>
      </div>
    </div>
  </section>
);

export default DoctorDashboard;
