const util = require('../../_shared/util');
const commands = require('../data/commands.json');
const sendMessage = require('./sendMessage');
const skills = require('../data/skills.json');
const items = require('../data/items.json');

module.exports = (arg1, arg2) => {

  const commandsArr = Object.keys(commands);
  const skillsArr = Object.keys(skills);
  const itemsArr = Object.keys(items);

  if(!arg1) {
    sendMessage(
      'say', null,
      `[COMMANDS:: ${util.arrCommaJoin(commandsArr)} ] [ !help [command] to get more information ]`
    );
  }
  if(arg1 && commandsArr.includes(arg1)) {
    sendMessage(
      'say', null,
      `The !${arg1} command ${commands[arg1]}`
    );
  }
  if(arg1 === 'skill' && skillsArr.includes(arg2) || arg1 === 's' && skillsArr.includes(arg2)) {
    sendMessage('say', null, `${skills[arg2]}`)
  }
  if(arg1 === 'item' && itemsArr.includes(arg2) || arg1 === 'i' && itemsArr.includes(arg2)) {
    sendMessage('say', null, `${util.prettyLocation(arg2)} gives ${util.statsString(items[arg2], 'item')}`)
  }

}
