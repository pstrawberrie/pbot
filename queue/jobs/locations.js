const util = require('../../_shared/util');
const locations = require('../data/locations.json');
const sendMessage = require('./sendMessage');

module.exports = () => {

  sendMessage(
    'say', null,
    `Locations: ${util.arrCommaJoin(locations)}`
  );


}
