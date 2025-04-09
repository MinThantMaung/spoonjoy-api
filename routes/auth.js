const express = require('express');
const loginLimiter = require('../middleware/loginLimiter');
const {
    registerUser,
    loginUser,
    refreshToken,
    logoutUser
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);

module.exports = router;
