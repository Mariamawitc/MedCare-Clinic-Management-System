import { useMemo, useState } from 'react';
import StatCard from '../../components/ui/StatCard';

type AppointmentStatus = 'Pending' | 'Confirmed' | 'Checked in';

type AppointmentRequest = {
  id: number;
  patient: string;
  doctor: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
};

type CheckIn = {
  id: number;
  patient: string;
  appointment: string;
  balance: string;
  status: 'Waiting' | 'Ready' | 'Completed';
};

const initialAppointments: AppointmentRequest[] = [
  { id: 1, patient: 'Lina Ahmed', doctor: 'Dr. Sarah Johnson', time: '09:30 AM', reason: 'Follow-up visit', status: 'Pending' },
  { id: 2, patient: 'Noah Davis', doctor: 'Dr. Michael Brown', time: '10:15 AM', reason: 'Pediatric consult', status: 'Confirmed' },
  { id: 3, patient: 'Grace Miller', doctor: 'Dr. Alice Kim', time: '11:45 AM', reason: 'Lab result review', status: 'Pending' },
  { id: 4, patient: 'Ethan Clark', doctor: 'Dr. Sarah Johnson', time: '01:00 PM', reason: 'Blood pressure check', status: 'Checked in' },
];

const initialCheckIns: CheckIn[] = [
  { id: 1, patient: 'Ethan Clark', appointment: '01:00 PM with Dr. Sarah Johnson', balance: '$0', status: 'Ready' },
  { id: 2, patient: 'Maya Wilson', appointment: '01:30 PM with Dr. Alice Kim', balance: '$35', status: 'Waiting' },
  { id: 3, patient: 'Omar Hassan', appointment: '02:00 PM with Dr. Michael Brown', balance: '$0', status: 'Waiting' },
];

const appointmentStatusStyles: Record<AppointmentStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Confirmed: 'bg-sky-100 text-sky-700',
  'Checked in': 'bg-emerald-100 text-emerald-700',
};

const checkInStatusStyles: Record<CheckIn['status'], string> = {
  Waiting: 'bg-amber-100 text-amber-700',
  Ready: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-slate-100 text-slate-700',
};

const ReceptionistDashboard = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [checkIns, setCheckIns] = useState(initialCheckIns);

  const pendingCount = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'Pending').length,
    [appointments],
  );

  const checkedInCount = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'Checked in').length,
    [appointments],
  );

  const updateAppointmentStatus = (id: number, status: AppointmentStatus) => {
    setAppointments((current) =>
      current.map((appointment) => (appointment.id === id ? { ...appointment, status } : appointment)),
    );
  };

  const updateCheckInStatus = (id: number, status: CheckIn['status']) => {
    setCheckIns((current) => current.map((checkIn) => (checkIn.id === id ? { ...checkIn, status } : checkIn)));
  };

  return (
    <section className="space-y-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-sky-700">Front desk workspace</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Receptionist Dashboard</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Confirm appointments, manage patient arrival, and keep the clinic schedule moving.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              New appointment
            </button>
            <button className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
              Register patient
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Today&apos;s visits" value={appointments.length} subtitle="Scheduled" />
        <StatCard title="Pending requests" value={pendingCount} subtitle="Need action" />
        <StatCard title="Checked in" value={checkedInCount} subtitle="In clinic" />
        <StatCard title="Open balances" value="$35" subtitle="At front desk" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Appointment requests</h2>
              <p className="mt-1 text-sm text-slate-500">Approve bookings and check patients in for today.</p>
            </div>
            <select className="w-40 text-sm" defaultValue="today">
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="pending">Pending only</option>
            </select>
          </div>

          <div className="mt-6 space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-lg border border-slate-100 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{appointment.patient}</h3>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${appointmentStatusStyles[appointment.status]}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {appointment.time} with {appointment.doctor}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{appointment.reason}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={appointment.status !== 'Pending'}
                      onClick={() => updateAppointmentStatus(appointment.id, 'Confirmed')}
                    >
                      Confirm
                    </button>
                    <button
                      className="rounded-md bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={appointment.status === 'Checked in'}
                      onClick={() => updateAppointmentStatus(appointment.id, 'Checked in')}
                    >
                      Check in
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Patient check-in</h2>
            <div className="mt-5 space-y-3">
              {checkIns.map((checkIn) => (
                <div key={checkIn.id} className="rounded-lg border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-900">{checkIn.patient}</div>
                      <div className="mt-1 text-sm text-slate-500">{checkIn.appointment}</div>
                      <div className="mt-1 text-sm text-slate-600">Balance: {checkIn.balance}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${checkInStatusStyles[checkIn.status]}`}>
                      {checkIn.status}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={checkIn.status === 'Ready'}
                      onClick={() => updateCheckInStatus(checkIn.id, 'Ready')}
                    >
                      Mark ready
                    </button>
                    <button
                      className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={checkIn.status === 'Completed'}
                      onClick={() => updateCheckInStatus(checkIn.id, 'Completed')}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Quick patient registration</h2>
            <form className="mt-5 space-y-4">
              <input aria-label="Patient full name" placeholder="Patient full name" className="w-full" />
              <div className="grid gap-3 sm:grid-cols-2">
                <input aria-label="Phone number" placeholder="Phone number" className="w-full" />
                <input aria-label="Date of birth" type="date" className="w-full" />
              </div>
              <textarea aria-label="Visit note" placeholder="Visit note" className="min-h-24 w-full" />
              <button type="button" className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700">
                Save draft
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReceptionistDashboard;
