import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, ChevronDown, LogOut, Layout, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors duration-150 ${isActive(path) ? 'text-white' : 'text-slate-400 hover:text-white'}`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#08090d]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <Wrench className="text-violet-500 w-6 h-6" />
            <span className="text-xl font-extrabold tracking-tight brand-gradient" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Servify
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/providers" className={navLinkClass('/providers')}>Find Services</Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] hover:border-violet-500/30 transition-all duration-200"
                >
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full bg-slate-800" />
                  <span className="text-sm font-semibold text-slate-200 max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-48 rounded-xl border border-white/[0.07] bg-[#161924] shadow-2xl overflow-hidden">
                    <div className="px-4 py-2.5 text-xs text-slate-500 border-b border-white/[0.05]">
                      Logged as <span className="font-semibold text-slate-300 capitalize">{user.role}</span>
                    </div>
                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors">
                      <Layout size={14} /> Dashboard
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/[0.05] transition-colors border-t border-white/[0.05]">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className={navLinkClass('/login')}>Login</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Sign Up Free</Link>
              </div>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/[0.05] py-4 flex flex-col gap-1">
            <Link to="/providers" className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors">
              Find Services
            </Link>
            {user ? (
              <>
                <div className="px-3 py-2 flex items-center gap-3 border-t border-white/[0.05] mt-1 pt-3">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-slate-800" />
                  <div>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <Link to="/dashboard" className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors flex items-center gap-2">
                  <Layout size={14} /> Dashboard
                </Link>
                <button onClick={handleLogout} className="px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/[0.06] transition-colors flex items-center gap-2">
                  <LogOut size={14} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors">Login</Link>
                <Link to="/register" className="btn-primary mt-1 justify-center">Sign Up Free</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
