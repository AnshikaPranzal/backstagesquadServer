var express = require('express');
const { isAdmin } = require('../controllers/auth');
const { search } = require('../controllers/search');

var router = express.Router()

router.post('/search', search)

module.exports = router;