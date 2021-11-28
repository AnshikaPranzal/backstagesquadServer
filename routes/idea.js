var express = require('express');
const { isAdmin } = require('../controllers/auth');
const { createIdea, getAllIdeas,getIdea, getIdeaById, editIdea, removeIdea, giveRating, bestRatedIdea } = require('../controllers/idea');
const { getUserById } = require('../controllers/user');

var router = express.Router()

router.param("ideaId", getIdeaById); 
router.param("userId", getUserById); 

router.post('/create/idea/:userId', createIdea)

router.get('/all/idea', getAllIdeas)
router.get('/idea/best', bestRatedIdea)
router.get('/idea/:ideaId', getIdea)

router.put('/idea/:ideaId', editIdea)
router.put('/rate/:ideaId/:userId', giveRating)

router.delete('/idea/:ideaId/:userId', removeIdea)

module.exports = router;