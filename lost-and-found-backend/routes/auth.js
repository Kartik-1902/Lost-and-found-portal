const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getTokenPayload } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET not configured' });
    }

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      const payload = getTokenPayload(req);
      if (!payload) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (payload.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash, role });
    await user.save();

    return res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Failed to register' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET not configured' });
    }

    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id.toString(), username: user.username, role: user.role },
      jwtSecret,
      { expiresIn: '8h' }
    );

    return res.status(200).json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;
