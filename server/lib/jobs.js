const Agenda = require('agenda');
const secret = require('../_config/secret');
const agenda = new Agenda({db: {address: secret.dbString}});

//+++ Job Definitions
agenda.define('test', function(job, done) {
  console.log('Just saying hi!');
  done();
});

//+++ Job CRONs
agenda.on('ready', function() {

  agenda.every('30 seconds', 'test');

});

exports.kickoff = function() {
  console.log('Agenda Jobs kickoff fired!');
  agenda.start();
}
