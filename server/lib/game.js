var mongoose = require('mongoose');
const Character = require('../models/Character');
const chat = require('./irc');
const moment = require('moment');

const game = {

  //+ Create New Character
  newCharacter(username) {
    if(!username) return;
    const usernameString = username + '';

    return new Promise((resolve, reject) => {

      // Resolve function
      function resolveMsg(msg) {
        chat.whisper(usernameString, msg);
        resolve(msg);
      }

      // Check DB For Character
      Character.findOne({name:username}).then(result => {
        console.log('finding character');
        if(result.name === usernameString) {
          var prettyDate = moment(result.created_at).format('ddd, MMM Do YYYY');
          resolveMsg('You created a character on ' + prettyDate + '. Type !stats');
        }
        if(result == null) {
          const newSheet = new Character ({name: username});
          newSheet.save();
          resolveMsg(`New Character created. Welcome to the fight, ${username}!!`);
        }

      })
      .catch(err => {
        console.log('err finding character');
        console.log(err);
        resolveMsg(err);
      })

    });
  },

  //+ Get Character from DB
  getCharacter(username) {
    return new Promise((resolve, reject) => {

      // Resolve function
      function resolveCheck(status) {resolve(status)}

      // Check DB for character
      Character.findOne({name:username}).then(result => {
        console.log('finding character');//remove
        if(result.name === username + '') {
          resolveCheck(result);
        }
        if(result == null) {
          resolveCheck(false)
        }

      })
      .catch(err => {
        console.log('err finding character')
        console.log(err)
        resolveCheck(false);
      })

    });
  }

}

module.exports = game;
