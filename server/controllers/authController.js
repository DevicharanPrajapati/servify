const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role, name) => {
  return jwt.sign(
    { id, role, name },
    process.env.JWT_SECRET || 'servify_secret_key_123456789_super_secure',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
async function registerUser(req, res) {
  try {
    const { name, email, password, role, phone, address, providerInfo } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
      phone: phone || '',
      address: address || '',
      providerInfo: role === 'provider' ? {
        category: providerInfo?.category || 'electrician',
        bio: providerInfo?.bio || '',
        hourlyRate: Number(providerInfo?.hourlyRate) || 0,
        experience: Number(providerInfo?.experience) || 0,
        rating: 5,
        reviewsCount: 0,
        reviews: []
      } : undefined
    });

    res.status(201).json({
      token: generateToken(user._id, user.role, user.name),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        providerInfo: user.providerInfo
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
}

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: generateToken(user._id, user.role, user.name),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        providerInfo: user.providerInfo
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
}

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      providerInfo: user.providerInfo
    });
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
