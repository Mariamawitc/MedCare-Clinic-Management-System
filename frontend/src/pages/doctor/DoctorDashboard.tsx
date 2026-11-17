import { useState, type FormEvent } from 'react';
import DashboardLayout, { type DashboardNavItem } from '../../components/DashboardLayout';
import { DataTable, MetricCard, Notice, PrimaryButton, SectionHeading, SecondaryButton } from '../../components/DashboardWidgets';

const navItems: DashboardNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⌂' }, { id: 'appointments', label: 'Appointments', icon: '▣' },
  { id: 'patients', label: 'Patients', icon: '♙' }, { id: 'prescriptions', label: 'Prescriptions', icon: '⌁' },
  { id: 'schedule', label: 'Schedule', icon: '▦' }, { id: 'reports', label: 'Reports', icon: '▤' },
  { id: 'profile', label: 'Profile', icon: '◉' }, { id: 'logout', label: 'Logout', icon: '↪' },
];

type Visit = { time: string; patient: string; reason: string; status: string };

const DoctorDashboard = () => {
  const [visits, setVisits] = useState<Visit[]>([
    { time: '09:00 AM', patient: 'Robert Fox', reason: 'Regular checkup', status: 'Completed' },
    { time: '10:00 AM', patient: 'Esther Howard', reason: 'Fever & cold', status: 'Pending' },
    { time: '11:00 AM', patient: 'Cameron Williamson', reason: 'Headache', status: 'Pending' },
    { time: '12:00 PM', patient: 'Wade Warren', reason: 'Back pain', status: 'Pending' },
  ]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptions, setPrescriptions] = useState([['Amoxicillin 500 mg', 'Esther Howard', 'May 06, 2024', 'Active'], ['Ibuprofen 200 mg', 'Robert Fox', 'May 02, 2024', 'Active']]);
  const [activeDay, setActiveDay] = useState('Tue');
  const [report, setReport] = useState('Appointments');
  const [savedMessage, setSavedMessage] = useState('');

  const createPrescription = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPrescriptions((current) => [[String(data.get('medicine')), String(data.get('patient')), 'Today', 'Active'], ...current]);
    setShowPrescriptionForm(false);
    setSavedMessage('Prescription added to the sample record.');
  };

  const content = (activeView: string) => {
    if (activeView === 'appointments') return <div><SectionHeading eyebrow="Clinical schedule" title="Today’s appointments" /><div className="space-y-3">{visits.map((visit, index) => <article key={visit.time} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div><p className="font-semibold text-slate-900">{visit.time} · {visit.patient}</p><p className="mt-1 text-sm text-slate-500">{visit.reason}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${visit.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{visit.status}</span>{visit.status === 'Pending' && <PrimaryButton onClick={() => setVisits((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, status: 'Completed' } : item))}>Mark complete</PrimaryButton>}</div></article>)}</div></div>;

    if (activeView === 'patients') return <div><SectionHeading eyebrow="Care team" title="Patient list" /><DataTable headers={['Patient', 'Last visit', 'Reason', 'Status']} rows={visits.map((visit) => [visit.patient, 'May 07, 2024', visit.reason, visit.status])} /><div className="mt-4 flex flex-wrap gap-2">{visits.map((visit) => <SecondaryButton key={visit.patient} onClick={() => setSelectedPatient(selectedPatient === visit.patient ? null : visit.patient)}>{selectedPatient === visit.patient ? 'Hide' : 'View'} {visit.patient}</SecondaryButton>)}</div>{selectedPatient && <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900"><strong>{selectedPatient}</strong><p className="mt-1">Sample chart: routine visit, medication list reviewed, follow-up recommended in 2 weeks.</p></div>}</div>;

    if (activeView === 'prescriptions') return <div className="space-y-4"><SectionHeading eyebrow="Medication orders" title="Prescriptions" action={<PrimaryButton onClick={() => { setShowPrescriptionForm(!showPrescriptionForm); setSavedMessage(''); }}>{showPrescriptionForm ? 'Close' : '+ New prescription'}</PrimaryButton>} />{savedMessage && <Notice tone="green">{savedMessage}</Notice>}{showPrescriptionForm && <form onSubmit={createPrescription} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3"><label className="text-sm font-medium text-slate-600">Patient<select name="patient" className="mt-2 w-full rounded-xl border-slate-200">{visits.map((visit) => <option key={visit.patient}>{visit.patient}</option>)}</select></label><label className="text-sm font-medium text-slate-600">Medication<input name="medicine" placeholder="Medication and dosage" className="mt-2 w-full rounded-xl border-slate-200" required /></label><div className="flex items-end"><PrimaryButton type="submit" className="w-full">Save prescription</PrimaryButton></div></form>}<DataTable headers={['Medication', 'Patient', 'Created', 'Status']} rows={prescriptions} /></div>;

    if (activeView === 'schedule') return <div><SectionHeading eyebrow="Availability" title="Weekly schedule" /><div className="mb-5 flex flex-wrap gap-2">{[['Sun','05'],['Mon','06'],['Tue','07'],['Wed','08'],['Thu','09'],['Fri','10'],['Sat','11']].map(([day,date]) => <button type="button" key={day} onClick={() => setActiveDay(day)} aria-pressed={activeDay === day} className={`rounded-xl border px-4 py-3 text-center ${activeDay === day ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'}`}><span className="block text-xs">{day}</span><span className="mt-1 block font-semibold">{date}</span></button>)}</div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="font-semibold text-slate-900">{activeDay}, May 2024</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{['09:00 AM · Consultation', '10:30 AM · Follow-up', '01:00 PM · Consultation', '03:30 PM · Available slot'].map((slot) => <div key={slot} className="rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{slot}</div>)}</div><SecondaryButton onClick={() => setSavedMessage('Availability updated for this sample schedule.')} className="mt-4">Save schedule</SecondaryButton>{savedMessage && <p className="mt-3 text-sm text-emerald-700">{savedMessage}</p>}</div></div>;

    if (activeView === 'reports') return <div><SectionHeading eyebrow="Practice overview" title="Reports" /><div className="mb-4 flex flex-wrap gap-2">{['Appointments', 'Patient outcomes', 'Prescriptions'].map((item) => <button type="button" key={item} onClick={() => setReport(item)} aria-pressed={report === item} className={`rounded-full px-4 py-2 text-sm font-semibold ${report === item ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>{item}</button>)}</div><DataTable headers={report === 'Appointments' ? ['Measure', 'This week', 'Last week'] : report === 'Patient outcomes' ? ['Measure', 'This month', 'Last month'] : ['Medication', 'Orders', 'Refills due']} rows={report === 'Appointments' ? [['Visits completed', '18', '16'], ['No-show rate', '4%', '6%'], ['Average wait', '14 min', '17 min']] : report === 'Patient outcomes' ? [['Follow-up adherence', '92%', '89%'], ['Patient satisfaction', '4.8 / 5', '4.7 / 5']] : [['Amoxicillin 500 mg', '8', '2'], ['Ibuprofen 200 mg', '6', '1']]} /></div>;

    if (activeView === 'profile') return <div><SectionHeading eyebrow="Account" title="Doctor profile" /><div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xl font-semibold text-slate-900">Demo Doctor</p><p className="mt-1 text-sm text-slate-500">Family medicine · General practice</p><p className="mt-4 text-sm text-slate-600">Clinic hours: Monday–Friday, 9:00 AM–5:00 PM</p><SecondaryButton className="mt-5" onClick={() => setSavedMessage('Profile details are up to date.')}>Edit profile</SecondaryButton>{savedMessage && <p className="mt-3 text-sm text-emerald-700">{savedMessage}</p>}</div></div>;

    return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
      { label: 'Today’s schedule', value: '8', note: '4 completed · 4 remaining', icon: '▣', tone: 'blue' as const, view: 'appointments' },
      { label: 'Patients', value: '126', note: 'Under your care', icon: '♙', tone: 'violet' as const, view: 'patients' },
      { label: 'Prescriptions', value: `${prescriptions.length}`, note: 'Active this month', icon: '⌁', tone: 'green' as const, view: 'prescriptions' },
      { label: 'Patient rating', value: '4.9 / 5', note: 'Based on 48 reviews', icon: '★', tone: 'amber' as const, view: 'reports' },
    ].map((card) => <MetricCard key={card.label} {...card} onClick={() => window.dispatchEvent(new CustomEvent('medcare:navigate-dashboard', { detail: card.view }))} />)}</div><div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><section><SectionHeading title="Today’s schedule" action={<button type="button" onClick={() => window.dispatchEvent(new CustomEvent('medcare:navigate-dashboard', { detail: 'appointments' }))} className="text-sm font-semibold text-blue-700">View all</button>} /><DataTable headers={['Time', 'Patient', 'Reason', 'Status']} rows={visits.slice(0, 3).map((visit) => [visit.time, visit.patient, visit.reason, visit.status])} /></section><section><SectionHeading title="Quick actions" /><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">{[{ label: 'Write prescription', view: 'prescriptions', icon: '⌁' }, { label: 'Review patients', view: 'patients', icon: '♙' }, { label: 'Edit schedule', view: 'schedule', icon: '▦' }].map((action) => <button key={action.view} type="button" onClick={() => window.dispatchEvent(new CustomEvent('medcare:navigate-dashboard', { detail: action.view }))} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left font-medium text-slate-800 hover:border-blue-300 hover:shadow-sm"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">{action.icon}</span>{action.label}<span className="ml-auto text-blue-700">→</span></button>)}</div></section></div></div>;
  };

  return <DashboardLayout role="doctor" items={navItems}>{(activeView) => content(activeView)}</DashboardLayout>;
};

export default DoctorDashboard;
