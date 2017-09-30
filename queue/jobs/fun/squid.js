const sendMessage = require('../sendMessage');

module.exports = (arg1) => {

  if(!arg1) {
    sendMessage(
      'say', null,
      'Squid1 Squid2 Squid3 Squid4'
    );
  }
  if(arg1 === 'wave') {
    sendMessage(
      'say', null,
      'Squid4'
    );
  }

}
