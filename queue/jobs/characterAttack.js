const util = require('../../_shared/util');
const moment = require('moment');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const Monster = mongoose.model('Monster');
const getCharacter = require('./getCharacter');
const sendMessage = require('./sendMessage');
const monsters = require('../data/monsters.json');
const makeAttack = require('./makeAttack');

// Attack cooldown (30sec - mod)
// - working off of updated_at (move, attack)
const attackAllowed = (mod, lastUpdate) => {
  let seconds = 15;
  if(mod) {
    if(mod >= 23) {
      seconds = 7;
    }
    if(mod < 23) {
      seconds = seconds - mod;
    }
  }
  let latestAttack = moment(lastUpdate);
  let attackBool = moment().subtract(seconds, 'seconds') > latestAttack;
  let cooldownObj = {
    canAttack: attackBool,
    remaining: moment().diff(moment(latestAttack), 'seconds') - (seconds)
  }
  return (cooldownObj);
}

module.exports = (username, arg1, arg2) => {

  getCharacter(username)
  .then((characterResult) => {
    if(characterResult == null) {
      console.log(`${username} doesn't have a character. Type !newcharacter`)
      sendMessage(
        'say', null,
        `${username} doesn't have a character. Type !newcharacter`
      );
    } else if(characterResult.dead === 1) {
      sendMessage( 'say', null, `${username} is dead`);
      return;
    } else {
      let characterUpdate = {name: username};

      // Sanctuary Check
      if(characterResult.location === 'sanctuary') {
        sendMessage( 'action', null, `The Sanctuary glows bright, strengthened by adversity`);
        return;
      }

      // Death Pit Check
      if(characterResult.location === 'death_pit') {
        sendMessage( 'action', null, `You are overwhelmed by grief`);
        return;
      }

      // Cooldown Check
      let cooldown = attackAllowed(characterResult.stats.ap, characterResult.last_attack);
      //only check cooldown for character vs. character attacks
      if(!arg2) {
        if(!characterResult.last_attack) {
          characterUpdate.last_attack = Date.now();
        }
        if(characterResult.last_attack && cooldown.canAttack) {
          characterUpdate.last_attack = Date.now();
        }
        if(characterResult.last_attack && ! cooldown.canAttack) {
          sendMessage(
            'say', null,
            `${username} - your attack is on cooldown (${-cooldown.remaining}sec)`
          );
          return;
        }
      }

      // Player attacks monster
      if(arg1 === 'monster' || arg1 === 'm') {
        let monstersArr = [];
        for(let monster of monsters) {
          monstersArr.push(monster.name)
        }
        if(!monstersArr.includes(arg2)) {
          sendMessage( 'say', null, `${arg2} is not a valid monster.`);
          return;
        }
        Monster.find({name: arg2})
        .then(monsterResult => {
          if(monsterResult && monsterResult != null) {
            //- same location check
            if(characterResult.location != monsterResult[0].location) {
              sendMessage('say', null,
                `you can only attack monsters within your location (${characterResult.location})`
              ); return;
            }
            //-do attack
            makeAttack('characterVsMonster', characterResult, monsterResult[0]);
            if(characterUpdate.last_attack) {
              Character.findOneAndUpdate({name:username}, characterUpdate)//update cd
              .then(result => {console.log('updated attack cd')})
              .catch(err => {console.log('Err updating attack cd\n' + err)})
            }
          }
        }).catch(err => {console.log('Err getting monster\n' + err)})

      }
      // Player attacks player
      else {

        Character.find({name:arg1})
        .then(enemyResult => {
          if(enemyResult && enemyResult[0] && enemyResult != null) {
            //- same location check
            if(characterResult.location != enemyResult[0].location) {
              sendMessage('say', null,
                `you can only attack enemies within your location (${characterResult.location})`
              ); return;
            }
            //-do attack
            makeAttack('characterVsCharacter', characterResult, enemyResult[0]);
            if(characterUpdate.last_attack) {
              Character.findOneAndUpdate({name:username}, characterUpdate)//update cd
              .then(result => {console.log('updated attack cd')})
              .catch(err => {console.log('Err updating attack cd\n' + err)})
            }
          } else {
            sendMessage('say', null,
              `${username} - you can only attack characters or monsters (!attack [character] or !attack monster [monster])`
            ); return;
          }
        }).catch(err => {console.log('Err getting enemy player\n' + err)})

      }
    }
  }).catch(err => {
    console.log('Err on getCharacter @ characterAttack:\n' + err)
  })

}
