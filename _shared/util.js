// Return if a message contains a valid command
exports.validMessage = (message) => {
  if(message != '' && message.substr(0,1) === '!' && message.split(' ').length <= 3)
  return true;
}

// Join Array with commas
exports.arrCommaJoin = (arr) => {
  return arr.join(', ');
}

// Make understore locations pretty
exports.prettyLocation = (location) => {
  let arr = location.split('_').join(' ');
  return arr.toLowerCase().replace(/^\w|\s\w/g, function (letter) {
    return letter.toUpperCase();
  })
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

// Calc Stats From Item
exports.calcStatsFromItem = (directive, currentStats, itemsArr, item) => {
  if(directive === 'add') {
    for(let stat of Object.keys(currentStats)) {
    	currentStats[stat] = currentStats[stat] + itemsArr[item][stat];
    }
    return currentStats;
  }
  if(directive === 'subtract') {
    for(let stat of Object.keys(currentStats)) {
    	currentStats[stat] = currentStats[stat] - itemsArr[item][stat]
    }
    return currentStats;
  }
}
