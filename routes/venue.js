var express = require('express');
const { isAdmin } = require('../controllers/auth');
const { createVenue, getAllVenues,getVenue, getVenueById, editVenue, removeVenue } = require('../controllers/venue')

var router = express.Router()

router.param("venueId", getVenueById); 

router.post('/create/venue', createVenue)

router.get('/all/venue', getAllVenues)
router.get('/venue/:venueId', getVenue)

router.put('/venue/:venueId', editVenue)

router.delete('/venue/:venueId', removeVenue)

module.exports = router;