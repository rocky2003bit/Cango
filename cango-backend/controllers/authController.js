// controllers/authController.js
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUsers = await userModel.findUserByEmail(email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userModel.createUser(name, email, hashedPassword);

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
};


const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await userModel.findUserByEmail(email);
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, users[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Signin successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signin failed' });
  }
};

module.exports = { signup, signin };
