//++ Duplication some utility functions here until i figure this out..
const prettyLocation = function(location) {
  //@TODO:new character throws error
  let arr = location.split('_').join(' ');
  return arr.toLowerCase().replace(/^\w|\s\w/g, function (letter) {
    return letter.toUpperCase();
  })
}

const calcStatsFromItems = function(itemsObj, characterItems) {
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

const animHealthBar = function(items, character) {
  const maxHp = calcStatsFromItems(items, character.items).hp;
  const currentHp = character.stats.hp;
  const currentPercentage = Math.floor((currentHp / maxHp)*100);
  if(currentHp === 0) {
    $('.healthColor').css('width', 0);
  } else {
    $('.healthColor').css('width', currentPercentage + '%');
  }
  if(currentPercentage <= 25) {
    $('.healthColor').removeClass('hp-yellow').addClass('hp-red');
  } else if(currentPercentage < 51) {
    $('.healthColor').removeClass('hp-red').addClass('hp-yellow');
  } else {
    $('.healthColor').removeClass('hp-yellow hp-red');
  }
  $('[data-text-hp-max]').text(calcStatsFromItems(items, character.items).hp);
  $('[data-text-hp-current]').text(character.stats.hp);
}

const newNotification = function(type, text) {
  $('.notify').html(text);
  $('.notify').addClass('fadeInUp');
  setTimeout(function() {
    $('.notify').removeClass('fadeInUp');
    $('.notify').html('');
  },2600);
}

/* ----------------------
  + OBS STUDIO HOOKS +
---------------------- */
$(document).ready(function() {

  //..we can actually just pass these in from the pug render somehow...
  //...but this works for now...
  let items, monsters, skills, locations;
  $.get("http://localhost:3000/items",function(data){items = data;});
  $.get("http://localhost:3000/monsters",function(data){monsters = data;});
  $.get("http://localhost:3000/skills",function(data){skills = data;});
  $.get("http://localhost:3000/locations",function(data){locations = data;});

  //@FUNCTION: Update Character Text Stats
  function updateCharacterTextStats(character) {
    for(let stat of Object.keys(character.stats)) {
      if(character.stats[stat] != parseInt($('[data-text-' + stat + ']').text())) {
        $('[data-text-' + stat + ']').text(character.stats[stat]);
        $('[data-stats-animate="' + stat + '"]').addClass('jello quickBlue');
        setTimeout(function() {
          $('[data-stats-animate="' + stat + '"]').removeClass('jello quickBlue')
        },500);
      }
    }
    $('[data-text-deaths]').text(character.totalDeaths);
    $('[data-text-character-kills]').text(character.totalCharacterKills);
    $('[data-text-monster-kills]').text(character.totalMonsterKills);
    $('[data-text-revives]').text(character.TotalTimesRevived);
  }

  //@FUNCTION: Update Health Bar
  function updateHealthBar(character) {
    animHealthBar(items, character);
  }

  //@FUNCTION: Update Location
  function updateLocation(character) {
    let currentLocation = $('[data-character-location]').text().toLowerCase().replace(' ', '_');
    if(character.location === currentLocation) return;
    $('[data-character-location]').text(prettyLocation(character.location));
    $('[data-character-location]').addClass('lightSpeedIn');
    setTimeout(function() {
      $('[data-character-location]').removeClass('lightSpeedIn');
    },900)
  }

  //@FUNCTION: Fire Heal Animation

  //@FUNCTION: Fire Death Animation

  // Get 'passed' event from socket
  var socket = io();
  socket.on('passed', function(info) {
    console.log(info)
    if(info.character.name != 'pstrawberrie') return;


    /* ++ RUN DEFAULT FUNCTIONS ++ */
    if(info.action != 'characterDied') {
      updateCharacterTextStats(info.character);
      updateHealthBar(info.character);
      updateLocation(info.character);
    }

    /* ++ RUN TRIGGERED FUNCTIONS ++ */
    //on character move
    if(info.action === 'move') {

    }

    //on character heal
    if(info.action.includes('Heal')) {
      newNotification('heal',
      '<span class="ra ra-feather-wing"></span>' +
      '<span class="text">Healed!</span>'
      );
      $('.healthColor').addClass('flash');
      setTimeout(function() {
        $('.healthColor').removeClass('flash');
      },900);
    }

    //on character vs character (character attacks character)
    if(info.action === 'characterVsCharacter') {

    }

    //on character vs monster (character attacks monster)
    if(info.action === 'characterVsMonster') {
      $('.healthColor').addClass('shake');
      setTimeout(function() {
        $('.healthColor').removeClass('shake');
      },900)
    }

    //on character item pickup
    if(info.action === 'characterItemPickup') {

    }

    //on character death
    if(info.action === 'characterDied') {

    }

  });

})
