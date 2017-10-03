const request = require('request');

module.exports = (action, updateObj) => {
  if(!action) {
    console.log('provide an action for the socket send!')
  }
  request({
    uri: 'http://localhost:3002/status',
    method: 'POST'
  }, function(error, response, body) {
    if(error) {console.log(error);return;}
    if(!error) {
      let status = JSON.parse(body);
      if(status.alive != 1) return;
    }
  });

  let requestJson = {
    action,
    character:updateObj.character
  }
  if(updateObj.enemy) { requestJson.enemy = updateObj.enemy }
  if(updateObj.monster) { requestJson.monster = updateObj.monster }
  if(updateObj.location) { requestJson.location = updateObj.location }
  if(updateObj.target) { requestJson.target = updateObj.target }

  const requestOpts = {
    uri: 'http://localhost:3002/socket',
    method: 'POST',
    json: requestJson
  };

  request(requestOpts, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(`send character socket for ${updateObj.character.name}`)
    }
    if (error) {
      console.log(`error sending socket character\n${error}`)
    }
  });

}
