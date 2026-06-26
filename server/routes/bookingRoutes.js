const express = require('express');
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus, submitReview } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All booking routes require authentication

router.post('/', createBooking);
router.get('/', getBookings);
router.put('/:id/status', updateBookingStatus);
router.post('/:id/review', submitReview);

module.exports = router;
