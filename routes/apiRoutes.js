const express = require('express');
const router = express.Router();

// Controllers
const { rateLimit, handleChat } = require('../controllers/api/chatController');
const WaitlistController = require('../controllers/api/waitlistController');
const { executeCode } = require('../controllers/api/executeController');
const { getStats } = require('../controllers/api/adminController');
const { signup } = require('../controllers/api/authController');

// Chat Routes
router.post('/chat', rateLimit, handleChat);
router.post('/execute', executeCode);

// Waitlist Routes
router.get('/waitlist', WaitlistController.getWaitlistCount);
router.post('/waitlist', WaitlistController.joinWaitlist);

// Auth Routes
router.post('/signup', signup);

// Admin Routes
router.get('/admin/stats', getStats);

module.exports = router;
