const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');
const { catchErrors } = require('../handlers/errorHandlers');

//Characters
router.get('/', catchErrors(characterController.getAllCharacters));
router.get('/character/:name', catchErrors(characterController.getCharacter));

//New Character
router.post('/new', catchErrors(characterController.newCharacter));

module.exports = router;
