const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin');
const { verifyAccessToken } = require('../middileware/authMiddleware');

router.post('/signup', adminController.signup);
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
router.get('/profile', verifyAccessToken, adminController.getProfile);
router.post('/refresh-token', adminController.refreshAccessToken);
module.exports = router;
