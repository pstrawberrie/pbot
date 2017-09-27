const moment = require('moment');
const mongoose = require('mongoose');
const Character = require('../models/Character');
const getCharacter = require('./getCharacter');
const whisper = require('./whisper');

module.exports = (username) => {

  getCharacter(username)
  .then((result) => {
    if(result && result.name === username) {
      var prettyDate = moment(result.created_at).format('ddd, MMM Do YYYY');
      console.log(username + ' already has a character');
      //@TODO: Send whisper!
      //whisper(username, `You made a character on ${prettyDate}. Type !stats`);
    }
    if(result == null) {
      const newSheet = new Character ({name: username});
      newSheet.save();
      console.log('Made new character: ' + username);
      //@TODO: Send whisper!
      //action(`New character created: ${prettyDate}. Welcome to the battle!!!`);
    }
  })

}
