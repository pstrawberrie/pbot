const secret = require('../../_config/secret');
const util = require('../../_shared/util');
const moment = require('moment');
const mongoose = require('mongoose');
const Monster = mongoose.model('Monster');
const Location = mongoose.model('Location');
const getCharacter = require('./getCharacter');
const sendMessage = require('./sendMessage');
const locations = require('../data/locations.json');

module.exports = (monstername, location) => {

  // Do some pre-move checks
  if(!location) {
    sendMessage(
      'whisper', secret.botOwner,
      `provide monster move location`
    );
    return;
  }
  if(!locations.includes(location)) {
    sendMessage(
      'whisper', secret.botOwner,
      `"${util.prettyLocation(location)}" is not a valid location`
    );
    return;
  }

  Monster.find({name:monstername})
  .then((result) => {
    // invalid monster
    if(result == null || result.length === 0) {
      sendMessage(
        'whisper', secret.botOwner,
        `${monstername} isn't a valid monster`
      );
      return;
    }
    //monster already in location
    if(result[0].name === monstername && result[0].location === location) {
      sendMessage(
        'whisper', secret.botOwner,
        `${monstername} is already in ${util.prettyLocation(location)}`
      );
      return;
    }
    //can move, do logic
    if(result[0].name === monstername && result[0].location != location) {
      let lastLocation = result[0].location;

      // update 'from' location
      Location.find({name:lastLocation})
      .then((result) => {
        let monstersArr = result[0].monsters
        if(monstersArr.length > -1 && monstersArr.includes(monstername)) {
          let monsterIndex = monstersArr.indexOf(monstername);
          monstersArr.splice(monsterIndex,1);
          Location.update({name:lastLocation}, {monsters: monstersArr})
          .then((result) => {console.log(`removed ${monstername} from ${lastLocation}`)})
          .catch((err) => {console.log(`error removing ${monstername} from ${lastLocation}\n ${err}`)})
        }
      })
      .catch((err) => {
        console.log('error updating to location on monster move\n' + err)
      })

      //update 'to' location
      Location.find({name:location})
      .then((result) => {
        let monstersArr = result[0].monsters;
        if(!monstersArr.includes(monstername)) {
          monstersArr.push(monstername);
          Location.update({name:location}, {monsters: monstersArr})
          .then((result) => {console.log(`added ${monstername} to ${location}`)})
          .catch((err) => {console.log(`error removing ${monstername} from ${location}\n ${err}`)})
        }
      })
      .catch((err) => {
        console.log('error updating from location on monster move\n' + err)
      })

      // update monster
      Monster.update({name:monstername}, {location}, {new:true})
      .then((updateResult) => {
        sendMessage(
          'say', null,
          `${monstername} moved to ${util.prettyLocation(location)}`
        );
      })
      .catch((err) => {
        console.log(err)
        sendMessage(
          'whisper', secret.botOwner,
          `err moveing monster to ${util.prettyLocation(location)}`
        );
      });

    }

  })
  .catch((err) => {
    console.log(err)
  })

}
