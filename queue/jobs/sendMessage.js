const request = require('request');

module.exports = (type, user, message) => {

  // Determine type of message to send (default is "say")
  let uri = 'http://localhost:4001/say';
  let jsonMsg = { message };
  if(type === 'whisper' && user != null) {
    uri = 'http://localhost:4001/whisper';
    jsonMsg.user = user;
  }
  if(type === 'action') { uri = 'http://localhost:4001/action' }

  // Set up request options
  const requestOptions = {
    uri,
    method: 'POST',
    json: jsonMsg
  }

  // Push the message along to the IRC http server
  request(requestOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('message post success');
    } else {
      console.log('error: ' + error);
      console.log('response: ' + response);
    }
  });

}
