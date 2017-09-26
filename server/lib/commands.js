const secret = require('../_config/secret');
const game = require('./game');
const chat = require('./irc');
const h = require('./helpers');

// Define All Commands
// - Commands should return promises!
const commands = {

  help(user) {
    return new Promise((resolve, reject) => {

      chat.action('RPG Commands: !' + Object.keys(commands).join(', !'));
      resolve();
    });
  },

  newcharacter(user) {
    return new Promise((resolve, reject) => {

      game.newCharacter(user)
      .then((result) => {
        resolve();
      });

    });
  },

  stats(user) {
    return new Promise((resolve, reject) => {

      game.getCharacter(user)
      .then((result) => {
        if(result != false) {
          chat.action(user + ' Stats: ' + h.statsString(result.stats));
          resolve();
        } else {
          resolve();
        }
      });

    });
  },

  items(user)  {
    return new Promise((resolve, reject) => {

      game.getCharacter(user)
      .then((result) => {
        if(result != false) {
          chat.action(user + ' Items: ' + h.arrCommaJoin(result.items));
          resolve();
        } else {
          resolve();
        }
      });

    });
  },

  skills(user) {
    return new Promise((resolve, reject) => {

      game.getCharacter(user)
      .then((result) => {
        if(result != false) {
          chat.action(user + ' Skills: ' + h.arrCommaJoin(result.skills));
          resolve();
        } else {
          resolve();
        }
      });

    });
  },

  location(user) {
    return new Promise((resolve, reject) => {

      game.getCharacter(user)
      .then((result) => {
        if(result != false) {
          chat.action(user + ' Location: ' + result.location)
          resolve();
        } else {
          resolve();
        }
      });

    });
  },

  play(user) {
    return new Promise((resolve, reject) => {

      game.setCharacterPlay(user, 1)
      .then((result) => {
        chat.action(user + ' is playing');
        resolve();
      });

    });
  },

  quit(user) {
    return new Promise((resolve, reject) => {

      game.setCharacterPlay(user, 0)
      .then((result) => {
        chat.action(user + ' quit');
        resolve();
      });

    });
  }

}

module.exports = commands;
