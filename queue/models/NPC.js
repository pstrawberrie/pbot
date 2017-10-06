const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const monsterSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required!'
  },
  location: {
    type: String,
    trim: true
  },
  quests: Array,
  items: Array,
  created_at: Date,
  updated_at: Date
});

// Presave
monsterSchema.pre('save', function(next) {

  // Dates
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) this.created_at = currentDate;

  // More pre-save funcs

  next();

});

monsterSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('Monster', monsterSchema);
