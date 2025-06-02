const express = require('express');
const { register, login, profile, updateprofile } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, profile);
router.put('/profile', auth, updateprofile); // ✅ Make sure updateprofile is correctly imported

module.exports = router;
