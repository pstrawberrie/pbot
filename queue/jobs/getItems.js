const util = require('../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const getCharacter = require('./getCharacter');
const sendMessage = require('./sendMessage');

module.exports = (username, arg1) => {

  getCharacter(arg1 ? arg1 : username)
  .then((result) => {
    if(result == null) {
      console.log(`${arg1 ? arg1 : username} doesn't have a character. Type !newcharacter`)
      sendMessage(
        'say', null,
        `${arg1 ? arg1 : username} doesn't have a character. Type !newcharacter`
      );
    } else {
      console.log(`${arg1 ? arg1 : username} Items: ${util.prettyLocation(util.arrCommaJoin(result.items))}`)
      sendMessage(
        'say', null,
        `${arg1 ? arg1 : username} Items: ${util.prettyLocation(util.arrCommaJoin(result.items))}`
      );
    }
  });

}
