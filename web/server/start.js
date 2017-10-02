const chalk = require('chalk');
const mongoose = require('mongoose');
const secret = require('../../_config/secret');
const socket = require('socket.io-client')('http://localhost');

mongoose.connect(secret.dbString, {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`Mongo connection Error:\n ${err.message}`);
});

// Import Models
//@TODO: investigate sharing the model file
require('./models/Character');

// Start our app!
const app = require('./app');
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.set('port', process.env.PORT || 3002);
server.listen(app.get('port'), () => {
  console.log(
    chalk.cyan(`+++ web listening (http://localhost:${server.address().port}) +++`)
  );
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
