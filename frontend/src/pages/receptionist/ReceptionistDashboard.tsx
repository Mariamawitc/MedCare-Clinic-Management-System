import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import StatCard from '../../components/ui/StatCard';
import clinicService, { AppointmentStatus } from '../../services/clinicService';

const statusStyles: Record<AppointmentStatus, string> = {
  approved: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-slate-100 text-slate-700',
  cancelled: 'bg-rose-100 text-rose-700',
  no_show: 'bg-rose-100 text-rose-700',
  rescheduled: 'bg-sky-100 text-sky-700',
};

const ReceptionistDashboard = () => {
  const queryClient = useQueryClient();
  const appointmentsQuery = useQuery(['appointments'], clinicService.getAppointments);
  const invoicesQuery = useQuery(['invoices'], clinicService.getInvoices);
  const [patientForm, setPatientForm] = useState({ fullName: '', email: '', phone: '', password: 'Patient123!' });

  const approveAppointment = useMutation(clinicService.approveAppointment, {
    onSuccess: () => queryClient.invalidateQueries(['appointments']),
  });

  const cancelAppointment = useMutation((id: number) => clinicService.cancelAppointment(id), {
    onSuccess: () => queryClient.invalidateQueries(['appointments']),
  });

  const registerPatient = useMutation(clinicService.registerPatient, {
    onSuccess: () => {
      setPatientForm({ fullName: '', email: '', phone: '', password: 'Patient123!' });
      queryClient.invalidateQueries(['users']);
    },
  });

  const appointments = appointmentsQuery.data || [];
  const invoices = invoicesQuery.data || [];
  const pendingCount = useMemo(() => appointments.filter((appointment) => appointment.status === 'pending').length, [appointments]);
  const approvedCount = useMemo(() => appointments.filter((appointment) => appointment.status === 'approved').length, [appointments]);
  const openBalance = invoices
    .filter((invoice) => !['paid', 'cancelled'].includes(invoice.status))
    .reduce((sum, invoice) => sum + Number(invoice.total_amount || 0), 0);

  const submitPatient = (event: FormEvent) => {
    event.preventDefault();
    const [firstName, ...lastNameParts] = patientForm.fullName.trim().split(/\s+/);
    if (!firstName || !patientForm.email || !patientForm.password) return;
    registerPatient.mutate({
      first_name: firstName,
      last_name: lastNameParts.join(' ') || 'Patient',
      email: patientForm.email,
      phone_number: patientForm.phone,
      password: patientForm.password,
      password_confirm: patientForm.password,
      role: 'patient',
    });
  };

  if (appointmentsQuery.isLoading) {
    return <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">Loading front desk workspace...</div>;
  }

  return (
    <section className="space-y-6">
      {appointmentsQuery.isError && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
          Could not load appointment requests. Check that the backend is running.
        </div>
      )}

      <header className="rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-medium uppercase text-sky-700">Front desk workspace</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Receptionist Dashboard</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Confirm appointments, manage patient arrival, and keep the clinic schedule moving.
          </p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Today&apos;s visits" value={appointments.length} subtitle="Visible" />
        <StatCard title="Pending requests" value={pendingCount} subtitle="Need action" />
        <StatCard title="Confirmed" value={approvedCount} subtitle="Approved" />
        <StatCard title="Open balances" value={`$${openBalance.toFixed(2)}`} subtitle="Front desk" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Appointment requests</h2>
              <p className="mt-1 text-sm text-slate-500">Approve or cancel current bookings.</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-lg border border-slate-100 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{appointment.patient_name || 'Patient'}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[appointment.status]}`}>
                        {appointment.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {appointment.appointment_date} {appointment.appointment_time} with {appointment.doctor_name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{appointment.reason || appointment.appointment_type}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 disabled:opacity-50"
                      disabled={appointment.status !== 'pending' || approveAppointment.isLoading}
                      onClick={() => approveAppointment.mutate(appointment.id)}
                    >
                      Confirm
                    </button>
                    <button
                      className="rounded-md bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700 disabled:opacity-50"
                      disabled={['cancelled', 'completed'].includes(appointment.status) || cancelAppointment.isLoading}
                      onClick={() => cancelAppointment.mutate(appointment.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!appointments.length && <p className="text-sm text-slate-500">No appointments found.</p>}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Register patient</h2>
          <form className="mt-5 space-y-4" onSubmit={submitPatient}>
            <input aria-label="Patient full name" placeholder="Patient full name" className="w-full" value={patientForm.fullName} onChange={(event) => setPatientForm({ ...patientForm, fullName: event.target.value })} />
            <input aria-label="Patient email" placeholder="Email address" type="email" className="w-full" value={patientForm.email} onChange={(event) => setPatientForm({ ...patientForm, email: event.target.value })} />
            <input aria-label="Phone number" placeholder="Phone number" className="w-full" value={patientForm.phone} onChange={(event) => setPatientForm({ ...patientForm, phone: event.target.value })} />
            <input aria-label="Temporary password" placeholder="Temporary password" type="password" className="w-full" value={patientForm.password} onChange={(event) => setPatientForm({ ...patientForm, password: event.target.value })} />
            <button className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50" disabled={registerPatient.isLoading}>
              {registerPatient.isLoading ? 'Registering...' : 'Register patient'}
            </button>
          </form>
          {registerPatient.isError && <p className="mt-3 text-sm text-rose-600">Could not register patient.</p>}
          {registerPatient.isSuccess && <p className="mt-3 text-sm text-emerald-700">Patient registered successfully.</p>}
        </div>
      </div>
    </section>
  );
};

export default ReceptionistDashboard;
