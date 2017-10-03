//++ Duplication some utility functions here until i figure this out..
const prettyLocation = function(location) {
  let arr = location.split('_').join(' ');
  return arr.toLowerCase().replace(/^\w|\s\w/g, function (letter) {
    return letter.toUpperCase();
  })
}

/* ----------------------
  + OBS STUDIO HOOKS +
---------------------- */
$(document).ready(function() {

  //@FUNCTION: Update Character Text Stats
  function updateCharacterTextStats(character) {
    for(let stat of Object.keys(character.stats)) {
      // let queryString = '[data-text-' + stat + ']';
      // $(queryString).each(function() {
      //   $(this).text(character.stats[stat])
      // })
      $('[data-text-' + stat + ']').text(character.stats[stat])
    }
    $('[data-text-deaths]').text(character.totalDeaths);
    $('[data-text-character-kills]').text(character.totalCharacterKills);
    $('[data-text-monster-kills]').text(character.totalMonsterKills);
    $('[data-text-revives]').text(character.TotalTimesRevived);
  }

  //@FUNCTION: Update Health Bar
  function updateHealthBar(character) {

  }

  //@FUNCTION: Update Location
  function updateLocation(character) {
    $('[data-character-location]').text(prettyLocation(character.location));
  }

  //@FUNCTION: Fire Heal Animation

  //@FUNCTION: Fire Death Animation

  // Get 'passed' event from socket
  var socket = io();
  socket.on('passed', function(info) {
    console.log(info)

    //Log new calcs

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

    //on character vs character (character attacks character)
    if(info.action === 'characterVsCharacter') {

    }

    //on character vs monster (character attacks monster)
    if(info.action === 'characterVsMonster') {

    }

    //on character item pickup
    if(info.action === 'characterItemPickup') {

    }

    //on character death
    if(info.action === 'characterDied') {

    }

  });

})
