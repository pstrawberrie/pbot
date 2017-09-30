const util = require('../../_shared/util');
const moment = require('moment');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const getCharacter = require('./getCharacter');
const sendMessage = require('./sendMessage');
const locations = require('../data/locations.json');

// Has Been 1 minute
const minutePassed = (lastUpdate) => {
  return (moment(Date.now()).subtract(60, 'seconds') > moment(lastUpdate));
}

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
      `${username}... I've never heard of "${util.prettyLocation(arg1)}". Type !locations for a list of locations`
    );
    return;
  }

  getCharacter(username)
  .then((result) => {
    if(result == null) {
      sendMessage(
        'say', null,
        `${username} doesn't have a character. Type !newcharacter`
      );
    }
    if(result.name === username && result.location === arg1) {
      sendMessage(
        'say',
        null,
        `${username} - you are already in ${util.prettyLocation(arg1)}`
      );
    }
    //success & update
    if(result.name === username && result.location != arg1) {
      let update = {location: arg1}

      if(!result.last_move) {
        update.last_move = Date.now();
      }
      if(result.last_move && minutePassed(result.last_move)) {
        update.last_move = Date.now();
      }
      if(result.last_move && !minutePassed(result.last_move)) {
        sendMessage(
          'say', null,
          `${username} - you can only move once per minute`
        );
        return;
      }

      const updatedCharacter= Character.update({ name: username }, update,
      { new: true }).exec();
      //perform update
      sendMessage(
        'say',
        null,
        `${username} moved to ${util.prettyLocation(arg1)}`
      );
    }
  });

}
