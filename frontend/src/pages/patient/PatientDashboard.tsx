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

const formatMoney = (value?: string) => `$${Number(value || 0).toFixed(2)}`;

const PatientDashboard = () => {
  const queryClient = useQueryClient();
  const [booking, setBooking] = useState({
    doctor: '',
    appointment_date: '',
    appointment_time: '',
    appointment_type: 'consultation',
    reason: '',
  });

  const appointmentsQuery = useQuery(['appointments'], clinicService.getAppointments);
  const doctorsQuery = useQuery(['doctors'], clinicService.getDoctors);
  const profileQuery = useQuery(['patient-profile'], clinicService.getPatientProfile);
  const prescriptionsQuery = useQuery(['prescriptions'], clinicService.getPrescriptions);
  const invoicesQuery = useQuery(['invoices'], clinicService.getInvoices);

  const createAppointment = useMutation(clinicService.createAppointment, {
    onSuccess: () => {
      setBooking({ doctor: '', appointment_date: '', appointment_time: '', appointment_type: 'consultation', reason: '' });
      queryClient.invalidateQueries(['appointments']);
    },
  });

  const appointments = appointmentsQuery.data || [];
  const invoices = invoicesQuery.data || [];
  const prescriptions = prescriptionsQuery.data || [];
  const profile = profileQuery.data;

  const openBalance = useMemo(
    () => invoices
      .filter((invoice) => !['paid', 'cancelled'].includes(invoice.status))
      .reduce((sum, invoice) => sum + Number(invoice.total_amount || 0), 0),
    [invoices],
  );

  const submitBooking = (event: FormEvent) => {
    event.preventDefault();
    if (!booking.doctor || !booking.appointment_date || !booking.appointment_time || !booking.reason) return;
    createAppointment.mutate({ ...booking, doctor: Number(booking.doctor) });
  };

  if (appointmentsQuery.isLoading || doctorsQuery.isLoading || profileQuery.isLoading) {
    return <div className="rounded-2xl bg-white p-6 text-slate-600 shadow-sm">Loading patient workspace...</div>;
  }

  const hasError = appointmentsQuery.isError || doctorsQuery.isError || profileQuery.isError;

  return (
    <section className="space-y-6">
      {hasError && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
          Could not load all patient data. Check that the backend is running and your account has a patient profile.
        </div>
      )}

      <header className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-sky-700">Patient portal</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Patient Dashboard</h1>
            <p className="mt-2 text-slate-600">Book visits, review records, and keep your care plan on track.</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Upcoming visits" value={appointments.filter((a) => ['pending', 'approved', 'rescheduled'].includes(a.status)).length} subtitle="Open" />
        <StatCard title="Total visits" value={appointments.length} subtitle="All time" />
        <StatCard title="Balance due" value={formatMoney(String(openBalance))} subtitle="Open" />
        <StatCard title="Active meds" value={prescriptions.reduce((sum, item) => sum + item.items.length, 0)} subtitle="Current" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Book appointment</h2>
          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={submitBooking}>
            <select className="w-full" value={booking.doctor} onChange={(event) => setBooking({ ...booking, doctor: event.target.value })}>
              <option value="">Select doctor</option>
              {(doctorsQuery.data || []).map((doctor) => (
                <option key={doctor.id} value={doctor.id}>{doctor.user_name} - {doctor.specialization_display}</option>
              ))}
            </select>
            <select className="w-full" value={booking.appointment_type} onChange={(event) => setBooking({ ...booking, appointment_type: event.target.value })}>
              <option value="consultation">Consultation</option>
              <option value="follow_up">Follow-up</option>
              <option value="checkup">Checkup</option>
              <option value="procedure">Procedure</option>
            </select>
            <input className="w-full" type="date" value={booking.appointment_date} onChange={(event) => setBooking({ ...booking, appointment_date: event.target.value })} />
            <input className="w-full" type="time" value={booking.appointment_time} onChange={(event) => setBooking({ ...booking, appointment_time: event.target.value })} />
            <textarea className="min-h-24 md:col-span-2" placeholder="Reason for visit" value={booking.reason} onChange={(event) => setBooking({ ...booking, reason: event.target.value })} />
            <button className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60" disabled={createAppointment.isLoading}>
              {createAppointment.isLoading ? 'Booking...' : 'Book appointment'}
            </button>
          </form>
          {createAppointment.isError && <p className="mt-3 text-sm text-rose-600">Could not book this appointment.</p>}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Medical summary</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div>Blood type: <span className="font-medium text-slate-900">{profile?.blood_type || 'Not recorded'}</span></div>
            <div>Allergies: <span className="font-medium text-slate-900">{profile?.allergies || 'None recorded'}</span></div>
            <div>Conditions: <span className="font-medium text-slate-900">{profile?.chronic_conditions || 'None recorded'}</span></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Appointments</h2>
          <div className="mt-5 space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex flex-col gap-3 rounded-lg border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{appointment.appointment_date} at {appointment.appointment_time}</div>
                  <div className="mt-1 text-sm text-slate-500">{appointment.doctor_name} - {appointment.reason}</div>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[appointment.status]}`}>
                  {appointment.status.replace('_', ' ')}
                </span>
              </div>
            ))}
            {!appointments.length && <p className="text-sm text-slate-500">No appointments yet.</p>}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Invoices</h2>
          <div className="mt-5 space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="rounded-lg border border-slate-100 p-4">
                <div className="font-semibold text-slate-900">{invoice.invoice_number}</div>
                <div className="mt-1 text-sm text-slate-500">{formatMoney(invoice.total_amount)} - {invoice.status}</div>
              </div>
            ))}
            {!invoices.length && <p className="text-sm text-slate-500">No invoices found.</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientDashboard;
