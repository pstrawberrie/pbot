const chalk = require('chalk');
const mongoose = require('mongoose');
const secret = require('../../_config/secret');

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
app.set('port', process.env.PORT || 3002);
const server = app.listen(app.get('port'), () => {
  console.log(
    chalk.cyan(`+++ web listening (http://localhost:${server.address().port}) +++`)
  );
});
