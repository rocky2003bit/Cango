const express = require('express');
const router = express.Router(); 
const { 
    uploadContent, 
    adminLogin, 
    getAdminDashboardOverview, 
    getAllUploadedContent, 
    getAllUsers, 
    deleteContent 
} = require('../controllers/adminController');

const isAdmin = require('../middlewares/isAdmin');

// Authentication
router.post('/login', adminLogin);

// Content Management
router.post('/upload', isAdmin, uploadContent);
router.get('/contents', isAdmin, getAllUploadedContent);
router.delete('/contents/:id', isAdmin, deleteContent);

// Dashboard & Users
router.get('/dashboard/overview', isAdmin, getAdminDashboardOverview);

// ✅ This single line handles everything for the user list
router.get('/users', isAdmin, getAllUsers);

module.exports = router;
