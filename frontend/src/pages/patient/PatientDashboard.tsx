import StatCard from '../../components/ui/StatCard';

type Appointment = {
  id: number;
  time: string;
  doctor: string;
  reason: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
};

type MedicalRecord = {
  id: number;
  title: string;
  date: string;
  status: string;
  doctor: string;
};

const sampleAppointments: Appointment[] = [
  { id: 1, time: '09:00 AM', doctor: 'Dr. Sarah Johnson', reason: 'Regular checkup', status: 'Confirmed' },
  { id: 2, time: '10:30 AM', doctor: 'Dr. Michael Brown', reason: 'Follow-up', status: 'Pending' },
  { id: 3, time: '02:00 PM', doctor: 'Dr. Alice Kim', reason: 'Lab results review', status: 'Confirmed' },
];

const medicalRecords: MedicalRecord[] = [
  { id: 1, title: 'Blood pressure check', date: 'Jun 3, 2026', status: 'Reviewed', doctor: 'Dr. Sarah Johnson' },
  { id: 2, title: 'Allergy panel', date: 'May 27, 2026', status: 'Pending', doctor: 'Dr. Michael Brown' },
  { id: 3, title: 'Vitamin D level', date: 'May 12, 2026', status: 'Reviewed', doctor: 'Dr. Alice Kim' },
];

const statusStyles: Record<Appointment['status'], string> = {
  Confirmed: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Completed: 'bg-slate-100 text-slate-700',
  Cancelled: 'bg-rose-100 text-rose-700',
};

const PatientDashboard = () => (
  <section className="space-y-6">
    <header className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-sky-700">Patient portal</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Patient Dashboard</h1>
          <p className="mt-2 text-slate-600">Book visits, review records, and keep your care plan on track.</p>
        </div>
        <button className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
          Book appointment
        </button>
      </div>
    </header>

    <div className="grid gap-6 lg:grid-cols-4">
      <StatCard title="Upcoming visits" value={3} subtitle="This month" />
      <StatCard title="Total visits" value={12} subtitle="Completed" />
      <StatCard title="Balance due" value="$450" subtitle="Open" />
      <StatCard title="Active meds" value={3} subtitle="Current" />
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Upcoming appointments</h2>
            <p className="mt-1 text-sm text-slate-500">Your next visit details and appointment status.</p>
          </div>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">Next visit: Jun 20</span>
        </div>

        <div className="mt-6 space-y-3">
          {sampleAppointments.map((appointment) => (
            <div key={appointment.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">{appointment.time} · {appointment.doctor}</div>
                <div className="mt-1 text-sm text-slate-500">{appointment.reason}</div>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[appointment.status]}`}>
                {appointment.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Medical summary</h2>
          <p className="mt-3 text-slate-600">Recent lab results, diagnoses, and care notes in one place.</p>
          <div className="mt-6 space-y-3">
            {medicalRecords.map((record) => (
              <div key={record.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{record.title}</div>
                    <div className="mt-1 text-sm text-slate-500">{record.doctor}</div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    {record.status}
                  </span>
                </div>
                <div className="mt-3 text-sm text-slate-500">{record.date}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Payment overview</h2>
          <p className="mt-3 text-slate-600">Keep track of upcoming visits, insurance claims, and outstanding balances.</p>
          <div className="mt-6 space-y-4 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-slate-500">Next due</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">$165</div>
              </div>
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Paid</div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-slate-500">Insurance claim</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">Pending review</div>
              </div>
              <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PatientDashboard;
