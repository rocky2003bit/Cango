const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/countries', locationController.getCountries);
router.get('/states/:country_id', locationController.getStates);
router.get('/cities/:state_id', locationController.getCities);

module.exports = router;
