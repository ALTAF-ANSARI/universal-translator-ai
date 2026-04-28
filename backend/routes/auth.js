const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validate } = require('deep-email-validator');
const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    // 1. Basic Gmail format check
    if (!email.toLowerCase().endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Only @gmail.com addresses are allowed to register.' });
    }

    // 2. Deep validation to check if the email is active/real
    const validation = await validate({
      email: email,
      validateSMTP: true, // This checks if the email actually exists on Gmail's servers
    });

    if (!validation.valid) {
      // If SMTP check failed but it's a connection error (common in some environments), 
      // we might still allow it if other checks pass, but for "active" requirement:
      if (validation.reason === 'smtp' && validation.validators.smtp.reason && validation.validators.smtp.reason.includes('EACCES')) {
        // Port 25 blocked, we can't verify existence via SMTP here.
        // We'll proceed but log it. In a real server, port 25 should be open or use an API.
        console.warn('SMTP verification skipped due to port 25 restriction.');
      } else {
        return res.status(400).json({ 
          message: 'Please provide a valid, active Gmail address. Dummy emails are not allowed.',
          details: validation.reason 
        });
      }
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user._id);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
