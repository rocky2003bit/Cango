const express = require('express');
const router = express.Router();
const db = require('../config/db');// Make sure this is your MySQL connection module

// Get all countries
router.get('/countries', (req, res) => {
  db.query('SELECT id, name, phone_code FROM countries', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get all states for a country
router.get('/states/:countryId', (req, res) => {
  db.query('SELECT id, name FROM states WHERE country_id = ?', [req.params.countryId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get all cities for a state
router.get('/cities/:stateId', (req, res) => {
  db.query('SELECT id, name FROM cities WHERE state_id = ?', [req.params.stateId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;