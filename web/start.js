const path = require('path');
const chalk = require('chalk');
const express = require('express');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const routes = require('./routes');
const secret = require('../_config/secret');
const mongoose = require('mongoose');

// DB Connect
mongoose.connect(secret.dbString, {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.once('open', () => {
  console.log(
    chalk.cyan('+++ web is connected to mongodb +++')
  )
});
mongoose.connection.on('error', (err) => {
  console.error(`Mongo connection Error:\n ${err.message}`);
});

// Middlewares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(lessMiddleware(__dirname + '', [{
  debug:true,
  force:true,//remove from prod
  pathRoot: path.join(__dirname, 'static/styles'),
  dest:'/css'
}]));
app.use('/static', express.static('static'));
app.use(bodyParser.json());

//Socket Passthrough Function
function passSocketEvent(eventName, eventJson) {
  io.emit('passed', eventName, eventJson);
}

// Routes
app.use('/', routes);
app.post('/socket', (req, res) => {
  passSocketEvent(req.body);
  res.end();
});

// Set up Socket Listener Events
io.on('connection', function(socket){

  //+ Connect & Disconnect Notice
  console.log('New Client Connected');
  socket.on('disconnect', function(){
    console.log('Client Disconnected');
  });

  //+ example..
  socket.on('test', function(info){
    console.log(`test socket caem in: ${info}`)
  });

  //+ Attack
  socket.on('attack', function(character){
    io.emit('attack', character);
  });
  //+ Move
  socket.on('move', function(character){
    io.emit('move', character);
  });
  //+ Die
  socket.on('die', function(character){
    io.emit('die', character);
  });

});

// Start Server
http.listen(3002, function(){
  console.log(chalk.cyan('+++ web listening (http://localhost:3002) +++'));
});

module.exports = app;
