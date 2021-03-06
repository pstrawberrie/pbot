const secret = require('../_config/secret');
const util = require('../_shared/util');
const chalk = require('chalk');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const tmi = require('tmi.js');

//+ IRC Setup
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
let requestOptions = {
  uri: 'http://localhost:4000/queue',
  method: 'POST'
}
const irc = new tmi.client(tmiOptions);

//+ IRC Connect
irc.connect()
.catch((error) => {
  console.log('Error connecting to IRC:');
  console.log(error);
});

//+ IRC Connected Listener
irc.on('connected', function() {
  irc.whisper(secret.botOwner, 'pbot just connected to ' + secret.twitchChannels);
});

//+ IRC Disconnected Listener
irc.on('disconnected', function() {
  irc.whisper(secret.botOwner, 'pbot just disconnected!');
});

//+ IRC Chat Listener (this is the juicy part)
irc.on("chat", function (channel, userstate, message, self) {

  // Make sure this is a "!" command, and that the bot didn't send it
  if (self) return;
  if(!util.validMessage(message)) return;

  const user = userstate.username;
  requestOptions.json = {
    name: user,
    message,
    time: Date.now()
  }

  request(requestOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(`${user} triggered command ${message}`);
    } else {
      console.log('error: ' + error);
      console.log('response: ' + response);
    }
  });

});

// HTTP Setup
const app = express();
app.use(bodyParser.json());
app.post('/say', function (req, res) {
  if(req.body) {
    console.log('received irc http request on /say');
    irc.say(secret.twitchMainChannel, req.body.message);
    res.end();
  } else {
    console.log('invalid irc http request on /say');
    res.end();
  }
});
app.post('/whisper', function (req, res) {
  if(req.body) {
    console.log('received irc http request on /whisper');
    irc.whisper(req.body.user, req.body.message);
    res.end();
  } else {
    console.log('invalid irc http request on /whisper');
    res.end();
  }
});
app.post('/action', function (req, res) {
  if(req.body) {
    console.log('received irc http request on /action');
    irc.action(secret.twitchMainChannel, req.body.message);
    res.end();
  } else {
    console.log('invalid irc http request on /action');
    res.end();
  }
});
app.listen(4001, function () {
  console.log(
    chalk.cyan('+++ irc http listening (http://localhost:4001) +++')
  )
});
