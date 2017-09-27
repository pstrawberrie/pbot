const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const characterSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required!'
  },
  location: {
    type: String,
    trim: true,
    default: "Town Square"
  },
  stats: {
    hp: {
      type: Number,
      default: 1
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
    default: ['Attack', 'Heal']
  },
  items: {
    type: Array,
    default: ['Basic Clothes']
  },
  xp: {
    type:Number,
    default: 1
  },
  playing: {
    type: Number,
    default: 0
  },
  dead: {
    type: Number,
    default: 0
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

  // More pre-save funcs

  next();

});

characterSchema.plugin(mongodbErrorHandler);
module.exports = mongoose.model('Character', characterSchema);
