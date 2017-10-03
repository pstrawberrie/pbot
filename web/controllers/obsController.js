const secret = require('../../_config/secret');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');

exports.default = (req, res) => {
  Character.find({name:secret.botOwner})
  .then(result => {
    res.render('obs', {
      character: result[0]
    })
  }).catch(err => {
    console.log(`err finding `);
    res.json({oh:'no'});
  })
}
