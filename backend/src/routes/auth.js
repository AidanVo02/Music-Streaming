const express = require('express');
const AuthController = require('../controllers/AuthController.js');
const { authenticate } = require('../middleware/auth.js');
const { uploadImage } = require('../middleware/upload.js');

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', authenticate, AuthController.getMe);
router.put('/profile', authenticate, uploadImage.single('avatar'), AuthController.updateProfile);

module.exports = router;
