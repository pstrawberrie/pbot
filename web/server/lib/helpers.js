// Use moment in pug
exports.moment = require('moment');

// Dump json out to pug
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Join Array with commas
exports.arrCommaJoin = (arr) => {
  return arr.join(', ');
}

// Get Stats String from Character obj
exports.statsString = (characterObj) => {
  const string = characterObj.hp + 'HP / ' +
  characterObj.ap + 'AP / ' +
  characterObj.mp + 'MP / ' +
  characterObj.atk + 'ATK / ' +
  characterObj.def + 'DEF';
  return string;
}
