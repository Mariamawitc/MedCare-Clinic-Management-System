import { Link } from 'react-router-dom';

const LandingPage = () => (
  <main className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
    <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="space-y-8">
        <div className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700">
          MedCare Clinic Management System
        </div>
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Simplify clinic care for patients, doctors, and staff.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Coordinate appointments, manage patient records, and keep billing on track with a clean, responsive clinic management workspace.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            to="/auth/register"
            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
          >
            Get started
          </Link>
          <Link
            to="/auth/login"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Login
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Patients</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">Book visits</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Doctors</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">Review charts</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Receptionists</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">Manage schedules</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl sm:p-12">
        <div className="rounded-3xl bg-slate-800 p-6 shadow-inner">
          <h2 className="text-xl font-semibold">Clinic operations in one place</h2>
          <p className="mt-3 text-slate-300">Monitor appointments, prescriptions, and billing from a single dashboard designed for healthcare teams.</p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-2xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Appointment scheduling</p>
              <p className="mt-2 font-semibold text-white">Real-time availability tracking</p>
            </div>
            <div className="rounded-2xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Patient records</p>
              <p className="mt-2 font-semibold text-white">Secure medical history access</p>
            </div>
            <div className="rounded-2xl bg-slate-950 p-4">
              <p className="text-sm text-slate-400">Billing & payments</p>
              <p className="mt-2 font-semibold text-white">Track invoices and due balances</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mt-20 grid gap-10 lg:grid-cols-3">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Modern clinic workflow</h3>
        <p className="mt-3 text-slate-600">Everything your care team needs to run appointments, manage patient intake, and close visits efficiently.</p>
      </div>
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Patient engagement</h3>
        <p className="mt-3 text-slate-600">Patients can view upcoming appointments, track records, and stay informed with clear visit summaries.</p>
      </div>
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Secure clinical data</h3>
        <p className="mt-3 text-slate-600">Designed to keep sensitive records organized and available only to your authenticated clinic staff.</p>
      </div>
    </section>
  </main>
);

export default LandingPage;
