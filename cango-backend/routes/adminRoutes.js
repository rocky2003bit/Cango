const express = require('express');
const router = express.Router();
const { uploadContent, adminLogin } = require('../controllers/adminController');
const isAdmin = require('../middlewares/isAdmin');

// New: Admin login route
router.post('/login', adminLogin);

// Existing upload route
router.post('/upload', isAdmin, uploadContent);

module.exports = router;
