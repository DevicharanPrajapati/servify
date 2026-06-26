import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiCall } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import { Search, MapPin, Briefcase, SlidersHorizontal, ShieldCheck } from 'lucide-react';

export default function Providers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam   = searchParams.get('search') || '';

  const [providers, setProviders]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [searchInput, setSearchInput] = useState(searchParam);
  const [activeCategory, setActiveCategory] = useState(categoryParam);

  useEffect(() => {
    setSearchInput(searchParam);
    setActiveCategory(categoryParam);
  }, [categoryParam, searchParam]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      let q = '';
      if (activeCategory) q += `category=${activeCategory}`;
      if (searchInput) q += `${q ? '&' : ''}search=${encodeURIComponent(searchInput)}`;
      const data = await apiCall(`/providers?${q}`);
      setProviders(data); setError('');
    } catch (err) {
      setError('Failed to load providers.'); console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProviders(); }, [activeCategory, searchParam]);

  const handleSearch = (e) => {
    e.preventDefault();
    const p = {};
    if (activeCategory) p.category = activeCategory;
    if (searchInput) p.search = searchInput;
    setSearchParams(p);
    fetchProviders();
  };

  const handleCategorySelect = (cat) => {
    const p = {};
    if (cat) p.category = cat;
    if (searchInput) p.search = searchInput;
    setSearchParams(p);
    setActiveCategory(cat);
  };

  const categories = ['', 'electrician', 'plumber', 'mechanic', 'cleaner'];
  const catLabels  = { '': 'All Services', electrician: 'Electrician', plumber: 'Plumber', mechanic: 'Mechanic', cleaner: 'Cleaner' };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Directory</span>
        <h1 className="text-2xl sm:text-3xl font-bold mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Qualified Service Professionals</h1>
        <p className="text-slate-400 text-sm mt-1">Browse listings, verify credentials, and book appointments directly.</p>
      </div>

      {/* Search + Filter Card */}
      <div className="glass-card p-4 sm:p-5 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex flex-1 items-center gap-3 bg-black/40 border border-white/[0.06] rounded-lg px-3 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
            <Search size={17} className="text-slate-500 shrink-0" />
            <input type="text" placeholder="Search providers by name or bio keywords..."
              value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-transparent text-slate-100 text-sm py-2.5 outline-none placeholder:text-slate-600" />
          </div>
          <button type="submit" className="btn-primary whitespace-nowrap">Search</button>
        </form>

        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-500 mr-1">
            <SlidersHorizontal size={12} /> Filter:
          </span>
          {categories.map((cat) => (
            <button key={cat} onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                ${activeCategory === cat
                  ? 'bg-violet-500/15 border-violet-500/50 text-white'
                  : 'bg-transparent border-white/[0.07] text-slate-400 hover:text-white hover:border-slate-500'}`}
              style={{ fontFamily: 'Outfit, sans-serif' }}>
              {catLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="spinner mb-4" />
          <p className="text-slate-500 text-sm">Searching directory...</p>
        </div>
      ) : error ? (
        <div className="glass-card p-10 text-center text-rose-400 font-semibold">{error}</div>
      ) : providers.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="text-slate-400 text-lg font-semibold mb-1">No professionals found</p>
          <p className="text-slate-600 text-sm">Try adjusting your search or clear the category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {providers.map((p) => {
            const catLabel = p.providerInfo?.category
              ? p.providerInfo.category.charAt(0).toUpperCase() + p.providerInfo.category.slice(1)
              : 'Specialist';
            return (
              <div key={p._id} className="glass-card flex flex-col h-full p-6">
                {/* Card header */}
                <div className="flex items-center gap-4 mb-5">
                  <img src={p.avatar} alt={p.name}
                    className="w-14 h-14 rounded-full bg-slate-800 border border-white/[0.07] shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-semibold truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>{p.name}</h3>
                      <ShieldCheck size={15} className="text-cyan-400 shrink-0" title="Verified" />
                    </div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-violet-500/[0.08] text-violet-300 border border-violet-500/15">
                      {catLabel}
                    </span>
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-sm text-slate-500 leading-relaxed mb-5 flex-1 line-clamp-3">
                  {p.providerInfo?.bio || 'No description provided.'}
                </p>

                {/* Stats */}
                <div className="flex flex-col gap-2 text-xs text-slate-500 border-t border-white/[0.05] pt-4 mb-5">
                  <div className="flex items-center gap-2">
                    <StarRating rating={p.providerInfo?.rating || 5} size={13} />
                    <span className="font-semibold text-slate-300">{p.providerInfo?.rating || 5.0}</span>
                    <span>({p.providerInfo?.reviewsCount || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={13} className="text-slate-600" />
                    <span>{p.providerInfo?.experience || 0} years experience</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-600" />
                    <span className="truncate">{p.address || 'Location not listed'}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-white/[0.05] pt-4">
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wide">Rate/hr</p>
                    <p className="text-xl font-extrabold text-cyan-400">${p.providerInfo?.hourlyRate || 0}
                      <span className="text-sm font-normal text-slate-500">/hr</span>
                    </p>
                  </div>
                  <Link to={`/providers/${p._id}`} className="btn-primary text-xs px-4 py-2">
                    View Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
