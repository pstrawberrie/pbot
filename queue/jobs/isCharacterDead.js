const util = require('../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const getCharacter = require('./getCharacter');
const sendMessage = require('./sendMessage');

module.exports = (directive, username, arg1) => {

  getCharacter(arg1 ? arg1 : username)
  .then((result) => {
    if(directive === 'check') {
      if(result == null || result.dead === 1) {
        return true;
      }
      if(result.dead = 0) {
        return false;
      }
    }
    if(directive === 'command') {
      if(result == null) {
        console.log(`${arg1 ? arg1 : username} doesn't have a character. Type !newcharacter`)
        sendMessage(
          'say', null,
          `${arg1 ? arg1 : username} doesn't have a character. Type !newcharacter`
        );
      } else {
        console.log(`${arg1 ? arg1 : username} dead: ${result.dead}`);
        let deadString = 'Alive'
        if(result.dead === 1) {deadString = 'Dead'}
        sendMessage(
          'say', null,
          `[${arg1 ? arg1 : username}] - [${deadString}] - [${util.prettyLocation(result.location)}]`
        );
      }
    }
  });

}
