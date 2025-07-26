const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Promise-based connection

// ✅ Get all countries
router.get('/countries', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, name, phonecode FROM countries ORDER BY name');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
});

// ✅ Get states by country ID
router.get('/states/:countryId', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, name FROM states WHERE country_id = ?', [req.params.countryId]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

// ✅ Get cities by state ID
router.get('/cities/:stateId', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, name FROM cities WHERE state_id = ?', [req.params.stateId]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

module.exports = router;
