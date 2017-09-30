const mongoose = require('mongoose');
const Character = mongoose.model('Character');

module.exports = (username) => {
  return new Promise((resolve, reject) => {
    function resolver(resolution) {resolve(resolution)}
    function rejector(rejection) {reject(rejection)}

    // Check DB for character
    Character.findOne({name:username}).then(result => {
      console.log('Finding character: ' + username);//remove
      if(result && result.name === username) {
        console.log('Got Character ' + username + ':');
        console.log(result);
        resolver(result);
      }
      if(result == null) {
        console.log('Character ' + username + ' does not exist');
        resolver(null);
      }
    })
    .catch(err => {
      console.log('Error finding character: ' + username)
      console.log(err)
      rejector(err);
    })

})
}
