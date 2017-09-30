const util = require('../../_shared/util');
const commands = require('../data/commands.json');
const sendMessage = require('./sendMessage');

module.exports = (arg1) => {

  const namesArr = Object.keys(commands);

  if(!arg1) {
    sendMessage(
      'say', null,
      `Current commands: ${util.arrCommaJoin(namesArr)}`
    );
  }
  if(arg1 && namesArr.includes(arg1)) {
    sendMessage(
      'say', null,
      `!${arg1}: ${commands[arg1]}`
    );
  }

}
