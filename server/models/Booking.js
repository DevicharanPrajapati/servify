const mongoose = require('mongoose');
const { getBookings, saveBookings, generateId } = require('./dbStore');

const bookingSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  providerId: { type: String, required: true },
  providerName: { type: String, required: true },
  providerCategory: { type: String, required: true },
  serviceType: { type: String },
  bookingDate: { type: String, required: true }, // Format YYYY-MM-DD
  timeSlot: { type: String, required: true },    // e.g., "09:00 AM - 11:00 AM"
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'completed'],
    default: 'pending',
  },
  totalPrice: { type: Number, required: true },
  review: {
    rating: { type: Number },
    comment: { type: String },
    date: { type: Date },
  },
}, { timestamps: true });

const MongoBooking = mongoose.model('Booking', bookingSchema);

class Booking {
  static async find(query = {}) {
    if (process.env.USE_LOCAL_DB === 'true') {
      const bookings = getBookings();
      return bookings.filter(booking => {
        for (let key in query) {
          if (booking[key] !== query[key]) return false;
        }
        return true;
      });
    } else {
      return await MongoBooking.find(query).sort({ createdAt: -1 });
    }
  }

  static async findById(id) {
    if (process.env.USE_LOCAL_DB === 'true') {
      const bookings = getBookings();
      return bookings.find(booking => booking._id === id || booking.id === id) || null;
    } else {
      return await MongoBooking.findById(id);
    }
  }

  static async create(data) {
    if (process.env.USE_LOCAL_DB === 'true') {
      const bookings = getBookings();
      const newBooking = {
        _id: generateId(),
        customerId: data.customerId,
        customerName: data.customerName,
        customerEmail: data.customerEmail || '',
        providerId: data.providerId,
        providerName: data.providerName,
        providerCategory: data.providerCategory,
        serviceType: data.serviceType || data.providerCategory,
        bookingDate: data.bookingDate,
        timeSlot: data.timeSlot,
        description: data.description,
        status: 'pending',
        totalPrice: Number(data.totalPrice) || 0,
        review: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      bookings.push(newBooking);
      saveBookings(bookings);
      return newBooking;
    } else {
      return await MongoBooking.create(data);
    }
  }

  static async findByIdAndUpdate(id, update, options = { new: true }) {
    if (process.env.USE_LOCAL_DB === 'true') {
      const bookings = getBookings();
      const bookingIndex = bookings.findIndex(b => b._id === id || b.id === id);
      if (bookingIndex === -1) return null;

      let booking = bookings[bookingIndex];

      const applyUpdate = (target, updateObj) => {
        for (let key in updateObj) {
          if (key.includes('.')) {
            const parts = key.split('.');
            let current = target;
            for (let i = 0; i < parts.length - 1; i++) {
              if (!current[parts[i]]) current[parts[i]] = {};
              current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = updateObj[key];
          } else {
            if (typeof updateObj[key] === 'object' && updateObj[key] !== null && !Array.isArray(updateObj[key])) {
              target[key] = { ...target[key], ...updateObj[key] };
            } else {
              target[key] = updateObj[key];
            }
          }
        }
      };

      applyUpdate(booking, update);
      booking.updatedAt = new Date().toISOString();
      bookings[bookingIndex] = booking;
      saveBookings(bookings);
      return booking;
    } else {
      return await MongoBooking.findByIdAndUpdate(id, update, options);
    }
  }
}

module.exports = Booking;
