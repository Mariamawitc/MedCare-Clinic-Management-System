import StatCard from '../../components/ui/StatCard';

type Appointment = {
  id: number;
  time: string;
  patient: string;
  reason: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  room: string;
};

type PatientNote = {
  id: number;
  patient: string;
  note: string;
  updated: string;
};

const todayAppointments: Appointment[] = [
  { id: 1, time: '08:30 AM', patient: 'Amina Yusuf', reason: 'Annual physical', status: 'Confirmed', room: '102' },
  { id: 2, time: '09:15 AM', patient: 'Omar Hassan', reason: 'Follow-up bloodwork', status: 'Pending', room: '103' },
  { id: 3, time: '10:00 AM', patient: 'Maya Wilson', reason: 'Medication review', status: 'Confirmed', room: '104' },
  { id: 4, time: '11:30 AM', patient: 'Lina Ahmed', reason: 'Cold symptoms', status: 'Confirmed', room: '101' },
];

const recentNotes: PatientNote[] = [
  {
    id: 1,
    patient: 'Amina Yusuf',
    note: 'Blood pressure remains stable on current medication. Continue the same plan and repeat review in 3 months.',
    updated: '16 min ago',
  },
  {
    id: 2,
    patient: 'Omar Hassan',
    note: 'Cough has improved since last visit. Recommend completing the current antibiotic course.',
    updated: '45 min ago',
  },
  {
    id: 3,
    patient: 'Maya Wilson',
    note: 'Review lab results and update thyroid dose based on latest TSH values.',
    updated: '1 hr ago',
  },
];

const statusStyles: Record<Appointment['status'], string> = {
  Confirmed: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Completed: 'bg-slate-100 text-slate-700',
  Cancelled: 'bg-rose-100 text-rose-700',
};

const DoctorDashboard = () => (
  <section className="space-y-6">
    <header className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-sky-700">Doctor workspace</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Doctor Dashboard</h1>
          <p className="mt-2 text-slate-600">Manage appointments, review patient charts, and create prescriptions.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
            New prescription
          </button>
          <button className="rounded-md bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700">
            Start consultation
          </button>
        </div>
      </div>
    </header>

    <div className="grid gap-6 lg:grid-cols-4">
      <StatCard title="Patients today" value={8} subtitle="Confirmed visits" />
      <StatCard title="Pending consults" value={2} subtitle="Needs review" />
      <StatCard title="Prescriptions" value={18} subtitle="This week" />
      <StatCard title="Lab results" value={5} subtitle="Unread" />
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Today&apos;s schedule</h2>
            <p className="mt-1 text-sm text-slate-500">Your appointments and patient details for the day.</p>
          </div>
          <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
            7:00 AM - 5:00 PM
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {todayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {appointment.time} · {appointment.patient}
                </div>
                <div className="mt-1 text-sm text-slate-500">{appointment.reason}</div>
                <div className="mt-1 text-sm text-slate-500">Room {appointment.room}</div>
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
          <h2 className="text-xl font-semibold text-slate-900">Prescription summary</h2>
          <p className="mt-3 text-slate-600">Review recent prescriptions and track medication follow-up items.</p>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Recent prescription</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">Levothyroxine 50mcg</div>
              <div className="mt-1 text-sm text-slate-500">Reviewed 20 minutes ago for patient Amina Yusuf.</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Prescription backlog</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">2 items pending</div>
              <div className="mt-1 text-sm text-slate-500">Complete before the end of the day.</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Recent patient notes</h2>
          <div className="mt-6 space-y-3">
            {recentNotes.map((note) => (
              <div key={note.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-900">{note.patient}</div>
                  <div className="text-sm text-slate-500">{note.updated}</div>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{note.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default DoctorDashboard;
