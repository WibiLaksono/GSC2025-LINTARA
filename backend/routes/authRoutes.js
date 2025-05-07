const express = require('express');
const { registerUser, loginUser } = require('../controllers/authControllers');

const router = express.Router();

console.log('Register route hit');

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

module.exports = router;