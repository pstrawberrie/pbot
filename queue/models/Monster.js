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
  stats: {
    hp: {
      type: Number,
      default: 5
    },
    ap: {
      type: Number,
      default: 1
    },
    mp: {
      type: Number,
      default: 1
    },
    def: {
      type: Number,
      default: 0
    },
    atk: {
      type: Number,
      default: 1
    }
  },
  skills: {
    type: Array,
    default: ['attack']
  },
  drops: Array,
  dead: {
    type: Number,
    default: 0
  },
  last_move: Date,
  last_attack: Date,
  last_target: String,
  totalDeaths: Number,
  totalTimesRevived: Number,
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
