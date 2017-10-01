const util = require('../../_shared/util');
const moment = require('moment');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const Location = mongoose.model('Location');
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
      return;
    }
    if(result.dead === 1) {
      sendMessage( 'say', null, `${username} is dead.`);
      return;
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
      let lastLocation = result.location;

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

      // update 'from' location
      Location.find({name:lastLocation})
      .then((result) => {
        let charactersArr = result[0].characters;
        if(charactersArr.length > -1 && charactersArr.includes(username)) {
          let characterIndex = charactersArr.indexOf(username);
          charactersArr.splice(characterIndex,1);
          Location.update({name:lastLocation}, {characters: charactersArr})
          .then((result) => {console.log(`removed ${username} from ${lastLocation}`)})
          .catch((err) => {console.log(`error removing ${username} from ${lastLocation}\n ${err}`)})
        }
      })
      .catch((err) => {
        console.log('error updating from location on move\n' + err)
      })

      // update 'to' location
      Location.find({name:arg1})
      .then((result) => {
        let charactersArr = result[0].characters;
        if(!charactersArr.includes(username)) {
          let characterIndex = charactersArr.indexOf(username);
          charactersArr.push(username);
          Location.update({name:arg1}, {characters: charactersArr})
          .then((result) => {console.log(`added ${username} to ${arg1}`)})
          .catch((err) => {console.log(`error adding ${username} to ${arg1}\n ${err}`)})
        }
      })
      .catch((err) => {
        console.log('error updating from location on move\n' + err)
      })

      // update character
      const updatedCharacter= Character.update({ name: username }, update,
      { new: true }).exec();
      sendMessage(
        'say',
        null,
        `${username} moved to ${util.prettyLocation(arg1)}`
      );
    }
  });

}
