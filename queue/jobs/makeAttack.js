const util = require('../../_shared/util');
const moment = require('moment');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const Monster = mongoose.model('Monster');
const Location = mongoose.model('Location');
const sendMessage = require('./sendMessage');
const moveMonster = require('./moveMonster');
const itemDrop = require('./itemDrop');

const calcBaseDamage = (variant, attackerStats, defenderStats, attackerMods, defenderMods) => {
  if(variant === 'classic') {
    return util.negativeToOne((attackerStats.atk * attackerStats.atk) / (defenderStats.atk + defenderStats.def));
  }
}

module.exports = (directive, attacker, defender) => {

  //+ CHARACTER VS MONSTER
  if(directive === 'characterVsMonster') {
    let attackString = 'attacked';
    let monsterCritString = '';
    let baseDmgToMonster = Math.floor(calcBaseDamage('classic', attacker.stats, defender.stats));
    let baseDmgToCharacter = Math.floor(calcBaseDamage('classic', defender.stats, attacker.stats));

    // crit vs monster chance
    if(Math.random() > .8) { attackString = 'CRIT'; baseDmgToMonster = (baseDmgToMonster * 2) + Math.floor(attacker.stats.ap / 2) }
    // monster crit chance
    if(Math.random() > .92) { monsterCritString = ' CRIT'; baseDmgToCharacter = Math.floor(baseDmgToCharacter * 1.5) }

    // special monsters
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
      characterUpdate.totalMonsterKills = (attacker.totalMonsterKills || 0) + 1;
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
        `${attacker.name} ${attackString} ${defender.name} for ${baseDmgToMonster} damage (${newMonsterHp}hp remaining). ${attacker.name} took ${baseDmgToCharacter}${monsterCritString} damage (${newCharacterHp}hp remaining).`
      )
      if(characterDead === 1) {
        sendMessage('action', null, `RIP ** ${attacker.name} was killed by ${defender.name}! ** BibleThump`)
      }
      if(monsterDead === 1) {
        sendMessage('action', null, `** ${defender.name} was killed by ${attacker.name}! ** Squid4`);
        if(Math.random() > .65) itemDrop(defender.drops, defender.location);
        moveMonster(defender.name, 'death_pit');
      }
    }).catch(err => {console.log(`Err updating character vs monster\n ${err}`)})

    console.log(`${attacker.name} damage to ${defender.name}: ${baseDmgToMonster}`);
    console.log(`${defender.name} damage to ${attacker.name}: ${baseDmgToCharacter}`);
  }

  //+ CHARACTER VS CHARACTER
  if(directive === 'characterVsCharacter') {
    let attackString = 'attacked';
    let baseDmgToEnemy = Math.floor(calcBaseDamage('classic', attacker.stats, defender.stats));
    const newEnemyHp = util.negativeToZero(defender.stats.hp - baseDmgToEnemy);

    // crit vs character
    if(Math.random() > .75) { attackString = 'CRIT'; baseDmgToEnemy = (baseDmgToEnemy * 2) + Math.floor(attacker.stats.ap / 2) }

    let enemyUpdate = {stats:{
      hp:newEnemyHp,
      ap:defender.stats.ap,
      mp:defender.stats.mp,
      atk:defender.stats.atk,
      def:defender.stats.def
    }};
    let characterUpdate = {};
    let enemyDead = 0;
    if(newEnemyHp === 0) {
      enemyDead = 1; enemyUpdate.dead = 1;
      enemyUpdate.totalDeaths = (defender.totalDeaths || 0) + 1;
      characterUpdate.totalCharacterKills = (attacker.totalCharacterKills || 0) + 1;
    }

    //do db updates for damage
    Character.update({name:defender.name}, enemyUpdate)
    .then(result => {
      console.log (`updated ${defender.name}'s hp to ${newEnemyHp}`)
      //give messages
      sendMessage('action', null,
        `${attacker.name} ${attackString} ${defender.name} for ${baseDmgToEnemy} damage (${newEnemyHp}hp remaining).`
      )
      if(enemyDead === 1) {
        sendMessage('action', null, `** ${defender.name} was killed by ${attacker.name}! ** Squid4`);
        //update attacker total character kills
        Character.update({name:attacker.name}, characterUpdate)
        .then(characterUpdateResult => {
          console.log(`updated ${attacker.name} after killing ${defender.name}`)
        }).catch(err => {console.log(`err saving attacker info on kill for ${attacker.name}`)})
      }
    }).catch(err => {console.log(`Err updating character vs character\n ${err}`)})

    console.log(`${attacker.name} damage to ${defender.name}: ${baseDmgToEnemy}`);
  }

  //+ MONSTER VS CHARACTER
  if(directive === 'monsterVsCharacter') {
    console.log('Character Attack incoming!')
  }

}
