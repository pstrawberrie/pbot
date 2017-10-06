const secret = require('../../_config/secret');
const love = require('./fun/love');
const squid = require('./fun/squid');
const rpg = require('./rpg');
const help = require('./help');
const newCharacter = require('./newCharacter');
const getStats = require('./getStats');
const getLocation = require('./getLocation');
const getItems = require('./getItems');
const getSkills = require('./getSkills');
const locations = require('./locations');
const moveCharacter = require('./moveCharacter');
const characterItem = require('./characterItem');
const isCharacterDead = require('./isCharacterDead');
const characterLook = require('./characterLook');
const moveMonster = require('./moveMonster');
const characterAttack = require('./characterAttack');
const resCharacter = require('./reviveCharacter');
const itemPickup = require('./itemPickup');
const characterCast = require('./characterCast');
const getActivePlayers = require('./getActivePlayers');

module.exports = (data) => {

  const user = data.name;
  const msg = data.message;
  const date = data.date;
  const commandArr = data.message.split(' ');
  const command = commandArr[0].substr(1,commandArr[0].length).toLowerCase();
  let arg1 = '', arg2 = '';
  if(commandArr.length >= 2) {arg1 = commandArr[1].toLowerCase()}
  if(commandArr.length === 3) {arg2 = commandArr[2].toLowerCase()}

  console.log('--------');
  console.log(user + ' command: ' + command);
  if(arg1 != '') {console.log('argument1: ' + arg1)}
  if(arg2 != '') {console.log('argument2: ' + arg2)}

  // Forward the command to the appropriate function
  switch (command) {

    case "love":
      love(user, arg1, arg2);
      break;

    case "squid":
      squid(arg1);
      break;

    case "rpg":
      rpg();
      break;

    case "help":
      help(arg1, arg2);
      break;

    case "newcharacter":
      newCharacter(user);
      break;

    case "players":
      getActivePlayers();
      break;

    case "alive":
      isCharacterDead('command', user, arg1);
      break;

    case "stats":
      getStats(user, arg1, arg2);
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
    case "m":
      moveCharacter(user, arg1);
      break;

    case "sanctuary":
      moveCharacter(user, 'sanctuary');
      break;

    case "town":
      moveCharacter(user, 'town_square');
      break;

    case "look":
    case "l":
      characterLook(user, arg1);
      break;

    case "attack":
    case "a":
      characterAttack(user, arg1, arg2);
      break;

    case "pickup":
      itemPickup(user, arg1);
      break;

    case "cast":
      characterCast(user, arg1, arg2);
      break;

    case "heal":
      characterCast(user, 'heal', arg1);

    //+ Admin commands
    case "giveitem":
      if(user === secret.botOwner) {
        characterItem('give', arg1, arg2);
      }
      break;

    case "removeitem":
      if(user === secret.botOwner) {
        characterItem('remove', arg1, arg2);
      }
      break;

    case "movemonster":
      if(user === secret.botOwner) {
        moveMonster(arg1, arg2);
      }
      break;

    case "res":
      if(user === secret.botOwner) {
        resCharacter(user, arg1);
      }
      break;

    //+ Test commands

    default:
      console.log('the command "' + command + '" is not registered with the bot')
      break;

  }

}
