import React, { useState, useEffect } from 'react';
import { useAuth, apiCall } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import { Calendar, Clock, DollarSign, FileText, Check, X, Star, Sparkles, PlusCircle, AlertCircle, Wrench, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review states (customer)
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await apiCall('/bookings');
      setBookings(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch booking records.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Provider actions
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      await apiCall(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBookings();
    } catch (err) {
      alert(err.message || 'Failed to update request status.');
    }
  };

  // Customer actions
  const handleReviewSubmit = async (e, bookingId) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError('');

    try {
      await apiCall(`/bookings/${bookingId}/review`, {
        method: 'POST',
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      setActiveReviewId(null);
      setReviewRating(5);
      setReviewComment('');
      fetchBookings();
    } catch (err) {
      setReviewError(err.message || 'Failed to post review feedback.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '450px', margin: '0 auto', padding: '3.5rem 2.5rem' }}>
          <ShieldAlert size={44} style={{ color: 'var(--color-danger)', marginBottom: '1.25rem' }} />
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontFamily: 'var(--font-title)', fontWeight: 600 }}>Access Restricted</h3>
          <p style={{ color: 'var(--text-desc)', marginBottom: '2rem', fontSize: '0.95rem' }}>Please sign in to view your user dashboard details.</p>
          <a href="/login" className="btn btn-primary">Login Now</a>
        </div>
      </div>
    );
  }

  const completedBookings = bookings.filter(b => b.status === 'completed');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => b.status === 'accepted');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="container" style={{ paddingTop: '3rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <span style={{ color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Control Panel</span>
          <h2 style={{ fontSize: '2.25rem', marginTop: '0.25rem', fontWeight: 800 }}>Account Dashboard</h2>
          <p style={{ color: 'var(--text-desc)', fontSize: '0.95rem' }}>Welcome back, {user.name} ({user.role === 'provider' ? 'Service Specialist' : 'Customer'}).</p>
        </div>
        {user.role === 'customer' && (
          <a href="/providers" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={16} /> Book New Service
          </a>
        )}
      </div>

      {error && (
        <div className="glass-card" style={{ color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'rgba(244,63,94,0.2)' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* DUAL DASHBOARD VIEW: PROVIDER */}
      {user.role === 'provider' && (
        <>
          {/* Metrics Grid Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
            <div className="glass-card" style={{ borderLeft: '4px solid var(--brand-accent)', background: 'linear-gradient(135deg, rgba(16, 18, 26, 0.75) 0%, rgba(6,182,212,0.02) 100%)', padding: '1.5rem 1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Total Earnings</span>
                  <h3 style={{ fontSize: '2.25rem', marginTop: '0.35rem', fontWeight: 800, color: 'var(--text-main)' }}>${totalEarnings}</h3>
                </div>
                <div style={{ padding: '0.6rem', background: 'rgba(6,182,212,0.08)', color: 'var(--brand-accent)', borderRadius: '8px', border: '1px solid rgba(6,182,212,0.15)' }}>
                  <DollarSign size={20} />
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ borderLeft: '4px solid var(--color-success)', background: 'linear-gradient(135deg, rgba(16, 18, 26, 0.75) 0%, rgba(16,185,129,0.02) 100%)', padding: '1.5rem 1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Completed Jobs</span>
                  <h3 style={{ fontSize: '2.25rem', marginTop: '0.35rem', fontWeight: 800, color: 'var(--text-main)' }}>{completedBookings.length}</h3>
                </div>
                <div style={{ padding: '0.6rem', background: 'rgba(16,185,129,0.08)', color: 'var(--color-success)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <Check size={20} />
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ borderLeft: '4px solid var(--brand-primary)', background: 'linear-gradient(135deg, rgba(16, 18, 26, 0.75) 0%, rgba(139,92,246,0.02) 100%)', padding: '1.5rem 1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Scheduled Jobs</span>
                  <h3 style={{ fontSize: '2.25rem', marginTop: '0.35rem', fontWeight: 800, color: 'var(--text-main)' }}>{activeBookings.length}</h3>
                </div>
                <div style={{ padding: '0.6rem', background: 'rgba(139,92,246,0.08)', color: 'var(--brand-primary)', borderRadius: '8px', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <Calendar size={20} />
                </div>
              </div>
            </div>

            <div className="glass-card" style={{ borderLeft: '4px solid var(--color-warning)', background: 'linear-gradient(135deg, rgba(16, 18, 26, 0.75) 0%, rgba(245,158,11,0.02) 100%)', padding: '1.5rem 1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Average Rating</span>
                  <h3 style={{ fontSize: '2.25rem', marginTop: '0.35rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {user.providerInfo?.rating || 5.0} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>★</span>
                  </h3>
                </div>
                <div style={{ padding: '0.6rem', background: 'rgba(245,158,11,0.08)', color: 'var(--color-warning)', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.15)' }}>
                  <Star size={20} />
                </div>
              </div>
            </div>
          </div>

          {/* Pending requests */}
          <div className="glass-card" style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', fontFamily: 'var(--font-title)', borderBottom: '1px solid var(--border-line)', paddingBottom: '0.75rem', fontWeight: 600 }}>
              Incoming Service Requests ({pendingBookings.length})
            </h3>
            {pendingBookings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1.5rem 0', textAlign: 'center' }}>No pending booking requests found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {pendingBookings.map((b) => (
                  <div key={b._id} style={{ background: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-line)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                        <span className="badge badge-pending">Pending Request</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{b.customerName}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-desc)', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={13} /> {b.bookingDate}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> {b.timeSlot}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: 'var(--brand-accent)' }}><DollarSign size={13} /> Estimated: ${b.totalPrice}</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-desc)', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-line)', padding: '0.75rem 1rem', borderRadius: '4px', fontStyle: 'italic', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                        <FileText size={14} style={{ marginTop: '2px', flexShrink: 0, color: 'var(--text-muted)' }} />
                        <span>"{b.description}"</span>
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignSelf: 'center' }}>
                      <button onClick={() => handleUpdateStatus(b._id, 'accepted')} className="btn btn-accent" style={{ padding: '0.55rem 1.25rem', fontSize: '0.82rem', background: 'var(--color-success)', color: 'white' }}>
                        <Check size={14} /> Accept Request
                      </button>
                      <button onClick={() => handleUpdateStatus(b._id, 'declined')} className="btn btn-danger" style={{ padding: '0.55rem 1.25rem', fontSize: '0.82rem' }}>
                        <X size={14} /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheduled Active Agenda */}
          <div className="glass-card" style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', fontFamily: 'var(--font-title)', borderBottom: '1px solid var(--border-line)', paddingBottom: '0.75rem', fontWeight: 600 }}>
              Active Agenda ({activeBookings.length})
            </h3>
            {activeBookings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1.5rem 0', textAlign: 'center' }}>No active bookings scheduled.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {activeBookings.map((b) => (
                  <div key={b._id} style={{ background: 'var(--bg-app)', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-line)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                        <span className="badge badge-accepted">Active Job</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{b.customerName}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-desc)', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={13} /> {b.bookingDate}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> {b.timeSlot}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: 'var(--brand-accent)' }}><DollarSign size={13} /> Job price: ${b.totalPrice}</span>
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-desc)', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-line)', padding: '0.75rem 1rem', borderRadius: '4px', fontStyle: 'italic', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                        <FileText size={14} style={{ marginTop: '2px', flexShrink: 0, color: 'var(--text-muted)' }} />
                        <span>"{b.description}"</span>
                      </p>
                    </div>
                    <button onClick={() => handleUpdateStatus(b._id, 'completed')} className="btn btn-primary" style={{ padding: '0.65rem 1.4rem', fontSize: '0.85rem' }}>
                      <Check size={14} /> Mark Job Completed
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* DUAL DASHBOARD VIEW: CUSTOMER */}
      {user.role === 'customer' && (
        <div className="glass-card">
          <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', fontFamily: 'var(--font-title)', borderBottom: '1px solid var(--border-line)', paddingBottom: '0.75rem', fontWeight: 600 }}>
            Requested Booking History ({bookings.length})
          </h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div className="spinner" style={{ marginBottom: '1rem', width: '36px', height: '36px' }} />
              <p style={{ color: 'var(--text-desc)', fontSize: '0.9rem' }}>Loading book records...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
              <Wrench size={36} style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }} />
              <p style={{ color: 'var(--text-desc)', marginBottom: '1.5rem', fontWeight: 600 }}>You haven't requested any services yet.</p>
              <a href="/providers" className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>Search Local Directory</a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {bookings.map((b) => {
                const badgeClass = `badge-${b.status}`;
                const providerCategory = b.providerCategory ? b.providerCategory.toUpperCase() : 'SPECIALIST';
                const isCompleted = b.status === 'completed';

                return (
                  <div key={b._id} style={{ background: 'var(--bg-app)', padding: '1.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>{b.providerName}</h4>
                          <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-line)', color: 'var(--text-desc)', letterSpacing: '0.04em' }}>{providerCategory}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-desc)', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={13} /> {b.bookingDate}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={13} /> {b.timeSlot}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600, color: 'var(--brand-accent)' }}><DollarSign size={13} /> Price: ${b.totalPrice}</span>
                        </div>
                      </div>
                      <span className={`badge ${badgeClass}`}>{b.status}</span>
                    </div>

                    <p style={{ padding: '0.85rem 1.15rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-line)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', color: 'var(--text-desc)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                      <strong style={{ color: 'var(--text-main)' }}>Service instructions:</strong> "{b.description}"
                    </p>

                    {/* Review workflow container */}
                    {isCompleted && (
                      <div style={{ borderTop: '1px dashed var(--border-line)', paddingTop: '1.25rem' }}>
                        {b.review ? (
                          <div style={{ background: 'rgba(16, 185, 129, 0.02)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '1rem', borderRadius: '4px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              My Feedback Rating: <StarRating rating={b.review.rating} size={12} />
                            </span>
                            <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-desc)', marginTop: '0.4rem' }}>"{b.review.comment}"</p>
                          </div>
                        ) : activeReviewId === b._id ? (
                          <form onSubmit={(e) => handleReviewSubmit(e, b._id)} style={{ padding: '1.25rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(139,92,246,0.2)' }}>
                            <h5 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-accent)', fontSize: '1.05rem', fontWeight: 600 }}>
                              <Sparkles size={15} /> Publish Service Review
                            </h5>

                            {reviewError && (
                              <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{reviewError}</div>
                            )}

                            <div className="form-group">
                              <label className="form-label" style={{ fontSize: '0.75rem' }}>Select Stars</label>
                              <StarRating rating={reviewRating} interactive={true} onChange={setReviewRating} size={22} />
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem' }}>Written Review Comment</label>
                              <textarea
                                className="form-input"
                                placeholder="Describe the quality of work, cleanliness, punctuality..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                style={{ minHeight: '80px', padding: '0.65rem' }}
                                required
                              />
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button type="button" className="btn btn-secondary" onClick={() => setActiveReviewId(null)} style={{ padding: '0.45rem 1.1rem', fontSize: '0.8rem' }}>
                                Dismiss
                              </button>
                              <button type="submit" className="btn btn-primary" disabled={reviewLoading} style={{ padding: '0.45rem 1.1rem', fontSize: '0.8rem' }}>
                                {reviewLoading ? 'Submitting...' : 'Post Review'}
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button onClick={() => { setActiveReviewId(b._id); setReviewError(''); }} className="btn btn-accent" style={{ padding: '0.45rem 1.1rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Star size={13} /> Rate & Review Professional
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
