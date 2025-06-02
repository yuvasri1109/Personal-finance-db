const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (userId) =>
  jwt.sign({ userId }, 'secret123', { expiresIn: '7d' });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Create user, hash password inside User model (if pre-save hook used)
    const user = await User.create({ name, email, password });
    res.status(201).json({ token: generateToken(user._id) });
  } catch (err) {
    res.status(400).json({ message: 'User already exists or invalid data' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isMatch = user && (await bcrypt.compare(password, user.password));
    if (!isMatch) throw new Error();
    res.json({ token: generateToken(user._id) });
  } catch {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateprofile = async (req, res) => {
  try {
    const { name, username } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Profile updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
};
