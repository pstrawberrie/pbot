require('./models/Character');
require('./models/Location');
require('./models/Monster');
const express = require('express');
const router = express.Router();

// OBS Routes
const obsController = require('./controllers/obsController');
router.get('/obs', obsController.default);

// Status Check
router.post('/status', obsController.statusCheck);

module.exports = router;