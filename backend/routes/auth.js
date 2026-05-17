const express = require('express');
const router = express.Router();
const AdminUser = require('../models/AdminUser');

// @route   POST /api/auth/login
// @desc    Login Admin
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Bypass database for default admin/admin
    if (username === 'admin' && password === 'admin') {
      return res.json({ token: 'dummy-jwt-token', username: 'admin' });
    }

    // For other users, check the database
    let user = await AdminUser.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Dummy token for now
    res.json({ token: 'dummy-jwt-token', username: user.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/register
// @desc    Register a new Admin
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await AdminUser.findOne({ username });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new AdminUser({ username, password });
    await user.save();

    res.json({ message: 'New admin user created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
