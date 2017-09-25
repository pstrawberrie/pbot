const game = require('./game');
const chat = require('./irc');
const h = require('./helpers');

// Define All Commands
// - Commands should return promises!
exports.commands = {

  newcharacter(user) {
    return new Promise((resolve, reject) => {

      console.log(`New Character creation for ${user}`);
      game.newCharacter(user)
      .then((result) => {
        resolve();
      });

    });
  },
  stats(user) {
    return new Promise((resolve, reject) => {

      console.log(`Stats lookup for ${user}`);
      game.getCharacter(user)
      .then((result) => {
        if(result != false) {
          chat.whisper(user, h.statsString(result.stats));
          resolve();
        } else {
          resolve();
        }
      });

    });
  },
  items(user)  {
    return new Promise((resolve, reject) => {

      console.log(`Items lookup for ${user}`);
      game.getCharacter(user)
      .then((result) => {
        if(result != false) {
          chat.whisper(user, h.arrCommaJoin(result.items));
          resolve();
        } else {
          resolve();
        }
      });

    });
  },
  skills(user) {
    return new Promise((resolve, reject) => {

      console.log(`Skills lookup for ${user}`);
      game.getCharacter(user)
      .then((result) => {
        if(result != false) {
          chat.whisper(user, h.arrCommaJoin(result.skills));
          resolve();
        } else {
          resolve();
        }
      });

    });
  },
  location(user) {
    return new Promise((resolve, reject) => {

      console.log(`Location lookup for ${user}`);
      game.getCharacter(user)
      .then((result) => {
        if(result != false) {
          chat.whisper(user, result.location);
          resolve();
        } else {
          resolve();
        }
      });

    });
  }

};
