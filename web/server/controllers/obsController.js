const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const socket = require('socket.io-client')('http://localhost:3002');

// Get
exports.getSomething= async (req, res) => {
  console.log(`Body: ${req.body}`);
  const character = await Character.find({name:'pstrawberrie'});
  socket.emit('character', character[0]);
  res.render('obs', {
    title: 'pbot RPG',
    character: character[0]
  })
};

// Post
exports.postSomething= async (req, res) => {
  console.log(`Body: ${req.body}`);
  const character = await Character.find({name:'pstrawberrie'});
  socket.emit('character', character[0]);
  res.json({maybe:'someday', thingswill:'work'})
};
