import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiCall, useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import BookingModal from '../components/BookingModal';
import { MapPin, Briefcase, Mail, Phone, ShieldCheck, AlertCircle, ChevronLeft, Calendar } from 'lucide-react';

export default function ProviderProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProviderDetails = async () => {
    setLoading(true);
    try {
      const data = await apiCall(`/providers/${id}`);
      setProvider(data);
      setError('');
    } catch (err) {
      setError('Service Provider profile not found.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderDetails();
  }, [id]);

  const handleBookingClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '7rem 0' }}>
        <div className="spinner" style={{ marginBottom: '1.25rem' }} />
        <p style={{ color: 'var(--text-desc)', fontSize: '0.95rem' }}>Loading profile details...</p>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3.5rem 2.5rem' }}>
          <AlertCircle size={44} style={{ color: 'var(--color-danger)', marginBottom: '1.25rem' }} />
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontFamily: 'var(--font-title)' }}>Profile Error</h3>
          <p style={{ color: 'var(--text-desc)', marginBottom: '2rem', fontSize: '0.95rem' }}>{error || 'Profile could not be loaded.'}</p>
          <Link to="/providers" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <ChevronLeft size={16} /> Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const categoryLabel = provider.providerInfo?.category 
    ? provider.providerInfo.category.charAt(0).toUpperCase() + provider.providerInfo.category.slice(1)
    : 'Specialist';

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <Link to="/providers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-desc)', fontSize: '0.9rem', marginBottom: '2rem' }} className="nav-link">
        <ChevronLeft size={16} /> Back to Directory
      </Link>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Profile Card Header Banner */}
        <div className="glass-card" style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'center', background: 'linear-gradient(135deg, rgba(16, 18, 26, 0.75) 0%, rgba(139, 92, 246, 0.02) 100%)', borderColor: 'rgba(255,255,255,0.06)' }}>
          <img src={provider.avatar} alt={provider.name} style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'var(--bg-surface-elevated)', border: '2px solid var(--border-line)' }} />
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{provider.name}</h1>
              <ShieldCheck size={22} style={{ color: 'var(--brand-accent)' }} title="Verified Pro Account" />
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.75rem', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.08)', color: '#c084fc', border: '1px solid rgba(139, 92, 246, 0.15)', display: 'inline-block', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {categoryLabel}
            </span>

            <div style={{ display: 'flex', gap: '2rem', marginTop: '1.25rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-desc)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <StarRating rating={provider.providerInfo?.rating || 5} size={15} />
                <strong style={{ color: 'var(--text-main)', marginLeft: '0.15rem' }}>{provider.providerInfo?.rating || 5.0}</strong>
                <span style={{ color: 'var(--text-muted)' }}>({provider.providerInfo?.reviewsCount || 0} reviews)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Briefcase size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{provider.providerInfo?.experience || 0} Years Experience</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{provider.address || 'Address not listed'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-side details layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '2.5rem' }} className="grid-2">
          {/* Left Main Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Bio Card */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', fontFamily: 'var(--font-title)', borderBottom: '1px solid var(--border-line)', paddingBottom: '0.75rem', fontWeight: 600 }}>Professional Bio</h3>
              <p style={{ color: 'var(--text-desc)', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{provider.providerInfo?.bio || 'No profile description available.'}</p>
            </div>

            {/* Reviews list Card */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', fontFamily: 'var(--font-title)', borderBottom: '1px solid var(--border-line)', paddingBottom: '0.75rem', fontWeight: 600 }}>Customer Reviews</h3>

              {provider.providerInfo?.reviews?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <p style={{ color: 'var(--text-desc)', fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>No reviews yet</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Be the first customer to hire {provider.name} and share your feedback!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {provider.providerInfo?.reviews?.map((rev, index) => (
                    <div key={index} style={{ borderBottom: index < provider.providerInfo.reviews.length - 1 ? '1px solid var(--border-line)' : 'none', paddingBottom: index < provider.providerInfo.reviews.length - 1 ? '1.75rem' : '0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                        <div>
                          <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text-main)' }}>{rev.customerName}</strong>
                          <div style={{ marginTop: '0.25rem' }}>
                            <StarRating rating={rev.rating} size={13} />
                          </div>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(rev.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-desc)', fontSize: '0.9rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-line)', padding: '1rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.5 }}>
                        "{rev.comment || 'No text comment provided.'}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column Booking/Contact Widget */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Booking Summary Panel */}
            <div className="glass-card" style={{ borderColor: 'rgba(139, 92, 246, 0.15)', background: 'linear-gradient(135deg, rgba(16, 18, 26, 0.9) 0%, rgba(139, 92, 246, 0.02) 100%)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontFamily: 'var(--font-title)', fontWeight: 600 }}>Booking Options</h3>
              
              <div style={{ background: 'var(--bg-app)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-line)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hourly Fee</span>
                  <p style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--brand-accent)' }}>${provider.providerInfo?.hourlyRate || 0}<span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-desc)' }}>/hr</span></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Est. block (2h)</span>
                  <p style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-main)' }}>${(provider.providerInfo?.hourlyRate || 0) * 2}</p>
                </div>
              </div>

              {user?.role === 'provider' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-line)' }}>
                  <AlertCircle size={16} />
                  <span>Bookings are restricted for provider accounts.</span>
                </div>
              ) : (
                <button onClick={handleBookingClick} className="btn btn-primary btn-block" style={{ padding: '0.9rem' }}>
                  <Calendar size={16} /> Book Appointment
                </button>
              )}
            </div>

            {/* Direct Coordinates card */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontFamily: 'var(--font-title)', borderBottom: '1px solid var(--border-line)', paddingBottom: '0.5rem', fontWeight: 600 }}>Contact info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ padding: '0.55rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-line)', color: 'var(--text-muted)' }}>
                    <Mail size={16} />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Email Address</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-desc)', textOverflow: 'ellipsis', overflow: 'hidden', display: 'block', whiteSpace: 'nowrap' }}>{provider.email}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ padding: '0.55rem', borderRadius: '6px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-line)', color: 'var(--text-muted)' }}>
                    <Phone size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Phone Number</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-desc)' }}>{provider.phone || 'Not listed'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        provider={provider}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onBookingSuccess={fetchProviderDetails}
      />
    </div>
  );
}
