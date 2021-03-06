const moment = require('moment');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const getCharacter = require('./getCharacter');
const sendMessage = require('./sendMessage');
const characterItem = require('./characterItem');
const moveCharacter = require('./moveCharacter');
const sendCharacterSocket = require('./sendCharacterSocket');

module.exports = (username) => {

  getCharacter(username)
  .then((result) => {
    if(result && result.name === username) {
      var prettyDate = moment(result.created_at).format('MMM Do YYYY');
      console.log(username + ' already has a character');
      sendMessage(
        'say',
        null,
        `${username} already has a character (created ${prettyDate}). Type !stats`
      );
    }
    if(result == null) {
      const newSheet = new Character({name: username});
      newSheet.save()
      .then((result) => {
        console.log('Made new character: ' + username);
        //do default character actions
        moveCharacter(username, 'sanctuary');
        //send welcome
        sendMessage(
          'say',
          null,
          `A new player joined! Welcome to the battle, ${username}!!!`
        );
        console.log(result)
        sendCharacterSocket('newCharacter', {character:result});
      })
      .catch((error) => {
        console.log('Error making new character!\n' + error);
        sendMessage(
          'whisper',
          username,
          `Sorry, ${username} - there was an error creating your character.`
        );
      })

    }
  })

}
