var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const secret = require('../_config/secret.js');

mongoose.connect(secret.dbString);
