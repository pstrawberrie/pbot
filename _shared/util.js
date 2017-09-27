// Return if a message contains a valid command
exports.validMessage = (message) => {
  if(message != '' && message.substr(0,1) === '!' && message.split(' ').length <= 3)
  return true;
}

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
