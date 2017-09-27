const secret = require('../_config/secret.js');
const commands = require('./commands');
const game = require('./game');
const jobs = require('./jobs');

//+ IRC Setup
const tmi = require('tmi.js');
const tmiOptions = {
  options: {
    debug:true
  },
  connection: {
    cluster:"aws",
    reconnect:true,
    timeout: 5000
  },
  identity: {
    username: secret.twitchUsername,
    password: secret.twitchKey
  },
  channels: secret.twitchChannels
};
const passWhispers = 0;
const irc = new tmi.client(tmiOptions);
const commandKeys = Object.keys(commands);

//+ IRC Connect
irc.connect();

//+ IRC Connected Listener
irc.on('connected', function() {
  irc.whisper(secret.botOwner, 'pbot just connected!');
  jobs.kickoff();
});

//+ IRC Disconnected Listener
//- note: does not fire on node process exit
irc.on('disconnected', function() {
  irc.whisper(secret.botOwner, 'pbot just disconnected!');
});

//+ IRC Chat Listener
// - all of our bot functionality is chained off of this listener!
irc.on("chat", function (channel, userstate, message, self) {

  // Make sure this is a "!" command, and that the bot didn't send it
  if (self) return;
  if(message.substr(0,1) != '!') return;

  // Define term and argument
  // - only supporting single argument right now
  const splitMsg = message.split(" ");
  const term = splitMsg[0].substr(1, message.length);
  const argument = splitMsg[1];

  if(commandKeys.includes(term)) {
    const commandFunction = commands[term];
    if(splitMsg.length === 2) {
      commandFunction(userstate.username, argument);
    } else {
      commandFunction(userstate.username);
    }
  }

  // If passWhispers is set to 1, bot will pass all whispers it receives
  // to the botOwner
  if(passWhispers === 1) {
    irc.whisper(
      secret.botOwner,
      userstate.username + ' just made command: ' + term
    );
  }

});

// Export a "chat" Object so we can execute chat functions from other files
// - need this working!
exports.whisper = function(user, msg) {
  console.log('irc.whisper triggered for' + user + '\n' + msg);
  irc.whisper(user, msg);
}

exports.whisper = function(user, msg) {
  irc.whisper(user, msg);
}

exports.action = function(msg) {
  irc.action(secret.twitchMainChannel, msg);
}
