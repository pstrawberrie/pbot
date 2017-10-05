require('./models/Character');
require('./models/Location');
require('./models/Monster');
const express = require('express');
const router = express.Router();
const items = require('./data/items.json');
const monsters = require('./data/monsters.json');
const skills = require('./data/skills.json');
const locations = require('./data/locations.json');

// OBS Routes
const obsController = require('./controllers/obsController');
router.get('/obs', obsController.default);

// Status Check
router.post('/status', obsController.statusCheck);

// Send Game Data
router.get('/items', (req, res) => { res.json(items) });
router.get('/monsters', (req, res) => {res.json(monsters) });
router.get('/skills', (req, res) => { res.json(skills) });
router.get('/locations', (req, res) => { res.json(locations) });

module.exports = router;
