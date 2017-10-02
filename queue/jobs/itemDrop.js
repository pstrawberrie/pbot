const util = require('../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const Monster = mongoose.model('Monster');
const Location = mongoose.model('Location');
const items = require('../data/items.json');
const sendMessage = require('./sendMessage');

module.exports = (itemsArr, location) => {
  if(!itemsArr) return;
  if(!location) return;

  Location.find({name:location})
  .then(result => {
    if(result[0]) {
      let itemsToDrop = [...result[0].items];
      for(let item of itemsArr) {
        if(!itemsToDrop.includes(item)) {
          itemsToDrop.push(item)
        }
      }
      if(itemsToDrop.length === 0) return;

      Location.update({name:location}, {items:itemsToDrop})
      .then(result => {
        sendMessage('action',null,`${util.arrCommaJoin(itemsToDrop)} dropped in ${location}`)
      }).catch(err => {`Err updating items in ${location}\n${err}`})
    }
  }).catch(err => {`Err dropping items to ${location}\n${err}`})


}
