const secret = require('../_config/secret');
const mongoose = require('mongoose');
const Agenda = require('agenda');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const util = require('../_shared/util');
const messageEntry = require('./jobs/messageEntry');

// DB Connect
mongoose.connect(secret.dbString, {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.once('open', () => {console.log('+++ queue is connected to mongodb +++') })
mongoose.connection.on('error', (err) => {
  console.error(`Mongo connection Error:\n ${err.message}`);
});

// Agenda Setup
const agenda = new Agenda({db:{address:secret.dbString}}); //init agenda
agenda.define('messageEntry', function(job, done) { //define agenda entry job
  messageEntry(job.attrs.data);
  done();
});
agenda.on('ready', function() { //start agenda on db connect
  console.log('+++ queue agenda is connected to mongodb +++');
  agenda.start();
});
agenda.on('error', function(err) { //log any errors connecting to agenda db
  console.log('queue failed to connect to agenda!!');
  console.log(err);
});
agenda.on('fail', function(err, job) { //log failed agenda jobs
  console.log('Agenda job "' + job.attrs.name + '" failed!');
  console.log('Error String: ' + err);
});
function graceful() {
  agenda.stop(function() { process.exit(0); });
}
process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

// HTTP Setup
const app = express();
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
  console.log('+++ queue listening (http://localhost:3000) +++')
});
