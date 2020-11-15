const express = require('express');
const router = express.Router();
const tripController = require('../controller/trip.controller');

router.route('/business').post(tripController.findBusiness);

router.route('/add').post(tripController.addTrip);
router.route('/venues').post(tripController.addVenues);

module.exports = router;
