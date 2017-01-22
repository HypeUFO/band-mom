//'use strict'
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');


mongoose.Promise = global.Promise;


const {PORT, DATABASE_URL} = require('./config');
const {Event} = require('./models');

const app = express();
app.use(express.static('public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


// logging
app.use(morgan('common'));


//app.use('*', function(req, res) {
  //return res.status(404).json({message: 'Not Found'});
//});


// serve html

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});


// GET Event



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


