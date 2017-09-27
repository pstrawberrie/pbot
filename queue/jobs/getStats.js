const util = require('../../_shared/util');
const mongoose = require('mongoose');
const Character = require('../models/Character');
const getCharacter = require('./getCharacter');
const action = require('./action');

module.exports = (username, arg1) => {

  getCharacter(arg1 ? arg1 : username)
  .then((result) => {
    if(result == null) {
      console.log(`${arg1 ? arg1 : username} doesn't have a character. Type !newcharacter`)
      //@TODO: Send action!
      //action(`Stats for ${arg1 ? arg1 : username}: ${util.statsString(result.stats)}`);
    } else {
      console.log(`Stats for ${arg1 ? arg1 : username}: ${util.statsString(result.stats)}`)
      //@TODO: Send action!
      //action(`Stats for ${arg1 ? arg1 : username}: ${util.statsString(result.stats)}`);
    }
  })

}
