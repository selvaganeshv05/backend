const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path if needed

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Optional: Basic validation
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Optional: Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ username, password }); // Add password hashing if needed
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Register error:", error);  // ← PUSH THIS LINE HERE
    res.status(500).json({ message: "Error creating user" });
  }
});

module.exports = router;
