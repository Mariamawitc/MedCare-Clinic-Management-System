import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const specialties = [
  { icon: '♡', name: 'Cardiology', detail: 'Heart health, prevention, and treatment.' },
  { icon: '♙', name: 'Pediatrics', detail: 'Care for children and adolescents.' },
  { icon: '◉', name: 'Neurology', detail: 'Brain, nerve, and wellness care.' },
  { icon: '⌁', name: 'Orthopedics', detail: 'Bone and joint care.' },
  { icon: '⚗', name: 'Laboratory', detail: 'Convenient testing and results.' },
];

const doctors = [
  { name: 'Dr. John Smith', specialty: 'Cardiologist', experience: '12 years experience', rating: '4.9' },
  { name: 'Dr. Sarah Johnson', specialty: 'Pediatrician', experience: '10 years experience', rating: '4.8' },
  { name: 'Dr. Michael Brown', specialty: 'Neurologist', experience: '15 years experience', rating: '4.9' },
];

const Home = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-16 pb-10">
      <section id="home" className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#eef6ff] via-white to-[#e6f0ff] px-6 py-12 sm:px-12 sm:py-16 lg:min-h-[480px] lg:px-16">
        <div className="absolute -right-12 -top-12 -z-10 h-96 w-96 rounded-full bg-blue-100/80" />
        <div className="absolute right-[14%] top-16 -z-10 h-72 w-72 rounded-full border-[28px] border-white/80 bg-gradient-to-br from-sky-100 to-blue-200 shadow-inner" />
        <div className="relative z-10 max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-blue-700 shadow-sm"><span className="text-base">✚</span> Care for your whole family</p>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">Your Health,<br /><span className="text-blue-700">Our Priority</span></h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">Book appointments with trusted doctors, manage your health records, and keep your care in one place.</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => navigate('/auth/login')} className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800">Book appointment</button>
            <a href="#services" className="rounded-xl px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-white/80">Explore services</a>
          </div>
          <div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-600">
            <span><strong className="block text-2xl text-slate-900">15+</strong> Years of care</span>
            <span><strong className="block text-2xl text-slate-900">25+</strong> Specialists</span>
            <span><strong className="block text-2xl text-slate-900">4.9/5</strong> Patient rating</span>
          </div>
        </div>
        <div aria-hidden="true" className="absolute bottom-0 right-[8%] hidden h-[390px] w-[310px] items-center justify-center rounded-t-[10rem] bg-gradient-to-b from-blue-200 to-blue-50 lg:flex">
          <div className="mb-10 grid h-56 w-56 place-items-center rounded-full border-[14px] border-white/70 bg-gradient-to-br from-white to-sky-100 text-[7rem] text-blue-700 shadow-2xl">⚕</div>
          <div className="absolute bottom-10 right-[-15px] rounded-2xl bg-white p-4 shadow-xl"><p className="font-semibold text-blue-700">Trusted care</p><p className="text-xs text-slate-500">Focused on you</p></div>
        </div>
      </section>

      <section id="services" className="scroll-mt-28">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Care that fits</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Our specialties</h2></div>
          <p className="text-sm text-slate-500">Choose a service to learn more</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {specialties.map((specialty, index) => (
            <button key={specialty.name} type="button" onClick={() => setSelectedSpecialty(selectedSpecialty === specialty.name ? null : specialty.name)} aria-pressed={selectedSpecialty === specialty.name} className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${selectedSpecialty === specialty.name ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${['bg-rose-50 text-rose-500', 'bg-amber-50 text-amber-500', 'bg-indigo-50 text-indigo-500', 'bg-red-50 text-red-500', 'bg-violet-50 text-violet-500'][index]}`}>{specialty.icon}</span>
              <span className="mt-4 block font-semibold text-slate-900">{specialty.name}</span>
              <span className="mt-1 block text-sm leading-5 text-slate-500">{selectedSpecialty === specialty.name ? specialty.detail : 'Personalized care from experienced professionals.'}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="doctors" className="scroll-mt-28">
        <div className="mb-6 flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Meet your care team</p><h2 className="mt-1 text-2xl font-bold text-slate-900">Our doctors</h2></div><button type="button" onClick={() => setSelectedDoctor(selectedDoctor ? null : doctors[0].name)} className="text-sm font-semibold text-blue-700 hover:text-blue-900">{selectedDoctor ? 'Close details' : 'View all'}</button></div>
        <div className="grid gap-5 md:grid-cols-3">
          {doctors.map((doctor, index) => (
            <article key={doctor.name} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-lg">
              <div className={`grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-3xl ${['bg-sky-100 text-sky-700', 'bg-rose-100 text-rose-700', 'bg-emerald-100 text-emerald-700'][index]}`}>♙</div>
              <div className="min-w-0 flex-1"><h3 className="font-semibold text-slate-900">{doctor.name}</h3><p className="text-sm text-slate-500">{doctor.specialty}</p><p className="mt-1 text-xs text-slate-400">{doctor.experience}</p><p className="mt-2 text-xs text-amber-600">★ {doctor.rating}</p></div>
              <div className="flex shrink-0 flex-col gap-2"><button type="button" onClick={() => setSelectedDoctor(selectedDoctor === doctor.name ? null : doctor.name)} className="text-xs font-semibold text-blue-700">{selectedDoctor === doctor.name ? 'Hide' : 'Details'}</button><button type="button" onClick={() => navigate('/auth/login')} className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800">Book now</button></div>
            </article>
          ))}
        </div>
        {selectedDoctor && <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900"><strong>{selectedDoctor}</strong> is accepting appointments. Sign in to view available times and request a visit.</div>}
      </section>

      <section id="about" className="scroll-mt-28 rounded-3xl bg-slate-900 px-6 py-10 text-white sm:px-10"><p className="text-sm font-semibold uppercase tracking-widest text-sky-300">About MedCare</p><h2 className="mt-2 text-2xl font-bold">A more connected clinic experience</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">From your first appointment to follow-up care, MedCare helps patients and clinic teams stay organized and connected.</p></section>
      <div id="contact" className="scroll-mt-28 text-center text-sm text-slate-500">Questions? Contact the clinic reception team for assistance.</div>
    </div>
  );
};

export default Home;
