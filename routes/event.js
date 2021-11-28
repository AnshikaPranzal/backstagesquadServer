var express = require('express');
const { isAdmin } = require('../controllers/auth');
const { createEvent, getAllEvents,getEvent, getEventById, editEvent, removeEvent, image } = require('../controllers/event')

var router = express.Router()

router.param("eventId", getEventById); 

router.post('/create/event', createEvent)

router.get('/all/event', getAllEvents)
router.get('/event/:eventId', getEvent)

router.get('/event/poster/:eventId', image)

router.put('/event/:eventId', editEvent)

router.delete('/event/:eventId', removeEvent)

module.exports = router;