const mongoose = require('mongoose');
const Agenda = require('agenda');
const express = require('express');
const bodyParser = require('body-parser');

const util = require('./util');
const messageClean = require('./jobs/messageClean');

const app = express();


// DB Connect
mongoose.connect('mongodb://127.0.0.1/rpg', {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`Mongo connection Error:\n ${err.message}`);
});

// Agenda Setup
const agenda = new Agenda({db:{address:'mongodb://127.0.0.1/rpg'}});
agenda.on('ready', function() { agenda.start() });
agenda.define('messageClean', function(job, done) {
  messageClean(job.attrs.data)
  done();
});
function graceful() {
  agenda.stop(function() { process.exit(0); });
}
process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

// HTTP Setup
app.use(bodyParser.json());
app.post('/queue', function (req, res) {
  if(req.body && req.body.name && req.body.message && util.validMessage(req.body.message)) {
    agenda.now('messageClean', req.body);
    res.end();
  } else {
    console.log('invalid queue request - ignoring');
    res.end();
  }
});
app.listen(3000, function () {
  console.log('-- queue listening --')
});
