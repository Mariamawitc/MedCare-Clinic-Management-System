import { useMemo } from 'react';
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

const DoctorDashboard = () => {
  const queryClient = useQueryClient();
  const appointmentsQuery = useQuery(['appointments'], clinicService.getAppointments);
  const prescriptionsQuery = useQuery(['prescriptions'], clinicService.getPrescriptions);

  const completeAppointment = useMutation(clinicService.completeAppointment, {
    onSuccess: () => queryClient.invalidateQueries(['appointments']),
  });

  const appointments = appointmentsQuery.data || [];
  const prescriptions = prescriptionsQuery.data || [];

  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter((appointment) => appointment.appointment_date === today);
  const pendingCount = appointments.filter((appointment) => appointment.status === 'pending').length;
  const activePrescriptions = prescriptions.filter((prescription) => prescription.status === 'active');

  const recentPrescription = useMemo(() => activePrescriptions[0], [activePrescriptions]);

  if (appointmentsQuery.isLoading) {
    return <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">Loading doctor workspace...</div>;
  }

  return (
    <section className="space-y-6">
      {appointmentsQuery.isError && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
          Could not load appointments. Check that the backend is running and your account has a doctor profile.
        </div>
      )}

      <header className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-sky-700">Doctor workspace</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Doctor Dashboard</h1>
            <p className="mt-2 text-slate-600">Manage appointments, review patient charts, and track prescriptions.</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Patients today" value={todayAppointments.length} subtitle="Scheduled" />
        <StatCard title="Pending consults" value={pendingCount} subtitle="Needs review" />
        <StatCard title="Prescriptions" value={activePrescriptions.length} subtitle="Active" />
        <StatCard title="Completed visits" value={appointments.filter((appointment) => appointment.status === 'completed').length} subtitle="All time" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Today&apos;s schedule</h2>
              <p className="mt-1 text-sm text-slate-500">Appointments assigned to you for today.</p>
            </div>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">{today}</span>
          </div>

          <div className="mt-6 space-y-3">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="rounded-lg border border-slate-100 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{appointment.appointment_time} - {appointment.patient_name}</div>
                    <div className="mt-1 text-sm text-slate-500">{appointment.reason || appointment.appointment_type}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[appointment.status]}`}>
                      {appointment.status.replace('_', ' ')}
                    </span>
                    <button
                      className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800 disabled:opacity-50"
                      disabled={appointment.status === 'completed' || completeAppointment.isLoading}
                      onClick={() => completeAppointment.mutate(appointment.id)}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!todayAppointments.length && <p className="text-sm text-slate-500">No appointments scheduled for today.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Prescription summary</h2>
            <div className="mt-5 rounded-lg bg-slate-50 p-4">
              <div className="text-sm text-slate-500">Recent prescription</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">
                {recentPrescription?.items[0]?.medication_name || 'No active prescriptions'}
              </div>
              {recentPrescription && (
                <div className="mt-1 text-sm text-slate-500">
                  {recentPrescription.patient_name} - {recentPrescription.prescription_date}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">All appointments</h2>
            <div className="mt-5 space-y-3">
              {appointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="rounded-lg border border-slate-100 p-4">
                  <div className="font-semibold text-slate-900">{appointment.patient_name || 'Patient'}</div>
                  <div className="mt-1 text-sm text-slate-500">{appointment.appointment_date} at {appointment.appointment_time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDashboard;
