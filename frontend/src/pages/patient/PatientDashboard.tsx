const PatientDashboard = () => (
  <section className="space-y-6">
    <header className="rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Patient Dashboard</h1>
      <p className="mt-2 text-slate-600">Book appointments, view your medical records, and track payments.</p>
    </header>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Upcoming appointments</h2>
        <p className="mt-3 text-slate-600">Patients can view scheduled consultations and appointment times.</p>
      </div>
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Medical history</h2>
        <p className="mt-3 text-slate-600">Access your diagnoses, prescriptions, and lab results.</p>
      </div>
    </div>
  </section>
);

export default PatientDashboard;
