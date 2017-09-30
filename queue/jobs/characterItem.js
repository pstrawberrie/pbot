const secret = require('../../_config/secret');
const util = require('../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const getCharacter = require('./getCharacter');
const sendMessage = require('./sendMessage');
const items = require('../data/items.json');

module.exports = (directive, username, item) => {

  if(!directive || directive === '') return;
  if(!username || !item) return;
  if(!item) return;
  if(!Object.keys(items).includes(item)) {
    sendMessage(
      'whisper', secret.botOwner,
      `${item} is not a valid item`
    );
  }

  getCharacter(username)
  .then((result) => {
    if(result == null) {
      sendMessage(
        'whisper', secret.botOwner,
        `${username} is not a valid character`
      );
    }

    //+ Give Item
    //-- already has item
    if(directive === 'give' && result.items && result.items.includes(item)) {
      sendMessage(
        'whisper', secret.botOwner,
        `${username} already has ${item}`
      );
    }
    //-- give success (add stats)
    if(directive === 'give' && result.items && !result.items.includes(item)) {
      const newStats = util.calcStatsFromItem('add', result.stats, items, item);
      let newItemArr = result.items; newItemArr.push(item);
      const update = {stats: newStats, items: newItemArr};
      const updatedCharacter = Character.update({ name: username }, update,
      { new: true }).exec();
      sendMessage(
        'action', secret.botOwner,
        `awarded ${item} to ${username}. New Stats: ${util.statsString(newStats)}`
      );
    }

    //+ Remove Item
    //-- does not have item
    if(directive === 'remove' && result.items && !result.items.includes(item)) {
      sendMessage(
        'whisper', secret.botOwner,
        `${username} does not have the item "${item}" to remove`
      );
    }
    //-- remove success (subtract stats)
    if(directive === 'remove' && result.items && result.items.includes(item)) {
      const newStats = util.calcStatsFromItem('subtract', result.stats, items, item);
      let itemIndex = result.items.indexOf(item);
      let newItemArr = result.items;
      newItemArr.splice(itemIndex,1);
      const update = {stats: newStats, items: newItemArr};
      const updatedCharacter = Character.update({ name: username }, update,
      { new: true }).exec();
      sendMessage(
        'action', secret.botOwner,
        `removed ${item} from ${username}. New Stats: ${util.statsString(result.stats)}`
      );
    }

  });

}
