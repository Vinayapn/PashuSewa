const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Apply auth middleware and require 'admin' role for all routes in this file
router.use(authenticate);
router.use(requireRole('admin'));

// Dashboard Overview Stats
router.get('/dashboard-stats', adminController.getDashboardStats);

// User Management
router.get('/users', adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);
// Extend with NGO/Doctor/Rescuer specific admin operations as needed...
router.get('/alerts', adminController.getAlerts);
router.get('/campaigns', adminController.getCampaigns);
router.get('/donations', adminController.getDonations);

module.exports = router;
