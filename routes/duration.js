var express = require('express');
const { isAdmin } = require('../controllers/auth');
const { createDuration, getAllDurations,getDuration, getDurationById, editDuration, removeDuration } = require('../controllers/duration')

var router = express.Router()

router.param("durationId", getDurationById); 

router.post('/create/duration', createDuration)

router.get('/all/duration', getAllDurations)
router.get('/duration/:durationId', getDuration)

router.put('/duration/:durationId', editDuration)

router.delete('/duration/:durationId', removeDuration)

module.exports = router;