const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
async function createBooking(req, res) {
  try {
    const { providerId, bookingDate, timeSlot, description } = req.body;
    const customerId = req.user.id;

    if (!providerId || !bookingDate || !timeSlot || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Fetch customer details
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer profile not found' });
    }

    // Fetch provider details
    const provider = await User.findById(providerId);
    if (!provider || provider.role !== 'provider') {
      return res.status(404).json({ message: 'Service Provider not found' });
    }

    const hourlyRate = provider.providerInfo?.hourlyRate || 0;
    // Default to a 2-hour standard job block price calculation
    const totalPrice = hourlyRate * 2;

    const booking = await Booking.create({
      customerId,
      customerName: customer.name,
      customerEmail: customer.email,
      providerId,
      providerName: provider.name,
      providerCategory: provider.providerInfo?.category || 'General',
      serviceType: provider.providerInfo?.category || 'General',
      bookingDate,
      timeSlot,
      description,
      totalPrice,
      status: 'pending',
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking creation error:', error.message);
    res.status(500).json({ message: 'Server error creating booking' });
  }
}

// @desc    Get user's bookings (Customer or Provider)
// @route   GET /api/bookings
// @access  Private
async function getBookings(req, res) {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let query = {};

    if (role === 'provider') {
      query.providerId = userId;
    } else {
      query.customerId = userId;
    }

    const bookings = await Booking.find(query);
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error.message);
    res.status(500).json({ message: 'Server error retrieving bookings' });
  }
}

// @desc    Update booking status (Accept, Decline, Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private
async function updateBookingStatus(req, res) {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;
    const userId = req.user.id;

    if (!['accepted', 'declined', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only the assigned provider can update the status
    if (booking.providerId !== userId) {
      return res.status(403).json({ message: 'Unauthorized status modification' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    res.json(updatedBooking);
  } catch (error) {
    console.error('Update status error:', error.message);
    res.status(500).json({ message: 'Server error updating booking status' });
  }
}

// @desc    Submit review for completed booking
// @route   POST /api/bookings/:id/review
// @access  Private
async function submitReview(req, res) {
  try {
    const { rating, comment } = req.body;
    const bookingId = req.params.id;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify requesting user is the customer who made the booking
    if (booking.customerId !== userId) {
      return res.status(403).json({ message: 'Unauthorized review action' });
    }

    // Verify booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed services' });
    }

    // Verify booking hasn't been reviewed already
    if (booking.review && booking.review.rating) {
      return res.status(400).json({ message: 'Booking has already been reviewed' });
    }

    const reviewObj = {
      rating: Number(rating),
      comment: comment || '',
      date: new Date().toISOString()
    };

    // 1. Update Booking with review
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { review: reviewObj },
      { new: true }
    );

    // 2. Add review to Provider user details and recalculate ratings
    const provider = await User.findById(booking.providerId);
    if (provider) {
      const currentReviews = provider.providerInfo?.reviews || [];
      const newReviewItem = {
        customerName: booking.customerName,
        rating: Number(rating),
        comment: comment || '',
        date: new Date()
      };

      const updatedReviews = [...currentReviews, newReviewItem];
      const reviewsCount = updatedReviews.length;

      // Recalculate average rating
      const sum = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
      const averageRating = Number((sum / reviewsCount).toFixed(1));

      await User.findByIdAndUpdate(booking.providerId, {
        'providerInfo.reviews': updatedReviews,
        'providerInfo.reviewsCount': reviewsCount,
        'providerInfo.rating': averageRating
      });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error('Review submit error:', error.message);
    res.status(500).json({ message: 'Server error submitting review' });
  }
}

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus,
  submitReview
};
