var express = require('express');
const { isAdmin } = require('../controllers/auth');
const { createSpeaker, getAllSpeakers,getSpeaker, getSpeakerById, editSpeaker, removeSpeaker, image } = require('../controllers/speaker')

var router = express.Router()

router.param("speakerId", getSpeakerById); 

router.post('/create/speaker', createSpeaker)

router.get('/all/speaker', getAllSpeakers)
router.get('/speaker/:speakerId', getSpeaker)
router.get('/speaker/picture/:speakerId', image)


router.put('/speaker/:speakerId', editSpeaker)

router.delete('/speaker/:speakerId', removeSpeaker)

module.exports = router;