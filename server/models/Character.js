var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var characterSchema = new Schema({
  name: String,
  location: String,
  stats: {
    hp: Number,
    ap: Number,
    mp: Number,
    def: Number,
    atk: Number
  },
  skills: [String],
  items: [String],
  created_at: Date,
  updated_at: Date,
  xp: Number
});

// Presave
characterSchema.pre('save', function(next) {

  // Dates
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) this.created_at = currentDate;

  // XP Calcs
  //@TODO: no clue what im doing xD
  var xpTable = {
    hp: [100, 250, 699, 1000, 3000, 5000],
    ap: [200, 450, 699, 1500, 3500, 5500],
    mp: [500, 1500, 3500, 7800, 12000],
    def: [500, 1500, 3500, 7800, 12000],
    atk: [500, 1500, 3500, 7800, 12000]
  }

  next();
});

var Character = mongoose.model('Character', characterSchema);

module.exports = Character;
