const secret = require('../_config/secret.js');
const tmi = require('tmi.js');
const tmiOptions = {
  options: {
    debug:true
  },
  connection: {
    cluster:"aws",
    reconnect:false,
    timeout: 3600
  },
  identity: {
    username: secret.twitchUsername,
    password: secret.twitchKey
  },
  channels: secret.twitchChannels
}
const irc = new tmi.client(tmiOptions);
const game = require('./game');

// Connect
irc.connect();

// Triggers
irc.on('connected', function() {
  irc.whisper(secret.botOwner, 'pbot just connected!');
});
irc.on("chat", function (channel, userstate, message, self) {
  if (self) return;
  if(message.substr(0,1) != '!') return;

  const user = userstate.username;
  const splitMsg = message.split(" ");
  const term = splitMsg[0].substr(1, message.length);

  // !newCharacter
  if(term === 'newCharacter' || term === 'newcharacter') {
    game.newCharacter(user)
    .then(msg => {
      return irc.whisper(user, msg);
    })
  }
  // !stats
  if(term === 'stats') {
    game.getCharacter(user)
    .then(result => {
      if(result === false) return;
      const statString =  result.stats.hp + 'HP | ' +
      result.stats.ap + 'AP | ' +
      result.stats.mp + 'MP | ' +
      result.stats.mp + 'DEF | ' +
      result.stats.mp + 'ATK';
      return irc.whisper(user, statString);
    });
  }
  // !items
  if(term === 'items') {
    game.getCharacter(user)
    .then(result => {
      if(result === false) return;
      return irc.whisper(user, result.items.join(', '));
    });
  }
  // !items
  if(term === 'skills') {
    game.getCharacter(user)
    .then(result => {
      if(result === false) return;
      return irc.whisper(user, result.skills.join(', '));
    });
  }
  // !location
  if(term === 'location') {
    game.getCharacter(user)
    .then(result => {
      if(result === false) return;
      return irc.whisper(user, result.location);
    });
  }

  // Sanity Check - command passthrough
  // irc.whisper(
  //   secret.botOwner,
  //   user + ' just made command: ' + term
  // );

});
