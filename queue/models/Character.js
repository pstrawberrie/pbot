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
    trim: true,
    default: 'death_pit'
  },
  stats: {
    hp: {
      type: Number,
      default: 0
    },
    ap: {
      type: Number,
      default: 0
    },
    mp: {
      type: Number,
      default: 0
    },
    def: {
      type: Number,
      default: 0
    },
    atk: {
      type: Number,
      default: 0
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
  currentQuests: Array,
  completedQuests: Array,
  last_move: Date,
  last_attack: Date,
  last_target: String,
  totalMonsterKills: {
    type: Number,
    default:0
  },
  totalCharacterKills: {
    type: Number,
    default:0
  },
  totalDeaths: {
    type: Number,
    default:0
  },
  totalTimesRevived: {
    type: Number,
    default:0
  },
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
