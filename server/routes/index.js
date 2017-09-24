var express = require('express');
var router = express.Router();
var tmiAuth = require('../controllers/tmiAuth');


/* GET home page. */
router.get('/', function(req, res, next) {
  const newAuth = tmiAuth.test(req, res, next);
  if(newAuth) {
    return res.render('panel', { title: 'Home' });
  }
  res.render('index', { title: 'Home' });
});

module.exports = router;
