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
  'INSERT INTO contents (title, description, category, language, type, poster_url, visible) VALUES (?, ?, ?, ?, ?, ?, ?)',
  [title, description, category, language, type, poster_url, 1]
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

// Add this function after your existing exports or near the end
const getAdminDashboardOverview = async (req, res) => {
  try {
    // Total users
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    // New users in last 7 days
    const [[{ newUsers7d }]] = await db.query(
      "SELECT COUNT(*) AS newUsers7d FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
    );
    // Total content
    const [[{ totalContent }]] = await db.query('SELECT COUNT(*) AS totalContent FROM contents');
    // New content in last 7 days
    const [[{ newContent7d }]] = await db.query(
      "SELECT COUNT(*) AS newContent7d FROM contents WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
    );

    // Optionally add more stats here (e.g., most popular content, recent activity)

    res.json({
      totalUsers,
      newUsers7d,
      totalContent,
      newContent7d
    });
  } catch (err) {
    console.error("Dashboard overview error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard overview" });
  }
};

 
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email FROM users');
    res.json(users);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

const getAllUploadedContent = async (req, res) => {
  try {
    const [contents] = await db.query("SELECT * FROM contents ORDER BY created_at DESC");
    res.json(contents);
  } catch (err) {
    console.error("Failed to fetch content list:", err);
    res.status(500).json({ error: "Failed to fetch contents" });
  }
};
const deleteContent = async (req, res) => {
  const contentId = req.params.id;
  try {
    const [result] = await db.query("DELETE FROM contents WHERE id = ?", [contentId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Content not found" });
    }
    res.json({ message: "Content deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server error deleting content" });
  }
};


// Export the new function
module.exports = {
  ...module.exports,
  getAdminDashboardOverview,
  getAllUsers,
  getAllUploadedContent,
  deleteContent,


};