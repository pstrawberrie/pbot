const util = require('../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const Monster = mongoose.model('Monster');
const getCharacter = require('./getCharacter');
const sendMessage = require('./sendMessage');

module.exports = (username, arg1, arg2) => {

  if(arg1 != 'monster' && arg1 != 'm') {
    getCharacter(arg1 ? arg1 : username)
    .then((result) => {
      if(result == null) {
        console.log(`${arg1 ? arg1 : username} doesn't have a character. Type !newcharacter`)
        sendMessage(
          'say', null,
          `${arg1 ? arg1 : username} doesn't have a character. Type !newcharacter - for monsters, use !stats monster [monster].`
        );
      } else {
        console.log(`Stats for ${arg1 ? arg1 : username}: ${util.statsString(result.stats)}`)
        let deadString = result.stats.hp === 0 ? ' [Dead]' : '';
        sendMessage(
          'say', null,
          `
          ${arg1 ? arg1 : username}${deadString}
          [${util.prettyLocation(result.location)}]
          [Stats: ${util.statsString(result.stats)}]
          [Skills: ${util.arrCommaJoin(result.skills)}]
          [Items: ${util.arrCommaJoin(result.items)}]
          `
        );
      }
    });
  }
  if(arg1 === 'monster' || arg1 === 'm') {
    Monster.find({name:arg2})
    .then(result => {
      if(!result[0]) {
        sendMessage('say', null, `${arg2}...doesn't ring a bell..`);
        return;
      }
      if(result[0] && result[0].name === arg2) {
        let deadString = result[0].stats.hp === 0 ? ' [Dead]' : '';
        return sendMessage('say', null,
        `${util.prettyLocation(arg2)}${deadString} [Stats: ${util.statsString(result[0].stats)}] [Drops: ${util.arrCommaJoin(result[0].drops)}]`
      );
      }
    }).catch(err => {console.log('err finding monster\n' + err)})
  }


}
