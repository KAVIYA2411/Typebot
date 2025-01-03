const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  console.log('Received login request:', { email, password });

  try {
    let user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match status:', isMatch);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('User logged in successfully');
    res.json({ user: { firstName: user.username, id: user._id } });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
