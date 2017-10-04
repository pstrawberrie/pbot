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
exports.statsString = (statsObj, variant) => {
  if(!variant) {
    const string = '' +
    (statsObj.hp || 0) + 'HP / ' +
    (statsObj.ap || 0) + 'AP / ' +
    (statsObj.mp || 0) + 'MP / ' +
    (statsObj.atk || 0) + 'ATK / ' +
    (statsObj.def || 0) + 'DEF';
    return string;
  }
  if(variant === 'item') {
    const string = '+' +
    (statsObj.hp || 0) + 'HP, +' +
    (statsObj.ap || 0) + 'AP, +' +
    (statsObj.mp || 0) + 'MP, +' +
    (statsObj.atk || 0) + 'ATK, +' +
    (statsObj.def || 0) + 'DEF';
    return string;
  }

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

// Calc Stats From Items
exports.calcStatsFromItems = (itemsObj, characterItems) => {
  let statsObj = {};
  for(let item of characterItems) {
    statsObj.hp = (statsObj.hp || 0) + (itemsObj[item].hp || 0);
    statsObj.ap = (statsObj.ap || 0) + (itemsObj[item].ap || 0);
    statsObj.mp = (statsObj.mp || 0) + (itemsObj[item].mp || 0);
    statsObj.atk = (statsObj.atk || 0) + (itemsObj[item].atk || 0);
    statsObj.def = (statsObj.def || 0) + (itemsObj[item].def || 0);
  }
  return statsObj;
}

exports.getHealthPercent = (items, character) => {
  const maxHp = exports.calcStatsFromItems(items, character.items).hp;
  const currentHp = character.stats.hp;
  const currentPercentage = Math.floor((currentHp / maxHp)*100);
  return currentPercentage;
}

exports.getHealthColorClass = (items, character) => {
  const currentPercentage = exports.getHealthPercent(items,character);
  if(currentPercentage <= 25) {
    return 'hp-red';
  } else if(currentPercentage < 51) {
    return 'hp-yellow';
  } else {
    return '';
  }
}

// Turn negative number to 0
exports.negativeToZero = number => {
  if(number < 0) {
    return 0
  } else {
    return Math.floor(number);
  }
}

// Turn negative number to 1
exports.negativeToOne = number => {
  if(Math.floor(number) < 1) {
    return 1
  } else {
    return Math.ceil(number);
  }
}
