const util = require('../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const Location = mongoose.model('Location');
const getCharacter = require('./getCharacter');
const sendMessage = require('./sendMessage');

module.exports = (username) => {

  getCharacter(username)
  .then((result) => {
    if(result == null) {
      console.log(`${username} doesn't have a character. Type !newcharacter`)
      sendMessage(
        'say', null,
        `${username} doesn't have a character. Type !newcharacter`
      );
    } else {
      // can look
      let currentLocation = result.location;
      let items = ['none'], characters = ['none'], powerups =  ['none'], monsters = ['none'];
      Location.find({name:result.location})
      .then((result) => {
        if(result[0].characters.length > 0) {characters.splice(0,1);characters.push(...result[0].characters)}
        if(result[0].items.length > 0) {items.splice(0,1);items.push(...result[0].items)}
        if(result[0].monsters.length > 0) {monsters.splice(0,1);monsters.push(...result[0].monsters)}

        sendMessage(
          'say', null,
          `${util.prettyLocation(currentLocation)}
          [ITEMS:: ${util.arrCommaJoin(items)} ]
          [CHARACTERS:: ${util.arrCommaJoin(characters)} ]
          [MONSTERS:: ${util.arrCommaJoin(monsters)} ]
          `
        );
      })
      .catch((err) => {
        console.log(err);
      })
    }
  })
  .catch((err) => {
    console.log(err);
  })

}
