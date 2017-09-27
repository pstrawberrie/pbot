const secret = require('../_config/secret');
const Agenda = require('agenda');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const util = require('../_shared/util');

// Function to Send Test Chats
let requestOptions = {
  uri: 'http://localhost:3000/queue',
  method: 'POST'
}
function sendTestRequest(user, message) {
  if(!util.validMessage(message)) {
    console.log('invalid message: "' + message + '"');
  }
  requestOptions.json = {
    name: user,
    message,
    time: Date.now()
  }
  request(requestOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('message post success');
      console.log(requestOptions.json);
    } else {
      console.log('error: ' + error);
    }
  });
}

// Set Up Agenda for testing
const agenda = new Agenda({db:{address:secret.testDbString}}); //init agenda
agenda.define('test', function(job, done) {
  sendTestRequest('pstrawberrie', '!stats');
  done();
});
agenda.on('ready', () => {
  console.log('+++ irc test is connected to agenda +++');
  agenda.cancel({}, (err, jobs) => {
    console.log('+++ agenda jobs wiped (testing only) +++');
  });
  //agenda.every('10 seconds', 'test');
  agenda.start();
});
agenda.on('error', (err) => {
  console.log('+++ irc test failed to connect to agenda!! +++');
  console.log(err);
});
agenda.on('fail', (err, job) => {
  console.log('Agenda job "' + job.attrs.name + '" failed!');
  console.log('Error String: ' + err);
});
function graceful() {
  agenda.stop(function() { process.exit(0); });
}
process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

// HTTP Setup
//@TODO: duplicate whisper & action functionality to test
const app = express();
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.sendFile("test.html", { root : __dirname});
})
app.post('/msg', (req, res) => {
  if(req.body && req.body.name && req.body.message) {
    console.log('received irc http request');
    console.log(req.body);
    sendTestRequest(req.body.name, req.body.message);
    res.end();
  } else {
    console.log('invalid irc http request');
    res.end();
  }
});
app.listen(3001, function () {
  console.log('+++  irc http listening (http://localhost:3001) +++')
});
