const router = require('express').Router();
const {googleOAuthHandler, verifyToken, logout} = require("../controllers/auth/authController");

router.get('/google/callback', googleOAuthHandler);

router.get('/verifyToken', verifyToken);

router.post('/logout', logout);

module.exports = router;