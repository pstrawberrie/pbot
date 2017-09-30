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
    trim: true,
    default: "dangerous_field"
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
      default: 1
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
  items: {
    type: Array,
    default: ['basic_clothes']
  },
  xp: {
    type:Number,
    default: 1
  },
  dead: {
    type: Number,
    default: 0
  },
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
