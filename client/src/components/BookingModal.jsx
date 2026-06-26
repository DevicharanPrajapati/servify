import React, { useState } from 'react';
import { X, Calendar, Clock, ClipboardList, AlertCircle, CheckCircle } from 'lucide-react';
import { apiCall } from '../context/AuthContext';

export default function BookingModal({ provider, isOpen, onClose, onBookingSuccess }) {
  const [bookingDate, setBookingDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 11:00 AM');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !provider) return null;

  const hourlyRate = provider.providerInfo?.hourlyRate || 0;
  const estimatedPrice = hourlyRate * 2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !description) {
      setError('Please fill in all details.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiCall('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          providerId: provider._id,
          bookingDate,
          timeSlot,
          description,
        }),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setBookingDate('');
        setDescription('');
        if (onBookingSuccess) onBookingSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to book service.');
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date string as minimum option for datepicker
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle size={60} style={{ color: 'var(--success)', marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-family-title)' }}>Booking Requested!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Your service request has been sent to {provider.name}. Check your dashboard for updates.</p>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-family-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Book {provider.name}
            </h3>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', borderRadius: 'var(--border-radius-sm)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={14} /> Appointment Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  min={getMinDate()}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} /> Prefered Time Slot
                </label>
                <select
                  className="form-select"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                  <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                  <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <ClipboardList size={14} /> Description of Job
                </label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Explain what needs to be fixed (e.g., kitchen faucet replacement, spark plug tune up)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', margin: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hourly Rate</span>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>${hourlyRate}/hr</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated price (2h)</span>
                  <p style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--secondary)' }}>${estimatedPrice}</p>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Processing...' : 'Confirm Request'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
