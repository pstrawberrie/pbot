const sendMessage = require('../sendMessage');

module.exports = (username, arg1, arg2) => {

  // !love
  if(arg1 === '') {
    sendMessage(
      'action', null,
      `loves ${username}`
    );
  }

  // !love user
  if(arg1 != '' && arg2 === '') {
    const random = Math.random();
    let heartlevel = '<3'
    if(random > 0.5) { heartlevel = '<3 <3' }
    if(random > 0.82) { heartlevel = '<3 <3 <3' }

    sendMessage(
      'action', null,
      `gives ${random} love to ${arg1} ${heartlevel}`
    );
  }

  // !love user1 user2
  if(arg1 != '' && arg2 != '') {
    sendMessage(
      'action', null,
      `<3 ${arg2} and ${arg1} are in  LOOOOVE <3`
    );
  }

}
