const util = require('../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const sendMessage = require('./sendMessage');
const skills = require('../data/skills.json');
const heal = require('./skills/heal');

module.exports = (username, arg1, arg2) => {
  if(!username) return;
  if(!arg1) return;

  let skillsArr = Object.keys(skills);

  //check the skill is valid
  if(!skillsArr.includes(arg1)) {
    sendMessage('say',null,`${arg1} is not a valid skill. Type !skills`)
  }
  //check the character is valid & has the skill
  Character.find({name:username})
  .then(casterResult => {
    if(casterResult != null && casterResult[0] && casterResult[0].name === username) {

      //if character is dead
      if(casterResult[0].dead === 1) {
        sendMessage('say',null,`${username} is dead.`)
      }
      //if character doesn't have skill
      if(!casterResult[0].skills.includes(arg1)) {
        sendMessage('say',null,`${username} - you haven't learned ${arg1}`)
        return;
      }

      //everything is set, pass along the caster character obj and the target character obj
      //if character is targeting another character
      if(arg2) {
        Character.find({name:arg2})
        .then(targetResult => {
          if(targetResult != null && targetResult[0] && targetResult[0].name === arg2) {
            //make sure caster & target are in same location
            if(casterResult[0].location != targetResult[0].location) {
              sendMessage('say',null,`${username} - you can only cast on others in your location (${casterResult[0].location})`)
            }
            //ok to cast on this target
            sendCast(arg1, casterResult[0], targetResult[0])
          }
        }).catch(err => {console.log(`err getting caster target\n${err}`)})
      } else {
        sendCast(arg1, casterResult[0])
      }

    }
  }).catch(err => {console.log(`err getting caster character\n${err}`)})

  function sendCast(skill, caster, target) {

    // Cast Switch
    switch(skill) {

      case "heal":
        heal(caster, target);
        break;

      default:
        console.log('unknown skill sent to sendCast function')
        break;
    }

  }

}
