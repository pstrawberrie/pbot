const util = require('../../_shared/util');
const moment = require('moment');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const Monster = mongoose.model('Monster');
const Location = mongoose.model('Location');
const sendMessage = require('./sendMessage');

module.exports = (directive, attacker, defender) => {

  if(directive === 'monster') {
    console.log('Monster Attack incoming!')
    console.log(`${attacker.name} (attacker) stats:\n ${attacker.stats}`)
    console.log(`${defender.name} (defender) stats:\n ${defender.stats}`)
  }
  if(directive === 'character') {
    console.log('Character Attack incoming!')
    console.log(`${attacker.name} (attacker) stats:\n ${attacker.stats}`)
    console.log(`${defender.name} (defender) stats:\n ${defender.stats}`)
  }

}
