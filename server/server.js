const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB, getDbType } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check and db status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'Online',
    database: getDbType(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Seed Initial Data if using local JSON fallback and DB is empty
function seedInitialData() {
  if (process.env.USE_LOCAL_DB === 'true') {
    const { getUsers, saveUsers } = require('./models/dbStore');
    const bcrypt = require('bcryptjs');
    const users = getUsers();

    if (users.length === 0) {
      console.log('🌱 Seed: Initializing mock service providers for offline MERN demonstration...');
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('password123', salt);

      const mockProviders = [
        {
          _id: 'prov_electrician1',
          name: 'Alex Volt',
          email: 'alex@volt.com',
          password: hashedPassword,
          role: 'provider',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Alex',
          phone: '+1 (555) 019-2834',
          address: '42 Beacon Hill Rd, Boston, MA',
          providerInfo: {
            category: 'electrician',
            bio: 'Certified Master Electrician with 8+ years of residential and commercial wiring, troubleshooting, and lighting installations. Always punctual and safety-first.',
            hourlyRate: 50,
            experience: 8,
            rating: 4.8,
            reviewsCount: 2,
            reviews: [
              { customerName: 'David Miller', rating: 5, comment: 'Excellent electrical panel repair! Punctual and professional.', date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) },
              { customerName: 'Sarah Jenkins', rating: 4, comment: 'Fixed my outdoor lighting issue quickly. Cleaned up afterwards.', date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) }
            ]
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'prov_plumber1',
          name: 'Mario Flow',
          email: 'mario@flow.com',
          password: hashedPassword,
          role: 'provider',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mario',
          phone: '+1 (555) 043-9821',
          address: '15 Maple Ave, Cambridge, MA',
          providerInfo: {
            category: 'plumber',
            bio: 'Expert plumber handling all leak repairs, pipe replacements, drain cleaning, water heaters, and toilet installations. Emergency services available.',
            hourlyRate: 65,
            experience: 12,
            rating: 5.0,
            reviewsCount: 1,
            reviews: [
              { customerName: 'Emily Stone', rating: 5, comment: 'Repaired our water heater in under an hour! Incredible service.', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }
            ]
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'prov_mechanic1',
          name: 'Elena Torque',
          email: 'elena@torque.com',
          password: hashedPassword,
          role: 'provider',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Elena',
          phone: '+1 (555) 078-4569',
          address: '280 Industrial Pkwy, Somerville, MA',
          providerInfo: {
            category: 'mechanic',
            bio: 'Mobile ASE-Certified automotive technician. I come to your home or office for oil changes, brake pads, diagnostics, and belt replacements. Save a trip to the garage!',
            hourlyRate: 70,
            experience: 10,
            rating: 4.9,
            reviewsCount: 2,
            reviews: [
              { customerName: 'Robert Vance', rating: 5, comment: 'Elena did a mobile brake repair in my driveway. Extremely convenient and fair price!', date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
              { customerName: 'Clara Oswald', rating: 4.8, comment: 'Super fast diagnostic. She found the engine sensor problem immediately.', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) }
            ]
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'prov_cleaner1',
          name: 'Jane Bright',
          email: 'jane@bright.com',
          password: hashedPassword,
          role: 'provider',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Jane',
          phone: '+1 (555) 091-6677',
          address: '88 Ocean Drive, Revere, MA',
          providerInfo: {
            category: 'cleaner',
            bio: 'Professional house and office cleaning services. Detail-oriented, pet-friendly, using eco-friendly products. One-off deep cleans or weekly visits.',
            hourlyRate: 35,
            experience: 6,
            rating: 4.7,
            reviewsCount: 3,
            reviews: [
              { customerName: 'Frank Sinatra', rating: 5, comment: 'House is sparkling clean every single time. 10/10.', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
              { customerName: 'George Costanza', rating: 4, comment: 'Good cleaning, though missed a spot behind the couch. Still very happy.', date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
              { customerName: 'Elaine Benes', rating: 5, comment: 'Excellent deep clean before our holiday event. Recommended!', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
            ]
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      // Add a test customer user for convenience
      const mockCustomer = {
        _id: 'cust_user1',
        name: 'John Doe',
        email: 'john@doe.com',
        password: hashedPassword,
        role: 'customer',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=John',
        phone: '+1 (555) 012-3456',
        address: '100 Main St, Boston, MA',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      saveUsers([mockCustomer, ...mockProviders]);
      console.log('🌱 Seed: Successfully seeded users and providers! (Default Password: password123)');
    }
  }
}

const PORT = process.env.PORT || 5000;

// Connect to Database first
connectDB().then(() => {
  seedInitialData();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${getDbType()} mode.`);
  });
});
