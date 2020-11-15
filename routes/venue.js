// const express = require('express');
const router = require('express').Router();
const venueController = require('../controller/venue.controller');

router.route("/").post(venueController.saveVenue);
router.route("/remove").post(venueController.removeVenue);

module.exports = router;