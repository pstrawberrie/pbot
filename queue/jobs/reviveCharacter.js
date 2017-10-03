const util = require('../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const Monster = mongoose.model('Monster');
const getCharacter = require('./getCharacter');
const sendMessage = require('./sendMessage');
const items = require('../data/items');
const sendCharacterSocket = require('./sendCharacterSocket');

module.exports = (username, arg1) => {

  const user = arg1 ? arg1 : username;

  getCharacter(user)
  .then((result) => {
    if(result == null) {
      console.log(`${user} doesn't have a character. Type !newcharacter`)
      sendMessage(
        'say', null,
        `${user} doesn't have a character. Type !newcharacter`
      );
    } else {
      if(user.dead === 0) {
        sendMessage(
          'say', null,
          `${user} is not dead`
        );
      }
      let reviveCount;
      if(!result.totalTimesRevived) { reviveCount = 1; }
      else {reviveCount = result.totalTimesRevived + 1}
      let stats = util.calcStatsFromItems(items, result.items);
      let updateCharacter = {
        totalTimesRevived: reviveCount,
        dead: 0,
        stats
      }

      Character.findOneAndUpdate({name:user}, updateCharacter, {new:true})
      .then(result => {
        console.log(`Rezd ${user}`)
        sendCharacterSocket('characterRevived', {character:result});
      }).catch(err => {console.log(`err rezing ${user}\n${err}`)});
      sendMessage(
        'action', null,
        `${user} comes back to life! (${result.location})`
      );

    }
  });


}
