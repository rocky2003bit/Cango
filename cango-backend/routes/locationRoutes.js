const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Load location data from JSON
const locationData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/locations.json'), 'utf8'));

// Get countries
router.get('/countries', (req, res) => {
  const countries = locationData.map(c => ({ name: c.country, phone_code: c.phone_code }));
  res.json(countries);
});

// Get states for a country
router.get('/states/:country', (req, res) => {
  const { country } = req.params;
  const match = locationData.find(c => c.country === country);
  if (!match) return res.status(404).json({ error: 'Country not found' });
  res.json(match.states.map(s => s.name));
});

// Get cities for a country and state
router.get('/cities/:country/:state', (req, res) => {
  const { country, state } = req.params;
  const match = locationData.find(c => c.country === country);
  if (!match) return res.status(404).json({ error: 'Country not found' });

  const stateMatch = match.states.find(s => s.name === state);
  if (!stateMatch) return res.status(404).json({ error: 'State not found' });

  res.json(stateMatch.cities);
});

module.exports = router;
