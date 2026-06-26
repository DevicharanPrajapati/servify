import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Lightbulb, Droplet, Car, Sparkles, Shield, Clock, Star, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    let q = '';
    if (searchTerm) q += `search=${encodeURIComponent(searchTerm)}`;
    if (category) q += `${q ? '&' : ''}category=${category}`;
    navigate(`/providers?${q}`);
  };

  const categories = [
    { name: 'electrician', label: 'Electrician', icon: <Lightbulb size={28} />, desc: 'Wiring, panels, fixtures & diagnostics' },
    { name: 'plumber',     label: 'Plumber',     icon: <Droplet size={28} />,   desc: 'Leaks, drainage, fittings & pipe repairs' },
    { name: 'mechanic',    label: 'Mechanic',     icon: <Car size={28} />,       desc: 'Brakes, tune-ups, diagnostics & oil changes' },
    { name: 'cleaner',     label: 'Cleaner',      icon: <Sparkles size={28} />,  desc: 'Deep cleaning, offices & commercial spaces' },
  ];

  const features = [
    { icon: <Shield size={22} />, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', title: '100% Identity Vetted', desc: 'Every provider passes full screening and license verification before listing on the platform.' },
    { icon: <Clock size={22} />,  color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', title: 'Instant Appointments', desc: 'Pick your time slot and confirm your booking instantly without waiting for callbacks.' },
    { icon: <Star size={22} />,   color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', title: 'Transparent Pricing', desc: 'Hourly rates are set upfront — no surprise fees after the service is complete.' },
  ];

  const steps = [
    { num: '01', color: 'text-violet-500/20', title: 'Locate Specialist', desc: 'Filter by trade, compare reviews, and select the best-rated provider at the right price.' },
    { num: '02', color: 'text-blue-500/20',   title: 'Choose Timeslot',   desc: 'Pick a convenient date and time block and describe your job clearly.' },
    { num: '03', color: 'text-cyan-500/20',   title: 'Get It Done',       desc: 'The provider visits, completes the job, and you leave a verified star rating.' },
  ];

  return (
    <div className="min-h-screen">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 text-center">
        <div className="trust-pill mb-6">
          <Users size={13} /> ★ Trusted by 5,000+ local homeowners
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] mb-5 brand-gradient tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Verified Local Pros.<br className="hidden sm:block" /> Booked Instantly.
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect with certified plumbers, electricians, mechanics and cleaners in your area with transparent pricing and verified reviews.
        </p>

        {/* Search card */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto glass-card p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            <div className="flex flex-1 items-center gap-3 bg-black/40 rounded-lg px-3 border border-white/[0.06]">
              <Search size={18} className="text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="What do you need help with? (e.g. leaking sink...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent text-slate-100 text-sm py-3 outline-none placeholder:text-slate-600"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select sm:w-44 w-full"
            >
              <option value="">All Services</option>
              <option value="electrician">Electrician</option>
              <option value="plumber">Plumber</option>
              <option value="mechanic">Mechanic</option>
              <option value="cleaner">Cleaner</option>
            </select>
            <button type="submit" className="btn-primary justify-center whitespace-nowrap px-6">
              Find Providers
            </button>
          </div>
        </form>
      </section>

      {/* ─── Categories ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Services Catalog</span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Browse Core Trades & Specialties</h2>
          <p className="text-slate-400 text-sm mt-1">Click a category to find matching professionals near you.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/providers?category=${cat.name}`)}
              className="glass-card flex flex-col items-center text-center p-7 cursor-pointer group w-full"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-violet-500/[0.08] border border-violet-500/20 text-violet-400 mb-5 transition-all duration-300 group-hover:bg-violet-500 group-hover:text-white group-hover:-translate-y-0.5 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]">
                {cat.icon}
              </div>
              <h3 className="text-lg font-semibold mb-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>{cat.label}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{cat.desc}</p>
              <div className="flex items-center gap-1 mt-4 text-xs font-semibold text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Browse <ArrowRight size={13} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="glass-card p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 border-violet-500/[0.08] bg-gradient-to-br from-[#10121a] to-violet-500/[0.02]">
          {features.map((f, i) => (
            <div key={i} className="flex gap-4">
              <div className={`shrink-0 p-3 rounded-xl border ${f.color} h-fit`}>
                {f.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>{f.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Simple Workflow</span>
        <h2 className="text-2xl sm:text-3xl font-bold mt-1 mb-10" style={{ fontFamily: 'Outfit, sans-serif' }}>Book in 3 Simple Steps</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="glass-card p-7 text-left">
              <div className={`text-5xl font-extrabold ${s.color} mb-3`} style={{ fontFamily: 'Outfit, sans-serif' }}>{s.num}</div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
