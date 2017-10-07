const util = require('../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const Location = mongoose.model('Location');
const sendMessage = require('./sendMessage');

module.exports = (username) => {

  Character.findOne({name:username})
  .then(characterResult => {
    if(characterResult == null || !characterResult.location) {
        return sendMessage('say',null,`${username} doesn't have a character. Type !newcharacter`);
    }
    if(characterResult && characterResult.name === username && characterResult.location) {
      Location.findOne({name:characterResult.location})
      .then(locationResult => {
        const monstersArr = locationResult.monsters || [];
        if(monstersArr.length <= 0) {
          return sendMessage('say',null,`There are no monsters in ${util.prettyLocation(locationResult.name)}`);
        } else {
          return sendMessage('say',null,`Monsters in ${util.prettyLocation(locationResult.name)}: ${util.arrCommaJoin(locationResult.monsters)}`);   
        }
      }).catch(err => {console.log(`err getting location for monstersInLocation\n${err}`)})
    }
  }).catch(err => {console.log(`err getting character for monstersInLocation\n${err}`)})

}