const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Basic email validation
const isValidEmail = (email) =>
  typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Return the safe subset of a user object (never the password hash)
const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  address: user.address,
});

const signup = async (req, res) => {
  try {
    // Deliberately do NOT destructure `role` from req.body.
    // Anyone signing up is a regular 'user'. Admins are provisioned separately.
    const { name, email, password, phone, address } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Name, email and password are required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }
    if (typeof password !== 'string' || password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user', // hard-coded — client cannot escalate to admin
      phone,
      address,
    });
    await user.save();

    // Issue a token so the client can log the new user in immediately.
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error('signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });

    // Use a single generic message so we don't reveal whether the email exists
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Returns the currently authenticated user's profile (used by the Account page)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(publicUser(user));
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// Allows the authenticated user to update their own profile fields
// (name, phone, address). Email and role are intentionally not editable here.
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updates = {};
    if (typeof name === 'string' && name.trim()) updates.name = name.trim();
    if (typeof phone === 'string') updates.phone = phone;
    if (typeof address === 'string') updates.address = address;

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(publicUser(user));
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

module.exports = { signup, login, getProfile, updateProfile };
