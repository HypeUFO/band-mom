'use strict'
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');


const app = express();
const {PORT, DATABASE_URL} = require('./config');


app.use(express.static('public'));

//app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


mongoose.Promise = global.Promise;


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

// create event

app.post('/api/event', (req, res) => {
    const newEvent = req.body;
    console.log(newEvent);
})


app.listen(process.env.PORT || 8080);

exports.app = app;

