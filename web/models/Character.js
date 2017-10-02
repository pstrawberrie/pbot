const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const characterSchema = new mongoose.Schema({
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
      default: 10
    },
    ap: {
      type: Number,
      default: 3
    },
    mp: {
      type: Number,
      default: 3
    },
    def: {
      type: Number,
      default: 1
    },
    atk: {
      type: Number,
      default: 2
    }
  },
  skills: {
    type: Array,
    default: ['heal']
  },
  items: {
    type: Array
  },
  xp: {
    type:Number,
    default: 1
  },
  dead: {
    type: Number,
    default: 0
  },
  last_move: Date,
  last_attack: Date,
  last_target: String,
  totalMonsterKills: Number,
  totalCharacterKills: Number,
  totalDeaths: Number,
  totalTimesRevived: Number,
  created_at: Date,
  updated_at: Date
});

// Presave
characterSchema.pre('save', function(next) {

  // Dates
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) this.created_at = currentDate;

  next();

});

characterSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('Character', characterSchema);
