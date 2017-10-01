const util = require('../../_shared/util');
const moment = require('moment');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const Monster = mongoose.model('Monster');
const Location = mongoose.model('Location');
const sendMessage = require('./sendMessage');
const moveMonster = require('./moveMonster');

const calcBaseDamage = (variant, attackerStats, defenderStats, attackerMods, defenderMods) => {
  if(variant === 'classic') {
    return util.negativeToOne((attackerStats.atk * attackerStats.atk) / (defenderStats.atk + defenderStats.def));
  }
}

module.exports = (directive, attacker, defender) => {

  if(directive === 'characterVsMonster') {
    let baseDmgToMonster = Math.floor(calcBaseDamage('classic', attacker.stats, defender.stats));
    let baseDmgToCharacter = Math.floor(calcBaseDamage('classic', defender.stats, attacker.stats));
    if(defender.name === 'training_dummy') {baseDmgToCharacter = 0;}
    const newCharacterHp = util.negativeToZero(attacker.stats.hp - baseDmgToCharacter);
    const newMonsterHp = util.negativeToZero(defender.stats.hp - baseDmgToMonster);
    let characterUpdate = {stats:{
      hp:newCharacterHp,
      ap:attacker.stats.ap,
      mp:attacker.stats.mp,
      atk:attacker.stats.atk,
      def:attacker.stats.def
    }};
    let monsterUpdate = {stats:{
      hp:newMonsterHp,
      ap:defender.stats.ap,
      mp:defender.stats.mp,
      atk:defender.stats.atk,
      def:defender.stats.def
    }};
    let characterDead = 0, monsterDead = 0;
    if(newCharacterHp === 0) {
      characterDead = 1; characterUpdate.dead = 1;
      characterUpdate.totalDeaths = (attacker.totalDeaths || 0) + 1;
    }
    if(newMonsterHp === 0) {
      monsterDead = 1; monsterUpdate.dead = 1;
      monsterUpdate.totalDeaths = (defender.totalDeaths || 0) + 1;
    }

    //do db updates for damage
    Character.update({name:attacker.name}, characterUpdate)
    .then(result => {
      console.log ('updated Character hp to ' + newCharacterHp);
    }).catch(err => {console.log(`Err updating character vs monster\n ${err}`)})
    Monster.update({name:defender.name}, monsterUpdate)
    .then(result => {
      console.log ('updated Monster hp to ' + newMonsterHp)
      //give messages
      sendMessage('action', null,
        `${attacker.name} attacked ${defender.name} for ${baseDmgToMonster} damage (${newMonsterHp}hp remaining). ${attacker.name} took ${baseDmgToCharacter} damage (${newCharacterHp}hp remaining).`
      )
      if(characterDead === 1) {
        sendMessage('action', null, `RIP ** ${attacker.name} was killed by ${defender.name}! ** BibleThump`)
      }
      if(monsterDead === 1) {
        sendMessage('action', null, `** ${defender.name} was killed by ${attacker.name}! ** Squid4`);
        moveMonster(defender.name, 'death_pit');
      }
    }).catch(err => {console.log(`Err updating character vs monster\n ${err}`)})

    console.log(`${attacker.name} damage to ${defender.name}: ${baseDmgToMonster}`);
    console.log(`${defender.name} damage to ${attacker.name}: ${baseDmgToCharacter}`);
  }
  if(directive === 'characterVsCharacter') {
    console.log('Character Attack incoming!')
  }
  if(directive === 'monsterVsCharacter') {
    console.log('Character Attack incoming!')
  }

}
