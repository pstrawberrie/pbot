const util = require('../../_shared/util');
const commands = require('../data/commands.json');
const sendMessage = require('./sendMessage');

module.exports = (arg1) => {

  const namesArr = Object.keys(commands);

  if(!arg1) {
    sendMessage(
      'say', null,
      `Current commands: ${util.arrCommaJoin(namesArr)} - use !help [command] to get more information`
    );
  }
  if(arg1 && namesArr.includes(arg1)) {
    sendMessage(
      'say', null,
      `The !${arg1} command ${commands[arg1]}`
    );
  }

}
