import StatCard from '../../components/ui/StatCard';

type StaffMember = {
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On leave' | 'Pending';
};

type Alert = {
  title: string;
  detail: string;
  tone: 'info' | 'warning' | 'success';
};

const staffMembers: StaffMember[] = [
  { name: 'Dr. Sarah Johnson', role: 'Doctor', department: 'Cardiology', status: 'Active' },
  { name: 'Marta Collins', role: 'Receptionist', department: 'Front Desk', status: 'Active' },
  { name: 'Dr. Michael Brown', role: 'Doctor', department: 'Pediatrics', status: 'On leave' },
  { name: 'Amina Yusuf', role: 'Admin', department: 'Operations', status: 'Pending' },
];

const systemAlerts: Alert[] = [
  { title: 'Appointment load', detail: '18 bookings still need confirmation today.', tone: 'warning' },
  { title: 'Billing sync', detail: 'Payment records were updated 12 minutes ago.', tone: 'success' },
  { title: 'Doctor schedules', detail: 'Two doctors have open availability gaps this week.', tone: 'info' },
];

const reports = [
  { name: 'Daily appointments', value: '126 visits', change: '+14%' },
  { name: 'Revenue collected', value: '$18,420', change: '+8%' },
  { name: 'Patient registrations', value: '34 new', change: '+21%' },
];

const statusStyles: Record<StaffMember['status'], string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  'On leave': 'bg-amber-100 text-amber-700',
  Pending: 'bg-slate-100 text-slate-700',
};

const alertStyles: Record<Alert['tone'], string> = {
  info: 'border-sky-100 bg-sky-50 text-sky-800',
  warning: 'border-amber-100 bg-amber-50 text-amber-800',
  success: 'border-emerald-100 bg-emerald-50 text-emerald-800',
};

const AdminDashboard = () => (
  <section className="space-y-6">
    <header className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-sky-700">Clinic control center</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Monitor staff coverage, daily operations, patient flow, and clinic performance from one workspace.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Export report
          </button>
          <button className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
            Add staff
          </button>
        </div>
      </div>
    </header>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total patients" value="2,846" subtitle="+34 this week" />
      <StatCard title="Active staff" value={42} subtitle="6 departments" />
      <StatCard title="Appointments" value={126} subtitle="Today" />
      <StatCard title="Open invoices" value="$12.8k" subtitle="Needs review" />
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Staff management</h2>
            <p className="mt-1 text-sm text-slate-500">Review roles, departments, and account status.</p>
          </div>
          <button className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200">Manage</button>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-slate-100">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {staffMembers.map((member) => (
                <tr key={member.name}>
                  <td className="px-4 py-4 font-medium text-slate-900">{member.name}</td>
                  <td className="px-4 py-4 text-slate-600">{member.role}</td>
                  <td className="px-4 py-4 text-slate-600">{member.department}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[member.status]}`}>
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">System alerts</h2>
        <div className="mt-5 space-y-3">
          {systemAlerts.map((alert) => (
            <div key={alert.title} className={`rounded-lg border p-4 ${alertStyles[alert.tone]}`}>
              <div className="font-medium">{alert.title}</div>
              <div className="mt-1 text-sm opacity-90">{alert.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      {reports.map((report) => (
        <div key={report.name} className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="text-sm text-slate-500">{report.name}</div>
          <div className="mt-3 flex items-end justify-between gap-3">
            <div className="text-2xl font-semibold text-slate-900">{report.value}</div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">{report.change}</span>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default AdminDashboard;
