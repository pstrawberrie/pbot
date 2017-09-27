const Agenda = require('agenda');
const secret = require('../_config/secret');
const agenda = new Agenda({db: {address: secret.dbString}});
const chat = require('./irc');

//+++ Job Definitions
agenda.define('helpReminder', function(job, done) {
  chat.action('Type !help to see RPG commands')
  done();
});

//+++ Job CRONs
agenda.on('ready', function() {

  agenda.every('30 minutes', 'helpReminder');

});

exports.kickoff = function() {
  console.log('Agenda Jobs kickoff fired!');
  agenda.start();
}
