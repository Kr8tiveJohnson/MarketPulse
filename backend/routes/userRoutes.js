const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role, name, branchId) => {
  return jwt.sign({ id, role, name, branchId }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '30d' });
};

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Regular Registration
router.post('/register', async (req, res) => {
  const { name, email, password, role, branchId } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name, email, password: hashedPassword, role, branchId
    });

    if (user) {
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
        token: generateToken(user._id, user.role, user.name, user.branchId)
      });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Regular Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
        token: generateToken(user._id, user.role, user.name, user.branchId)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Google Login (Mock or Real Payload)
router.post('/google', async (req, res) => {
  const { email, name, role, branchId, isSignup } = req.body;
  try {
    let user = await User.findOne({ email });
    
    // If user exists, log them in
    if (user) {
      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
        token: generateToken(user._id, user.role, user.name, user.branchId)
      });
    }

    // If it's a signup request, create them
    if (isSignup) {
      user = await User.create({
        name, email, role, branchId
      });
      return res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branchId: user.branchId,
        token: generateToken(user._id, user.role, user.name, user.branchId)
      });
    } else {
      // Just a check to see if they exist. Return 404 so frontend knows to ask for Role.
      return res.status(404).json({ message: 'User not found. Role selection required.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Old endpoint compatibility (for handleLoginSuccess fallback in App.tsx)
router.post('/', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(200).json(user);
    
    // Fallback unhashed creation (to not break the UI before we update it)
    user = new User(req.body);
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
