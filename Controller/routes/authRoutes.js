const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

// User Registration Endpoint
router.post('/register', async (req, res) => {
  // Registration logic here
});

// User Login Endpoint
router.post('/login', async (req, res) => {
  // Login logic here
});

module.exports = router;