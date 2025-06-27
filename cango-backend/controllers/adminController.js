const db = require('../config/db');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const uploadContent = async (req, res) => {
  const { title, description, category, language, type, poster_url } = req.body;

  if (!title || !description || !category || !language || !type || !poster_url) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await db.query(
      'INSERT INTO contents (title, description, category, language, type, poster_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, category, language, type, poster_url]
    );
    res.status(201).json({ message: 'Content uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

module.exports = { uploadContent };

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const users = await userModel.findUserByEmail(email);
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = users[0];

    if (user.is_admin !== 1) {
      return res.status(403).json({ error: 'Access denied. Not an admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.status(200).json({ message: 'Admin login successful' });
  } catch (err) {
    console.error('Admin login failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  uploadContent,
  adminLogin
};