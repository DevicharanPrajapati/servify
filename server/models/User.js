const mongoose = require('mongoose');
const { getUsers, saveUsers, generateId } = require('./dbStore');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'provider'], default: 'customer' },
  avatar: { type: String },
  phone: { type: String },
  address: { type: String },
  providerInfo: {
    category: { type: String },
    bio: { type: String },
    hourlyRate: { type: Number },
    experience: { type: Number },
    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 0 },
    reviews: [
      {
        customerName: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
      }
    ]
  }
}, { timestamps: true });

const MongoUser = mongoose.model('User', userSchema);

// Hybrid Database Interface
class User {
  static async find(query = {}) {
    if (process.env.USE_LOCAL_DB === 'true') {
      let users = getUsers();
      // Simple filter matches
      return users.filter(user => {
        for (let key in query) {
          if (key === 'role') {
            if (user.role !== query.role) return false;
          } else if (key === 'providerInfo.category') {
            if (!user.providerInfo || user.providerInfo.category !== query['providerInfo.category']) return false;
          } else {
            if (user[key] !== query[key]) return false;
          }
        }
        return true;
      });
    } else {
      return await MongoUser.find(query);
    }
  }

  static async findOne(query) {
    if (process.env.USE_LOCAL_DB === 'true') {
      const users = getUsers();
      return users.find(user => {
        for (let key in query) {
          if (user[key] !== query[key]) return false;
        }
        return true;
      }) || null;
    } else {
      return await MongoUser.findOne(query);
    }
  }

  static async findById(id) {
    if (process.env.USE_LOCAL_DB === 'true') {
      const users = getUsers();
      return users.find(user => user._id === id || user.id === id) || null;
    } else {
      return await MongoUser.findById(id);
    }
  }

  static async create(data) {
    if (process.env.USE_LOCAL_DB === 'true') {
      const users = getUsers();
      const exists = users.some(u => u.email === data.email);
      if (exists) {
        throw new Error('User already exists');
      }

      // Default values
      const newUser = {
        _id: generateId(),
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role || 'customer',
        avatar: data.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(data.name)}`,
        phone: data.phone || '',
        address: data.address || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (newUser.role === 'provider') {
        newUser.providerInfo = {
          category: data.providerInfo?.category || 'electrician',
          bio: data.providerInfo?.bio || '',
          hourlyRate: Number(data.providerInfo?.hourlyRate) || 0,
          experience: Number(data.providerInfo?.experience) || 0,
          rating: 5.0,
          reviewsCount: 0,
          reviews: []
        };
      }

      users.push(newUser);
      saveUsers(users);
      return newUser;
    } else {
      // Set default avatar
      if (!data.avatar) {
        data.avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(data.name)}`;
      }
      return await MongoUser.create(data);
    }
  }

  static async findByIdAndUpdate(id, update, options = { new: true }) {
    if (process.env.USE_LOCAL_DB === 'true') {
      const users = getUsers();
      const userIndex = users.findIndex(user => user._id === id || user.id === id);
      if (userIndex === -1) return null;

      let user = users[userIndex];

      // Handle dot-notation update like 'providerInfo.rating'
      // Or general object updates
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

      applyUpdate(user, update);
      user.updatedAt = new Date().toISOString();
      users[userIndex] = user;
      saveUsers(users);
      return user;
    } else {
      return await MongoUser.findByIdAndUpdate(id, update, options);
    }
  }
}

module.exports = User;
