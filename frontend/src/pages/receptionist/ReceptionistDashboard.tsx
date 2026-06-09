const ReceptionistDashboard = () => (
  <section className="space-y-6">
    <header className="rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Receptionist Dashboard</h1>
      <p className="mt-2 text-slate-600">Schedule appointments, approve bookings, and check patient records.</p>
    </header>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Appointment requests</h2>
        <p className="mt-3 text-slate-600">Review new bookings and manage confirmed visits.</p>
      </div>
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Patient registration</h2>
        <p className="mt-3 text-slate-600">Register new patients and update existing records.</p>
      </div>
    </div>
  </section>
);

export default ReceptionistDashboard;
