import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, ShieldCheck, Mail, Lock, Phone, MapPin, DollarSign, Wrench, Briefcase, AlertCircle } from 'lucide-react';

export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('customer');
  const [phone, setPhone]       = useState('');
  const [address, setAddress]   = useState('');

  const [category, setCategory]       = useState('electrician');
  const [bio, setBio]                 = useState('');
  const [hourlyRate, setHourlyRate]   = useState('');
  const [experience, setExperience]   = useState('');

  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in name, email and password.'); return; }
    setLoading(true); setError('');
    const userData = { name, email, password, role, phone, address };
    if (role === 'provider') {
      userData.providerInfo = { category, bio, hourlyRate: Number(hourlyRate) || 0, experience: Number(experience) || 0 };
    }
    try {
      await register(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally { setLoading(false); }
  };

  const Field = ({ icon: Icon, type = 'text', placeholder, value, onChange, required }) => (
    <div className="flex items-center gap-2.5 bg-black/40 border border-white/[0.06] rounded-lg px-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
      <Icon size={15} className="text-slate-500 shrink-0" />
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} required={required}
        className="flex-1 bg-transparent text-slate-100 text-sm py-2.5 outline-none placeholder:text-slate-600" />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4">
            <UserPlus size={26} />
          </div>
          <h1 className="text-3xl font-extrabold mb-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>Create Account</h1>
          <p className="text-slate-400 text-sm">Join Servify to book services or find clients</p>
        </div>

        <div className="glass-card p-7 sm:p-8">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/[0.08] border border-rose-500/20 text-rose-400 text-sm mb-5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Role toggle */}
          <div className="flex gap-3 mb-6">
            {[
              { value: 'customer', label: 'Customer', icon: User },
              { value: 'provider', label: 'Service Pro', icon: ShieldCheck },
            ].map(({ value, label, icon: Icon }) => (
              <button key={value} type="button" onClick={() => setRole(value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
                  ${role === value
                    ? value === 'customer'
                      ? 'bg-violet-500/10 border-violet-500/40 text-white'
                      : 'bg-cyan-500/10 border-cyan-500/40 text-white'
                    : 'bg-transparent border-white/[0.06] text-slate-500 hover:text-slate-300'}`}
                style={{ fontFamily: 'Outfit, sans-serif' }}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="form-label">Full Name</label>
              <Field icon={User} placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="form-label">Email Address</label>
              <Field icon={Mail} type="email" placeholder="jane@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="form-label">Password</label>
              <Field icon={Lock} type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="form-label">Phone</label>
                <Field icon={Phone} placeholder="+1 (555) 123-4567" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="form-label">Location</label>
                <Field icon={MapPin} placeholder="City, State" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
            </div>

            {/* Provider section */}
            {role === 'provider' && (
              <div className="mt-2 pt-5 border-t border-white/[0.06] flex flex-col gap-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest" style={{ fontFamily: 'Outfit, sans-serif' }}>Professional Details</h3>

                <div className="flex flex-col gap-1.5">
                  <label className="form-label">Service Specialty</label>
                  <div className="flex items-center gap-2.5 bg-black/40 border border-white/[0.06] rounded-lg px-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
                    <Wrench size={15} className="text-slate-500 shrink-0" />
                    <select value={category} onChange={e => setCategory(e.target.value)} className="flex-1 bg-transparent text-slate-100 text-sm py-2.5 outline-none">
                      <option value="electrician">Electrician</option>
                      <option value="plumber">Plumber</option>
                      <option value="mechanic">Mechanic</option>
                      <option value="cleaner">Cleaner</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="form-label">Hourly Rate ($)</label>
                    <div className="flex items-center gap-2.5 bg-black/40 border border-white/[0.06] rounded-lg px-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
                      <DollarSign size={15} className="text-slate-500 shrink-0" />
                      <input type="number" placeholder="45" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} required={role === 'provider'}
                        className="flex-1 bg-transparent text-slate-100 text-sm py-2.5 outline-none placeholder:text-slate-600" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="form-label">Experience (yrs)</label>
                    <div className="flex items-center gap-2.5 bg-black/40 border border-white/[0.06] rounded-lg px-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
                      <Briefcase size={15} className="text-slate-500 shrink-0" />
                      <input type="number" placeholder="5" value={experience} onChange={e => setExperience(e.target.value)} required={role === 'provider'}
                        className="flex-1 bg-transparent text-slate-100 text-sm py-2.5 outline-none placeholder:text-slate-600" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="form-label">Professional Bio</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} required={role === 'provider'} rows={3}
                    placeholder="Describe your skills, certifications, and the services you provide..."
                    className="form-input resize-none" />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary justify-center mt-2 py-3" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
