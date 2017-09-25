var mongoose = require('mongoose');
const Character = require('../models/Character');
const d20 = require('d20');
const whisper = require('./tmiConnect');

const game = {

  //+ New Character
  newCharacter(username) {
    if(!username) return;
    const usernameString = username + '';

    return new Promise((resolve, reject) => {
      function resolveMsg(msg) {resolve(msg)}
      Character.findOne({name:username}).then(result => {
        console.log('finding character');
        if(result.name === usernameString) {
          var prettyDate = formatDate( result.created_at, {
            year: "numeric",
            month: "long",
            weekday: "short",
            day: "numeric",
            hour: undefined,
            minute: undefined,
            timeZone: undefined,
            timeZoneName: undefined,
          } );
          resolveMsg('You created a character on ' + prettyDate + '. Type !stats');
        }
        if(result == null) {
          const newSheet = new Character ({
            name: username,
            location: 'field',
            stats: {
              hp: 1,
              ap: 1,
              mp: 1,
              def: 1,
              atk: 1
            },
            skills: ['attack', 'heal'],
            items: ['wooden stick', 'worn out clothes']
          });
          newSheet.save();
          resolveMsg('New Character created. Welcome to the fight!!');
        }

      })
      .catch(err => {
        console.log('err finding character');
        console.log(err);
        resolveMsg(err);
      })
    });
  },

  getCharacter(username) {
    return new Promise((resolve, reject) => {
      function resolveCheck(status) {resolve(status)}
      Character.findOne({name:username}).then(result => {
        console.log('finding character');
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
  },

  checkCooldown(username) {
    this.getCharacter(username)
    .then(result => {
      if(result.date) {
        console.log(result.updated_at);
        return true;
      } else { return false; }
    })
  },

  //+ Roll A Dice
  roll(num, mods) {
    if(mods) {
      //roll with mods
    }
    return d20.roll(num)
  }

}

function formatDate( date, params ) {
    var options = {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
        timeZoneName: "short",
    };

    if( params ) {
        options = Object.assign( options, params );
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
    return new Date( date ).toLocaleString( 'en-US', options );
}

module.exports = game;
