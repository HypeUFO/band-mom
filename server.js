'use strict'
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require('fs');

mongoose.Promise = global.Promise;


const {PORT, DATABASE_URL} = require('./config');
const {Event} = require('./models/event-model');
const {StagePlot} = require('./models/stage-plot-model');
const {User} = require('./models/user-model');

const app = express();
app.use(express.static('public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


// logging
app.use(morgan('common'));


// serve html

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});


// GET Event

app.get('/api/event', (req, res) => {
  Event
    .find()
    .exec()
    .then(events => {
      res.json({
        events: events.map(
          (event) => event.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

app.get('/api/event/:id', (req, res) => {
  Event
    .findById(req.params.id)
    .exec()
    .then(event =>res.json(event.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

// CREATE Event

app.post('/api/event', (req, res) => {
    Event
    .create({
      eventDate: req.body.eventDate,
      venueName: req.body.venueName,
      venueAddress: req.body.venueAddress,
      startTime: req.body.startTime,
      soundCheckTime: req.body.soundCheckTime,
      manifest: req.body.manifest,
      notes: req.body.notes,
      dateCreated: req.body.dateCreated,
      dateModified: req.body.dateModified,
      userId: req.body.userId
    })
    .then(
      event => res.status(201).json(event.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});


// UPDATE Event

app.put('/api/event/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  const toUpdate = {dateModified: new Date};
  const updateableFields = ['eventDate', 'venueName', 'venueAddress', 'startTime', 'soundCheckTime', 'manifest', 'notes'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Event
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .exec()
    .then(event => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

// DELETE EVENT

app.delete('/api/event/:id', (req, res) => {
  Event
  .findByIdAndRemove(req.params.id)
  .exec()
  .then(event => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server error'}));
})

///////////////////////////////////////////////////

// GET STAGE PLOT

app.get('/api/stage-plot', (req, res) => {
  StagePlot
    .find()
    .exec()
    .then(stageplots => {
      res.json({
        stageplots: stageplots.map(
          (stageplot) => stageplot.apiRepr())
      });
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

app.get('/api/stage-plot/:id', (req, res) => {
  StagePlot
    .findById(req.params.id)
    .exec()
    .then(stageplot =>res.json(stageplot.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

// CREATE STAGE PLOT

app.post('/api/stage-plot', (req, res) => {
    StagePlot
    .create({
      img: req.body.img,
      dateCreated: req.body.dateCreated,
      dateModified: req.body.dateModified,
      userId: req.body.userId
    })
    .then(
      stageplot => res.status(201).json(stageplot.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});



// USERS

  // Sign Up/Create User

app.post('/api/user', (req, res) => {
  const encryption = User.hashPassword(req.body.password);
  User
    .create({
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      hashedPassword: encryption.hash,
      salt: encryption.salt
    })
    .then(user => res.status(200).json(user.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        message: 'something went wrong',
        error: err
      });
    });
});

  // User Login

app.post('/api/login', (req, res) => {
  User
    .findOne({
      email: req.body.email
    })
    .then(user =>  user.validatePassword(req.body.password))
    .then(isValid => {
      isValid ? res.sendStatus(200) : res.sendStatus(400);
    })
    .catch(err => {
      res.status(401).json({
        message: 'login failed'
      });
    });
});



///////////////////////////////////////////////////

app.use('*', function(req, res) {
  return res.status(404).json({message: 'Not Found'});
});


//////////////////////

let server;


function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}


function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}


if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};


