const util = require('../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const sendMessage = require('./sendMessage');
const moment = require('moment');

module.exports = () => {

  let offset = new Date(moment().subtract(11, 'minutes'));
  
  const activePlayers = Character.find({
    updated_at: {"$gte":offset}
  }).then(result => {
    let activeArr = [];
    result.forEach((player) => {
      activeArr.push(player.name);
    });
    if(activeArr.length === 0) {
      sendMessage('say',null,`No players active in the last 10 minutes`)
    } else {
      sendMessage('say',null,`${activeArr.length} Players active in the last 10 minutes: ${util.arrCommaJoin(activeArr)}`)
    }
  }).catch(err => {console.log(`err on active characters query ${err}`)})

}
