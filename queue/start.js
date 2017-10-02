const secret = require('../_config/secret');
const util = require('../_shared/util');
const chalk = require('chalk');
const mongoose = require('mongoose');
const Agenda = require('agenda');

// DB Connect
mongoose.connect(secret.dbString, {useMongoClient: true});
mongoose.Promise = global.Promise;
mongoose.connection.once('open', () => {
  console.log(
    chalk.cyan('+++ queue is connected to mongodb +++')
  )
});
mongoose.connection.on('error', (err) => {
  console.error(`Mongo connection Error:\n ${err.message}`);
});

// Models
require('./models/Character');
require('./models/Monster');
require('./models/Location');

// Populate a new DB?
const populate = 0;
function firePopulate() {
  const locations = require('./data/locations.json');
  const Location = mongoose.model('Location');
  const monsters = require('./data/monsters.json');
  const Monster = mongoose.model('Monster');
  const Character = mongoose.model('Character');

  //+ DB Populate (async/await)

  //1. Remove all locations
  function removeAllLocations() {
    return Location.remove({})
    .then((result) => {
      return result
    }).catch((err) => {
      return err
    })
  }

  //2. Create locations obj to import (incl. monsters + characters)
  function createLocationObj() {
    let newLocations = [];
    return new Promise((resolve, reject) => {
      for(let location of locations) {
        newLocations.push({name:location, monsters:[]})
      }
      for(let monster of monsters) {
        let monstername = monster.name;
        let monsterlocation = monster.location
        for(let i of newLocations) {
          if(i.name === monsterlocation) {
            i.monsters.push(monstername)
          }
        }
        if(monsters.indexOf(monster) === monsters.length - 1) {
          return resolve(newLocations);
        }
      }
    })
  }

  //2.5 Make Characters object to populate (again) to locations
  function addCharacters(newLocations) {
    return new Promise((resolve, reject) => {
      Character.find({})
      .then((result) => {
        if(result == null) {
          return resolve(newLocations);
        }
        let characterLocations = {};
        for(let location of locations) {
          if(!characterLocations[location]) {
            characterLocations[location] = []
          }
        }
        for(let character of result) {
          characterLocations[character.location].push(character.name);
        }
        for(let dbObj of newLocations) {
          let arrIndex = newLocations.indexOf(dbObj);
          newLocations[arrIndex].characters = [...characterLocations[dbObj.name]]
        }
        return resolve(newLocations);
      }).catch((err) => {
        console.log(err);
      })
    })
  }

  //3. Populate new locations
  function populateLocations(newLocations) {
    return Location.create(newLocations)
    .then((result) => { console.log(chalk.gray('++ Populated New Locations ++')); return result })
    .catch((err) => { console.log('Error populating DB\n' + err); return err })
  }

  //4. Remove all monsters
  function removeAllMonsters() {
    return Monster.remove({})
    .then((result) => {
      return result
    }).catch((err) => {
      return err
    })
  }

  //5. Populate monsters (straight import from json obj)
  function populateMonsters() {
    return Monster.create(monsters)
    .then((result) => { console.log(chalk.gray('++ Populated New Monsters ++')); return result })
    .catch((err) => { console.log(err); return err })
  }

  //6. Run Populate
  async function runPopulate() {
    try {
      await removeAllLocations();
      const firstLocationObj = await createLocationObj();
      const lastLocationObj = await addCharacters(firstLocationObj);
      await populateLocations(lastLocationObj);
      await removeAllMonsters();
      await populateMonsters();
      console.log(chalk.cyan(`+++ DB Population Finished +++`))
    } catch(err) {
      console.log(chalk.red('xxx Error Populating DB xxx'));
      console.log(err);
    }
  }

  runPopulate();
}
if(populate === 1) firePopulate();

// Run any tests?
const tests = 0;
if(tests === 1) {
  console.log(chalk.magenta('+++ Tests +++'));
}

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const messageEntry = require('./jobs/messageEntry');

// Agenda Setup
const agenda = new Agenda({db:{address:secret.dbString}});
 //+ define agenda entry job
agenda.define('messageEntry', function(job, done) {
  messageEntry(job.attrs.data);
  done();
});
//+ define agenda world event jobs
const healingWave = require('./jobs/world/healingWave');
agenda.define('healingWave', function(job, done) {
  healingWave();
  done();
});
const announcePopulate = require('./jobs/world/announcePopulate');
agenda.define('resetWorld', function(job, done) {
  firePopulate();
  announcePopulate();
  done();
});
//+ agenda event listeners (start jobs here)
agenda.on('ready', function() {
  console.log(chalk.cyan('+++ queue agenda is connected to mongodb +++'));
  agenda.cancel({}, (err, jobs) => {
    console.log(chalk.red('xxx agenda jobs wiped (testing only) xxx'));
  });
  agenda.every('10 minutes', 'resetWorld');
  setTimeout(() => {
    return agenda.every('5 minutes', 'healingWave');
  },5000)
  //+ start queue
  agenda.start();
});
agenda.on('error', function(err) { //log any errors connecting to agenda db
  console.log('queue failed to connect to agenda!!');
  console.log(err);
});
agenda.on('fail', function(err, job) { //log failed agenda jobs
  console.log('Agenda job "' + job.attrs.name + '" failed!');
  console.log('Error String: ' + err);
});
agenda.on('complete', function(job) { //clear completed message entries
  if(job.attrs.name === 'messageEntry')
  job.remove();
});
function graceful() {
  agenda.stop(function() { process.exit(0); });
}
process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

// HTTP Setup
const app = express();
app.use(bodyParser.json());
app.post('/queue', function (req, res) {
  if(req.body && req.body.name && req.body.message && util.validMessage(req.body.message)) {
    agenda.now('messageEntry', req.body);
    res.end();
  } else {
    console.log('invalid queue request - ignoring');
    console.log(req.body);
    res.end();
  }
});
app.listen(3000, function () {
  console.log(
    chalk.cyan('+++ queue listening (http://localhost:3000) +++')
  )
});
