const util = require('../../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const sendMessage = require('../sendMessage');
const items = require('../../data/items.json');
const sendCharacterSocket = require('../sendCharacterSocket');

module.exports = (caster, castTarget) => {

  //if mp is 0, return cant heal message
  if(caster.stats.mp === 0) {
    sendMessage('say',null,`${caster.name} - you are out of MP (heal costs 1MP)`)
    return;
  }

  //calculate heal cost & effectiveness
  let critString = '';
  function calculateHeal(casterStats) {
    let resultObj = {cost:1,amount:0};
    resultObj.amount = Math.floor((casterStats.atk * casterStats.ap) / casterStats.ap);
    if(Math.random() > 8.85) { critString = ' CRIT'; resultObj.amount = (resultObj.amount * 2); }
    return resultObj;
  }

  if(!castTarget) {
    //+ HEALING CASTER/SELF (NO TARGET)
    const calculated = calculateHeal(caster.stats);
    const casterMaxStats = util.calcStatsFromItems(items, caster.items);
    const casterCurrentHp = caster.stats.hp;
    const casterMaxHp = casterMaxStats.hp;
    let casterNewHp = casterCurrentHp + calculated.amount;
    let casterNewMp = util.negativeToZero(caster.stats.mp - calculated.cost);

    //if the caster is already at max hp
    if(caster.stats.hp === casterMaxHp) {
      sendMessage('say',null,`${caster.name} is already at full HP`); return;
    }

    //if the heal is over caster's max hp, return max hp
    if(casterNewHp >= casterMaxHp) { casterNewHp = casterMaxHp }
    let casterUpdate = {
      stats: {
        hp:casterNewHp,
        ap:caster.stats.ap,
        mp:casterNewMp,
        atk:caster.stats.atk,
        def:caster.stats.def
      },
      updated_at: new Date()
    }

    Character.findOneAndUpdate({name:caster.name},casterUpdate,{new:true})
    .then(casterUpdateResult => {
      sendMessage('action',null,`${caster.name}${critString} healed for ${calculated.amount}HP (${casterNewHp}/${casterMaxHp}HP)`)
      sendCharacterSocket('characterSelfHeal', {character:casterUpdateResult});
    }).catch(err => {console.log(`err updating caster after heal\n${err}`)})

  } else {
    //+ HEALING THE CASTER'S TARGET

    //- if target is dead, cant heal them
    if(castTarget.dead === 1) {
      sendMessage('say',null,`${caster.name} - dead characters can't be healed`)
      return;
    }

    const calculated = calculateHeal(caster.stats);
    const castTargetMaxStats = util.calcStatsFromItems(items, castTarget.items);
    const castTargetCurrentHp = castTarget.stats.hp;
    const castTargetMaxHp = castTargetMaxStats.hp;
    let casterNewMp = util.negativeToZero(caster.stats.mp - calculated.cost);
    let castTargetNewHp =castTargetCurrentHp + calculated.amount;

    //if the castTarget is already at max hp
    if(castTarget.stats.hp === castTargetMaxHp) {
      sendMessage('say',null,`${castTarget.name} is already at full HP`); return;
    }

    //if the heal is over caster's max hp, return max hp
    if(castTargetNewHp >= castTargetMaxHp) { castTargetNewHp = castTargetMaxHp }
    let casterUpdate = {
      stats: {
        hp:caster.stats.hp,
        ap:caster.stats.ap,
        mp:casterNewMp,
        atk:caster.stats.atk,
        def:caster.stats.def
      },
      updated_at: new Date()
    }
    let castTargetUpdate = {
      stats: {
        hp:castTargetNewHp,
        ap:castTarget.stats.ap,
        mp:castTarget.stats.mp,
        atk:castTarget.stats.atk,
        def:castTarget.stats.def
      }
    }

    Character.findOneAndUpdate({name:caster.name},casterUpdate,{new:true})
    .then(casterUpdateResult => {
      Character.findOneAndUpdate({name:castTarget.name},castTargetUpdate,{new:true})
      .then(castTargetUpdateResult => {
        sendMessage('action',null,`${caster.name}${critString} healed ${castTarget.name} for ${calculated.amount}HP (${castTargetNewHp}/${castTargetMaxHp}HP)`)
        sendCharacterSocket('characterTargetHeal', {character:casterUpdateResult,target:castTargetUpdateResult});
      }).catch(err => {console.log(`err updating cast target after heal\n${err}`)})
    }).catch(err => {console.log(`err updating caster after targeted heal\n${err}`)})

  }


}
