const express = require('express');
const router = express.Router(); 
const { uploadContent, adminLogin, getAdminDashboardOverview } = require('../controllers/adminController');
const isAdmin = require('../middlewares/isAdmin');

// New: Admin login route
router.post('/login', adminLogin);

// Existing upload route
router.post('/upload', isAdmin, uploadContent);

// Add this line for the overview API
router.get('/dashboard/overview', isAdmin, getAdminDashboardOverview);

module.exports = router;
