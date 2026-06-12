import StatCard from '../../components/ui/StatCard';

type Appointment = {
  id: number;
  time: string;
  doctor: string;
  reason: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
};

const sampleAppointments: Appointment[] = [
  { id: 1, time: '09:00 AM', doctor: 'Dr. Sarah Johnson', reason: 'Regular checkup', status: 'Confirmed' },
  { id: 2, time: '10:30 AM', doctor: 'Dr. Michael Brown', reason: 'Follow-up', status: 'Pending' },
  { id: 3, time: '02:00 PM', doctor: 'Dr. Alice Kim', reason: 'Lab results review', status: 'Confirmed' },
];

const PatientDashboard = () => (
  <section className="space-y-6">
    <header className="rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-semibold text-slate-900">Patient Dashboard</h1>
      <p className="mt-2 text-slate-600">Book appointments, view your medical records, and track payments.</p>
    </header>

    <div className="grid gap-6 lg:grid-cols-3">
      <StatCard title="Upcoming" value={3} subtitle="This month" />
      <StatCard title="Appointments" value={12} subtitle="Total" />
      <StatCard title="Payments" value="$450" subtitle="Due" />
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      <div className="col-span-2 rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Upcoming appointments</h2>
        <p className="mt-3 text-slate-600">You can manage your upcoming visits here.</p>

        <ul className="mt-6 space-y-4">
          {sampleAppointments.map((a) => (
            <li key={a.id} className="flex items-center justify-between rounded-md border border-slate-100 p-4">
              <div>
                <div className="text-sm font-semibold text-slate-900">{a.time} — {a.doctor}</div>
                <div className="text-sm text-slate-500">{a.reason}</div>
              </div>
              <div className="text-sm">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs ${a.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : a.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                  {a.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Medical history</h2>
        <p className="mt-3 text-slate-600">Recent diagnoses and prescriptions will appear here. Use the records section to view full details.</p>
      </div>
    </div>
  </section>
);

export default PatientDashboard;
