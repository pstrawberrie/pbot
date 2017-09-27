const request = require('request');

module.exports = (message) => {

  const requestOptions = {
    uri: 'http://localhost:3001/action',
    method: 'POST',
    json: {
      message
    }
  }
  request(requestOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('message post success');
    } else {
      console.log('error: ' + error);
      console.log('response: ' + response);
    }
  });

}
