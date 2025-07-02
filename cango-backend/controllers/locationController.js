const db = require('../db');

const getCountries = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, phonecode FROM countries ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

const getStates = async (req, res) => {
  const countryId = req.params.country_id;
  try {
    const [rows] = await db.query('SELECT id, name FROM states WHERE country_id = ?', [countryId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
};

const getCities = async (req, res) => {
  const stateId = req.params.state_id;
  try {
    const [rows] = await db.query('SELECT id, name FROM cities WHERE state_id = ?', [stateId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
};

module.exports = { getCountries, getStates, getCities };


