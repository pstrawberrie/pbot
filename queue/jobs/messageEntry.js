const newCharacter = require('./newCharacter');
const getStats = require('./getStats');
const getLocation = require('./getLocation');
const getItems = require('./getItems');
const getSkills = require('./getSkills');
const help = require('./help');
const locations = require('./locations');
const moveCharacter = require('./moveCharacter');

module.exports = (data) => {

  const user = data.name;
  const msg = data.message;
  const date = data.date;
  const commandArr = data.message.split(' ');
  const command = commandArr[0].substr(1,commandArr[0].length).toLowerCase();
  let arg1 = '', arg2 = '';
  if(commandArr.length >= 2) {arg1 = commandArr[1]}
  if(commandArr.length === 3) {arg2 = commandArr[2]}

  console.log('--------');
  console.log(user + ' command: ' + command);
  if(arg1 != '') {console.log('argument1: ' + arg1)}
  if(arg2 != '') {console.log('argument2: ' + arg2)}

  // Forward the command to the appropriate function
  switch (command) {

    case "help":
    case "commands":
      help(arg1);
      break;

    case "newcharacter":
      newCharacter(user);
      break;

    case "stats":
      getStats(user, arg1);
      break;

    case "location":
    case "where":
      getLocation(user, arg1);
      break;

    case "locations":
      locations();
      break;

    case "items":
      getItems(user, arg1);
      break;

    case "skills":
      getSkills(user, arg1);
      break;

    case "move":
    case "goto":
      moveCharacter(user, arg1);

    default:
      console.log('the command "' + command + '" is not registered with the bot')
      break;

  }

}
