var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const Character = require('../models/Character');

/* GET home page. */
router.get('/', function(req, res, next) {

  let character = 'Character Unavailable'
  Character.findOne({name:'pstrawberrie'}).then(result => {
    if(result.name === 'pstrawberrie') character = result;
    res.render('index', {
      title: 'Home',
      character
    });
  })
  .catch(err => {
    res.render('index', {
      title: 'Home',
      character
    });
  })


});

module.exports = router;
