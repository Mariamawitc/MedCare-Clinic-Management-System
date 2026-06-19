import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import StatCard from '../../components/ui/StatCard';
import clinicService from '../../services/clinicService';

const roleStyles: Record<string, string> = {
  admin: 'bg-slate-100 text-slate-700',
  doctor: 'bg-sky-100 text-sky-700',
  receptionist: 'bg-amber-100 text-amber-700',
  patient: 'bg-emerald-100 text-emerald-700',
};

const AdminDashboard = () => {
  const usersQuery = useQuery(['users'], clinicService.getUsers);
  const appointmentsQuery = useQuery(['appointments'], clinicService.getAppointments);
  const invoicesQuery = useQuery(['invoices'], clinicService.getInvoices);
  const billingQuery = useQuery(['billing-records'], clinicService.getBillingRecords);

  const users = usersQuery.data || [];
  const appointments = appointmentsQuery.data || [];
  const invoices = invoicesQuery.data || [];
  const billingRecords = billingQuery.data || [];

  const staff = useMemo(() => users.filter((user) => user.role !== 'patient'), [users]);
  const patientCount = users.filter((user) => user.role === 'patient').length;
  const openInvoices = invoices.filter((invoice) => !['paid', 'cancelled'].includes(invoice.status));
  const openInvoiceTotal = openInvoices.reduce((sum, invoice) => sum + Number(invoice.total_amount || 0), 0);

  if (usersQuery.isLoading || appointmentsQuery.isLoading) {
    return <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">Loading admin dashboard...</div>;
  }

  return (
    <section className="space-y-6">
      {(usersQuery.isError || appointmentsQuery.isError) && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
          Could not load all admin data. Make sure you are logged in as an admin.
        </div>
      )}

      <header className="rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium uppercase text-sky-700">Clinic control center</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Monitor staff coverage, daily operations, patient flow, and clinic performance.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total patients" value={patientCount} subtitle="Registered" />
        <StatCard title="Active staff" value={staff.filter((user) => user.is_active).length} subtitle={`${staff.length} total`} />
        <StatCard title="Appointments" value={appointments.length} subtitle="Visible" />
        <StatCard title="Open invoices" value={`$${openInvoiceTotal.toFixed(2)}`} subtitle={`${openInvoices.length} open`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Staff management</h2>
              <p className="mt-1 text-sm text-slate-500">Review account roles and active status.</p>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {staff.map((member) => (
                  <tr key={member.id}>
                    <td className="px-4 py-4 font-medium text-slate-900">{[member.first_name, member.last_name].filter(Boolean).join(' ') || 'Unnamed user'}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${roleStyles[member.role] || roleStyles.admin}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{member.email}</td>
                    <td className="px-4 py-4 text-slate-600">{member.is_active ? 'Active' : 'Inactive'}</td>
                  </tr>
                ))}
                {!staff.length && (
                  <tr>
                    <td className="px-4 py-4 text-slate-500" colSpan={4}>No staff accounts found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Operations snapshot</h2>
          <div className="mt-5 space-y-3">
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-amber-800">
              <div className="font-medium">Pending appointments</div>
              <div className="mt-1 text-sm">{appointments.filter((appointment) => appointment.status === 'pending').length} bookings need confirmation.</div>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-emerald-800">
              <div className="font-medium">Billing records</div>
              <div className="mt-1 text-sm">{billingRecords.length} service records are available.</div>
            </div>
            <div className="rounded-lg border border-sky-100 bg-sky-50 p-4 text-sky-800">
              <div className="font-medium">Completed visits</div>
              <div className="mt-1 text-sm">{appointments.filter((appointment) => appointment.status === 'completed').length} appointments are marked complete.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
