const mongoose = require('mongoose');
const secret = require('./_config/secret');

mongoose.connect(secret.dbString, {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`Mongo connection Error:\n ${err.message}`);
});

// Import Agenda Jobs
require('./lib/jobs');

// Import Models
require('./models/Character');

// Start our app!
const app = require('./app');
app.set('port', process.env.PORT || 3003);
const server = app.listen(app.get('port'), () => {
  console.log(`Server Up! localhost:${server.address().port}`);
});
