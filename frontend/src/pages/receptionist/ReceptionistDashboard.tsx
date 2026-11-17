import { useState, type FormEvent } from 'react';
import DashboardLayout, { type DashboardNavItem } from '../../components/DashboardLayout';
import { DataTable, MetricCard, Notice, PrimaryButton, SectionHeading, SecondaryButton } from '../../components/DashboardWidgets';

const navItems: DashboardNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⌂' }, { id: 'appointments', label: 'Appointments', icon: '▣' },
  { id: 'patients', label: 'Patients', icon: '♙' }, { id: 'billing', label: 'Billing', icon: '$' },
  { id: 'reports', label: 'Reports', icon: '▤' }, { id: 'profile', label: 'Profile', icon: '◉' },
  { id: 'logout', label: 'Logout', icon: '↪' },
];

type Request = { patient: string; doctor: string; when: string; status: string };

const ReceptionistDashboard = () => {
  const [requests, setRequests] = useState<Request[]>([
    { patient: 'Robert Fox', doctor: 'Dr. James Wilson', when: 'May 07 · 10:00 AM', status: 'Pending' },
    { patient: 'Esther Howard', doctor: 'Dr. Sarah Johnson', when: 'May 07 · 11:00 AM', status: 'Pending' },
    { patient: 'Cameron Williamson', doctor: 'Dr. James Wilson', when: 'May 07 · 01:30 PM', status: 'Approved' },
    { patient: 'Wade Warren', doctor: 'Dr. Michael Brown', when: 'May 08 · 09:00 AM', status: 'Pending' },
  ]);
  const [patients, setPatients] = useState([['Marta Bekele', 'marta@example.test', 'Active'], ['Yonas Tadesse', 'yonas@example.test', 'Active']]);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [billing, setBilling] = useState([['MC-2024-0148', 'Marta Bekele', '$150', 'Due'], ['MC-2024-0147', 'Yonas Tadesse', '$80', 'Paid']]);
  const [notice, setNotice] = useState('');
  const [report, setReport] = useState('Daily summary');

  const registerPatient = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setPatients((current) => [[String(data.get('name')), String(data.get('email')), 'Active'], ...current]);
    setShowPatientForm(false);
    setNotice('Patient registered in the sample list.');
  };

  const content = (activeView: string) => {
    if (activeView === 'appointments') return <div><SectionHeading eyebrow="Front desk" title="Appointment requests" /><div className="mb-4 grid gap-4 sm:grid-cols-4">{[['Total requests','37','blue'],['Pending','15','amber'],['Approved','20','green'],['Cancelled','2','rose']].map(([label,value,tone]) => <MetricCard key={label} label={label} value={value} note="Today" icon={label === 'Pending' ? '◷' : '▣'} tone={tone as 'blue'|'amber'|'green'|'rose'} />)}</div><div className="space-y-3">{requests.map((request, index) => <article key={`${request.patient}-${request.when}`} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div><p className="font-semibold text-slate-900">{request.patient} <span className="font-normal text-slate-500">with {request.doctor}</span></p><p className="mt-1 text-sm text-slate-500">{request.when}</p></div><div className="flex items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${request.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : request.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{request.status}</span>{request.status === 'Pending' && <><PrimaryButton onClick={() => setRequests((current) => current.map((item,itemIndex) => itemIndex === index ? {...item,status:'Approved'} : item))}>Approve</PrimaryButton><SecondaryButton onClick={() => setRequests((current) => current.map((item,itemIndex) => itemIndex === index ? {...item,status:'Cancelled'} : item))}>Decline</SecondaryButton></>}</div></article>)}</div></div>;

    if (activeView === 'patients') return <div className="space-y-4"><SectionHeading eyebrow="Patient services" title="Patient registration" action={<PrimaryButton onClick={() => {setShowPatientForm(!showPatientForm);setNotice('');}}>{showPatientForm ? 'Close form' : '+ Add patient'}</PrimaryButton>} />{notice && <Notice tone="green">{notice}</Notice>}{showPatientForm && <form onSubmit={registerPatient} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3"><label className="text-sm font-medium text-slate-600">Full name<input name="name" required className="mt-2 w-full rounded-xl border-slate-200" placeholder="Patient name" /></label><label className="text-sm font-medium text-slate-600">Email<input name="email" type="email" required className="mt-2 w-full rounded-xl border-slate-200" placeholder="patient@example.com" /></label><div className="flex items-end"><PrimaryButton className="w-full">Save patient</PrimaryButton></div></form>}<DataTable headers={['Patient', 'Email', 'Status']} rows={patients} /></div>;

    if (activeView === 'billing') return <div><SectionHeading eyebrow="Payments" title="Billing & invoices" /><div className="mb-4 grid gap-4 sm:grid-cols-3"><MetricCard label="Collected today" value="$1,240" note="Updated just now" icon="$" tone="green" /><MetricCard label="Outstanding" value="$730" note="5 invoices" icon="◷" tone="amber" /><MetricCard label="Payments" value="22" note="Today" icon="▣" tone="blue" /></div><div className="space-y-3">{billing.map((invoice,index) => <article key={invoice[0]} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div><p className="font-semibold text-slate-900">{invoice[0]} · {invoice[1]}</p><p className="mt-1 text-sm text-slate-500">Invoice total: {invoice[2]}</p></div>{invoice[3] === 'Paid' ? <Notice tone="green">Paid</Notice> : <PrimaryButton onClick={() => setBilling((current) => current.map((item,itemIndex) => itemIndex === index ? [item[0],item[1],item[2],'Paid'] : item))}>Record payment</PrimaryButton>}</article>)}</div></div>;

    if (activeView === 'reports') return <div><SectionHeading eyebrow="Operations" title="Reports" /><div className="mb-4 flex flex-wrap gap-2">{['Daily summary','Appointment trends','Billing summary'].map((item) => <button type="button" key={item} onClick={() => setReport(item)} aria-pressed={report === item} className={`rounded-full px-4 py-2 text-sm font-semibold ${report === item ? 'bg-blue-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>{item}</button>)}</div><DataTable headers={report === 'Daily summary' ? ['Measure','Today','Target'] : report === 'Appointment trends' ? ['Day','Requests','Completed'] : ['Measure','Amount','Count']} rows={report === 'Daily summary' ? [['Appointments checked in','28','32'],['New patients','7','8'],['Average wait','11 min','15 min']] : report === 'Appointment trends' ? [['Monday','34','30'],['Tuesday','37','32'],['Wednesday','29','27']] : [['Collected','$1,240','22'],['Outstanding','$730','5'],['Refunded','$40','1']]} /></div>;

    if (activeView === 'profile') return <div><SectionHeading eyebrow="Account" title="Receptionist profile" /><div className="max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xl font-semibold text-slate-900">Demo Receptionist</p><p className="mt-1 text-sm text-slate-500">Front desk · Day shift</p><p className="mt-4 text-sm text-slate-600">Today’s shift: 8:00 AM – 4:00 PM</p><SecondaryButton className="mt-5" onClick={() => setNotice('Profile details are up to date.')}>Edit profile</SecondaryButton>{notice && <p className="mt-3 text-sm text-emerald-700">{notice}</p>}</div></div>;

    return <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
      { label:'Appointment requests', value:String(requests.filter((item)=>item.status==='Pending').length), note:'Need review', icon:'▣', tone:'amber' as const, view:'appointments' },
      { label:'Patients today', value:String(patients.length+5), note:'7 new registrations', icon:'♙', tone:'blue' as const, view:'patients' },
      { label:'Payments received', value:'$1,240', note:'22 transactions', icon:'$', tone:'green' as const, view:'billing' },
      { label:'Pending invoices', value:'5', note:'Total $730 due', icon:'◷', tone:'violet' as const, view:'billing' },
    ].map((card)=><MetricCard key={card.label} {...card} onClick={()=>window.dispatchEvent(new CustomEvent('medcare:navigate-dashboard',{detail:card.view}))}/>)}</div><div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><section><SectionHeading title="Appointment requests" action={<button type="button" onClick={()=>window.dispatchEvent(new CustomEvent('medcare:navigate-dashboard',{detail:'appointments'}))} className="text-sm font-semibold text-blue-700">View all</button>}/><DataTable headers={['Patient','Doctor','Date & time','Status']} rows={requests.slice(0,3).map((item)=>[item.patient,item.doctor,item.when,item.status])}/></section><section><SectionHeading title="Quick actions"/><div className="grid gap-3">{[{label:'Register a patient',view:'patients',icon:'♙'},{label:'Review requests',view:'appointments',icon:'▣'},{label:'Record a payment',view:'billing',icon:'$'}].map((item)=><button type="button" key={item.view} onClick={()=>window.dispatchEvent(new CustomEvent('medcare:navigate-dashboard',{detail:item.view}))} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left font-medium text-slate-800 hover:border-blue-300 hover:shadow-sm"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700">{item.icon}</span>{item.label}<span className="ml-auto text-blue-700">→</span></button>)}</div></section></div></div>;
  };

  return <DashboardLayout role="receptionist" items={navItems}>{(activeView)=>content(activeView)}</DashboardLayout>;
};

export default ReceptionistDashboard;
