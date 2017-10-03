const util = require('../../_shared/util');
const items = require('../../queue/data/items.json');//this is dumb, dont do this
const secret = require('../../_config/secret');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');

exports.default = (req, res) => {
  Character.find({name:secret.botOwner})
  .then(result => {
    res.render('obs', {
      character: result[0],
      util,
      items
    })
  }).catch(err => {
    console.log(`err finding `);
    res.json({oh:'no'});
  })
}

exports.statusCheck = (req, res) => {
  res.json({alive:1});
}
