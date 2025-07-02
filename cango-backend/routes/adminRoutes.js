const express = require('express');
const router = express.Router(); 
const { uploadContent, adminLogin, getAdminDashboardOverview, getAllUploadedContent, getAllUsers,deleteContent } = require('../controllers/adminController');
const isAdmin = require('../middlewares/isAdmin');
const db = require('../config/db');
// New: Admin login route
router.post('/login', adminLogin);

// Existing upload route
router.post('/upload', isAdmin, uploadContent);

// Add this line for the overview API
router.get('/dashboard/overview', isAdmin, getAdminDashboardOverview);
router.get('/users', isAdmin, getAllUsers);
router.get('/contents', isAdmin, getAllUploadedContent);
router.delete('/contents/:id', isAdmin, deleteContent);

// ✅ New route: Fetch all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, is_admin, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});
module.exports = router;
