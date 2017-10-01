const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Locations must have a name!'
  },
  characters: {
    type: Array,
    default: []
  },
  items: {
    type: Array,
    default: []
  },
  monsters: {
    type: Array,
    default: []
  },
  powerups: {
    type: Array,
    default: []
  },
  updated_at: Date
});

// Presave
locationSchema.pre('save', function(next) {

  // Dates
  var currentDate = new Date();
  this.updated_at = currentDate;

  next();

});

locationSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('Location', locationSchema);
