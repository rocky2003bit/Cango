// middlewares/isAdmin.js
const db = require('../config/db');
const userModel = require('../models/userModel');

const isAdmin = async (req, res, next) => {
  const email = req.headers['x-admin-email'];

  if (!email) {
    return res.status(401).json({ error: 'Access denied. No admin email provided.' });
  }

  try {
    const users = await userModel.findUserByEmail(email);
    if (users.length === 0 || users[0].is_admin !== 1) {
      return res.status(403).json({ error: 'Access denied. You are not an admin.' });
    }

    next(); // Proceed if admin verified
  } catch (err) {
    console.error('Admin check failed:', err);
    res.status(500).json({ error: 'Server error verifying admin access.' });
  }
};

module.exports = isAdmin;
