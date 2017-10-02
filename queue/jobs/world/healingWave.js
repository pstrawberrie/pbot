const util = require('../../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const sendMessage = require('../sendMessage');
const reviveCharacter = require('../reviveCharacter');
const items = require('../../data/items.json');

module.exports = () => {

  sendMessage('action', null, 'A Healing Wave sweeps over the land')
  Character.find({dead:1})
  .then(deadCharacters => {
    for(let character of deadCharacters) {
      reviveCharacter(character.name)
    }
    Character.find({dead:0})
    .then(aliveCharacters => {
      let aliveCharactersObj = [];
      for(let character of aliveCharacters) {
        let healedStats = util.calcStatsFromItems(items, character.items);
        Character.update({name:character.name}, {stats:healedStats}, {new:true})
        .then(healResult => {
          console.log(`healed ${character.name}`)
        }).catch(err => {`err saving characters with healingWave arr\n${err}`})
      }
    }).catch(err => {`err getting alive characters for healingWave event\n${err}`})
  }).catch(err => {`err getting dead characters for healingWave event\n${err}`})


}
