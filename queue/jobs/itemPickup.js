const util = require('../../_shared/util');
const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const Location = mongoose.model('Location');
const sendMessage = require('./sendMessage');
const sendCharacterSocket = require('./sendCharacterSocket');

module.exports = (username, itemToPickup) => {
  if(!username) return;
  if(!itemToPickup) return;

  Character.find({name:username})
  .then(characterResult => {
    if(characterResult != null && characterResult[0]) {
      let characterLocation = characterResult[0].location;
      let characterItems = characterResult[0].items;

      if(characterResult[0].dead === 1) {
        sendMessage('say', null, `${username} is dead.`)
        return;
      }

      if(characterItems.includes(itemToPickup)) {
        sendMessage('say', null, `${username} - you already have ${itemToPickup}`)
        return;
      }

      Location.find({name:characterLocation})
      .then(locationResult => {
        if(locationResult != null && locationResult[0]) {
          if(!locationResult[0].items.includes(itemToPickup)) {
            sendMessage('say', null, `${username} - there is no ${itemToPickup} in ${characterLocation}`);
            return;
          }
          //if character and item are in this location, update both
          if(locationResult[0].characters.includes(username) && locationResult[0].items.includes(itemToPickup)) {

            //create new location items array
            let newLocationItems = [...locationResult[0].items];
            let itemToPickupIndex = newLocationItems.indexOf(itemToPickup)
            newLocationItems.splice(itemToPickupIndex,1);

            //create new character items array
            let newCharacterItems = [...characterItems];
            newCharacterItems.push(itemToPickup);

            Location.update({name:characterLocation}, {items:newLocationItems})
            .then(locationUpdateResult => {
              Character.findOneAndUpdate({name:username}, {items:newCharacterItems}, {new:true})
              .then(characterUpdateResult => {
                sendMessage('action', null, `${username} picked up ${itemToPickup}. Visit the sanctuary to equip items.`);
                sendCharacterSocket('characterItemPickup', {character:characterUpdateResult});
              }).catch(err => {`Err updating new items array for character ${username}\n${err}`})
            }).catch(err => {`Err updating new items array for location ${location}\n${err}`})
          }
        }
      }).catch(err => {`Err finding ${location}\n${err}`})
    }
  }).catch(err => {`Err finding ${username}\n${err}`})


}
