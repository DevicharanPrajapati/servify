import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter both email and password.'); return; }
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-4">
            <LogIn size={26} />
          </div>
          <h1 className="text-3xl font-extrabold mb-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>Welcome back</h1>
          <p className="text-slate-400 text-sm">Sign in to manage your service requests</p>
        </div>

        <div className="glass-card p-7 sm:p-8">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/[0.08] border border-rose-500/20 text-rose-400 text-sm mb-5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="form-label">Email address</label>
              <div className="flex items-center gap-2.5 bg-black/40 border border-white/[0.06] rounded-lg px-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
                <Mail size={15} className="text-slate-500 shrink-0" />
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required
                  className="flex-1 bg-transparent text-slate-100 text-sm py-2.5 outline-none placeholder:text-slate-600" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="form-label">Password</label>
              <div className="flex items-center gap-2.5 bg-black/40 border border-white/[0.06] rounded-lg px-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
                <Lock size={15} className="text-slate-500 shrink-0" />
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
                  className="flex-1 bg-transparent text-slate-100 text-sm py-2.5 outline-none placeholder:text-slate-600" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-500 hover:text-slate-300 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary justify-center mt-2 py-3" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 font-semibold hover:text-violet-300 transition-colors">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
