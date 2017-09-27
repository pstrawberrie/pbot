const mongoose = require('mongoose');
const Agenda = require('agenda');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const util = require('../_shared/util');
const messageEntry = require('./jobs/messageEntry');

const app = express();


// DB Connect
mongoose.connect('mongodb://127.0.0.1/rpg', {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`Mongo connection Error:\n ${err.message}`);
});

// Agenda Setup
const agenda = new Agenda({db:{address:'mongodb://127.0.0.1/rpg'}}); //init agenda
agenda.on('ready', function() { agenda.start() }); //start agenda on db connect
agenda.define('messageEntry', function(job, done) {
  messageEntry(job.attrs.data);
  done();
});
function graceful() {
  agenda.stop(function() { process.exit(0); });
}
process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

// Post A Whisper
//@TODO: Clean this up (split it out into separate func/file)
//!!!!!!!!!!!!!!
function sendWhisper(user, message) {
  const requestOptions = {
    uri: 'http://localhost:3001/msg',
    method: 'POST'
  }
  requestOptions.json = {
    name: user,
    message
  }
  request(requestOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('message post success');
    } else {
      console.log('error: ' + error);
      console.log('response: ' + response);
    }
  });
}
sendWhisper('pstrawberrie', 'HEY BROE GET UR SHIT TOEGETRHER');

// HTTP Setup
app.use(bodyParser.json());
app.post('/queue', function (req, res) {
  if(req.body && req.body.name && req.body.message && util.validMessage(req.body.message)) {
    agenda.now('messageEntry', req.body);
    res.end();
  } else {
    console.log('invalid queue request - ignoring');
    console.log(req.body);
    res.end();
  }
});
app.listen(3000, function () {
  console.log('-- queue listening --')
});
