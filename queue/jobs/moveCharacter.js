const util = require('../../_shared/util');
const moment = require('moment');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const Location = mongoose.model('Location');
const getCharacter = require('./getCharacter');
const sendMessage = require('./sendMessage');
const locations = require('../data/locations.json');
const items = require('../data/items.json');
const sendCharacterSocket = require('./sendCharacterSocket');

// Move Cooldown
const moveCooldown = (mod, lastUpdate) => {
  let seconds = 12;
  if(mod && mod >= 10) {
    seconds = 9
  }
  if(mod && mod <10) {
    seconds = util.negativeToOne(seconds - mod);
  }
  let diff = moment().diff(moment(lastUpdate), 'seconds') - (seconds);
  let obj = {
    canMove: moment(Date.now()).subtract(seconds, 'seconds') > moment(lastUpdate),
    remaining: diff
  }
  return obj;
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
      let cdCheck = moveCooldown(result.stats.ap, result.last_move);
      let update = {location: arg1}
      let lastLocation = result.location;

      if(!result.last_move) {
        update.last_move = Date.now();
      }
      if(result.last_move && cdCheck.canMove) {
        update.last_move = Date.now();
      }
      if(result.last_move && !cdCheck.canMove) {
        sendMessage(
          'say', null,
          `${username} - your move is on cooldown (${-cdCheck.remaining}sec)`
        );
        return;
      }

      // update 'from' location
      Location.find({name:lastLocation})
      .then((result) => {
        if(!result[0]) return;
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
      if(arg1 === 'sanctuary') {
        update.stats = util.calcStatsFromItems(items, result.items);
      }
      Character.findOneAndUpdate({ name: username }, update, { new: true })
      .then(result => {
        if(result != null) {
          if(arg1 === 'sanctuary') {
            sendMessage('action', null, `The Sanctuary warms your soul, ${username}`);
          } else {
            sendMessage('say', null,`${username} moved to ${util.prettyLocation(arg1)}`);
          }
          sendCharacterSocket('moveCharacter', {character:result});
        }
      }).catch(err => {`err updating character on move\m${err}`})

    }
  });

}
