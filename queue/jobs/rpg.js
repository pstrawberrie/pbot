const util = require('../../_shared/util');
const sendMessage = require('./sendMessage');

module.exports = () => {

  sendMessage('say', null, `
  pbot RPG v0.1 - a twitch chat RPG! BloodTrail 
  Start out by typing !newcharacter -
  Type !help for commands or !help [command]
  `)

}
