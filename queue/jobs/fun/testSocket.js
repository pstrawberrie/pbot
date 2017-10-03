const request = require('request');
let requestOptions = {
  uri: 'http://localhost:3002/socket',
  method: 'POST'
}

module.exports = (user, arg1) => {

  requestOptions.json = {
    eventName: 'test',
    info: {
      name: user,
      message: arg1
    }
  }

  request(requestOptions, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(`${user} sent socket shit`);
    } else {
      console.log('error: ' + error);
      console.log('response: ' + response);
    }
  });

}
