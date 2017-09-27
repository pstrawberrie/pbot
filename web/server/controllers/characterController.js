const mongoose = require('mongoose');
const Character = mongoose.model('Character');
const secret = require('../_config/secret');

// Get Bow Owner's Character (Default)
exports.getOwnerCharacter = async (req, res) => {
  const character = await Character.findOne({ name: secret.botOwner });
  if (!character) {
    req.flash('info', `The Bot Owner doesn't have a character! Go make one!`);
    res.render('index', {
      title: 'Bot Owner has no character!'
    });
    return;
  }
  res.render('character', {
    title: character.name,
    character
  });
};

// Get Character By Name
exports.getCharacter = async (req, res) => {
  const character = await Character.findOne({ name: req.params.name });
  if (!character) return next();
  res.render('character', {
    title: character.name,
    character
  });
};

// Get All Characters
exports.getAllCharacters = async (req, res) => {

  const characterPromise = Character.find();
  const countPromise = Character.count();
  const [characters, count] = await Promise.all([characterPromise, countPromise]);

  if (!characters.length) {
    return res.render('index', { title: 'All Characters' });
  }
  res.render('characters', {
    title: 'All Characters',
    characters,
    count
  });

};

// Make New Character
exports.newCharacter = async (req, res) => {

  const checkExisting = await Character.findOne({name:req.body.name});
  if(checkExisting == null) {
    const character = await (new Character({name:req.body.name})).save();
    res.redirect(`/character/${character.name}`);
  }

}
