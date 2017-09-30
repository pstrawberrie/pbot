const mongoose = require('mongoose');
const Character = require('../models/Character');
const getCharacter = require('./getCharacter');
const sendMessage = require('./sendMessage');
const locations = require('../data/locations.json');

module.exports = (username, arg1) => {

  // Do some pre-move checks
  if(!arg1) {
    sendMessage(
      'say', null,
      `${username} - where do you want to move?. Type !locations for a list of locations`
    );
    return;
  }
  if(!locations.includes(arg1)) {
    sendMessage(
      'say', null,
      `${username}... I've never heard of "${arg1}". Type !locations for a list of locations`
    );
    return;
  }

  getCharacter(username)
  .then((result) => {
    if(result && result.name === username && result.location === arg1) {
      sendMessage(
        'say',
        null,
        `${username} - you are already at ${arg1}`
      );
    }
    //success & update
    if(result && result.name === username && result.location != arg1) {
      //set update obj
      const newLocation = {location: arg1}
      const updatedItem = Character.update({ name: username }, newLocation,
      { new: true }).exec();
      //perform update
      sendMessage(
        'say',
        null,
        `${username} moved to ${arg1}`
      );
    }
    if(result == null) {
      sendMessage(
        'say', null,
        `${username} doesn't have a character. Type !newcharacter`
      );
    }
  });

}
