const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
var fs = require('fs');
const request = require('supertest-as-promised');
var date = require('date-and-time');


const should = chai.should();

const {Event} = require('../models/event-model');
const {StagePlot} = require('../models/stage-plot-model');
const {User} = require('../models/user-model');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

const agent = chai.request.agent(app)

// TEST USER

const TEST_USER = {
  "userName": "testUser",
  "email": "testuser@test.com",
  "password": "testPassword",
  "passwordConfirm": "testPassword"
}

let _user;

// Seed events Collection

function seedEventData(user) {
  
  console.info('seeding event data');
  const seedData = [];

  for (let i = 1; i <= 5; i++) {
    seedData.push(generateEventData(user));
  }
  return Event.insertMany(seedData);
}

function generateVenueName() {
  const venues = [
    'Loaded', 'The Viper Room', 'The Whiskey', 'Lot 1', 'Five Star Bar'
  ];
  return venues[Math.floor(Math.random() * venues.length)];
}

function generateManifest() {
  const manifest = {
    quarterInchCables: faker.random.number(),
    xlrCables: faker.random.number(),
    strings: faker.random.number(),
    dIs: faker.random.number()
  };
  return manifest;
};

function generateStartTime() {
  return Math.floor((Math.random() * 12) + 1) + ":00pm";
};

function generateSoundcheckTime() {
  return Math.floor((Math.random() * 12)) + ":00pm";
};

// generate fake Event

function generateEventData(user) {
  return {
    eventDate: date.format(faker.date.future(), 'M/D/YY'),
    venueName: generateVenueName(),
    venueAddress: faker.address.streetAddress(),
    startTime: generateStartTime(),
    soundCheckTime: generateSoundcheckTime(),
    manifest: generateManifest(),
    notes: faker.lorem.sentence(),
    dateCreated: new Date(),
    dateModified: new Date(),
    userId: user.userId
      //userId: "58a3d943a1ddb1203c7780a7"
  };
};

// Seed stageplots Collection

function seedPlotData() {

  console.info('seeding stage-plot data');
  // const seedData = [];
  const testImage = {
    img: 'stage-plot.jpg',
    //dateCreated: new Date,
    //dateModified: new Date,
    userId: this.id
  }

  // for (let i = 1; i <= 2; i++) {
  //     seedData.push(generateEventData());
  // }
  //return StagePlot.insertMany(testImage);
  return agent
    .post('/api/stage-plot')
    .send(testImage)
}

// TEAR DOWN DB
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
};


//describe(' TEST BandMom App', function(){

// API Event Endpoint Tests



before(function () {
  return runServer(TEST_DATABASE_URL)
});


beforeEach(function () {
  //let _user;
  return chai.request(app)
    .post('/api/user')
    .send(TEST_USER)
    .then(function (res) {
      _user = res.body;
      return agent
        .post('/api/login')
        .send({
          username: "testUser",
          password: "testPassword"
        })
    })
    .then(function () {
      return seedEventData(_user);
    })
});

afterEach(function () {
  return tearDownDb()
});

after(function () {

  return closeServer();

});


// TEST ENDPOINT SECURITY

describe('ENDPOINT SECURITY', function () {


  describe('index page', function () {
    it('should load', function () {
      return agent
        .get('/')
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.html;
        });
    });
  });


  describe('dashboard page', function () {
    it('should load', function () {
      let res;
      return agent
        .get('/dashboard')
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.html;
        })
        .catch(err => console.log('error on dashboard page', err))
    })
  });

  describe('dashboard page', function () {
    it('should redirect to login when unauthorized', function () {
      return agent
        .get('/api/logout')
        .then(function () {
          return chai.request(app)
            .post('/api/login')
            .send({
              username: "testUser",
              password: "incorrectPassword"
            })

        })
        .then(function (res) {
          res.should.have.status(401);
          res.should.be.html;
        })
        .catch(err => console.log(err));
    });
  });
})


////////////////////////////////////////////////////////////
describe(' TEST Events API Endpoint', function () {



  describe('GET endpoint', function () {

    it('should return all existing events', function () {
      let res;
      return agent
        .get('/api/event')
        .then(function (_res) {
          res = _res;
          res.should.have.status(200);
          res.body.events.should.have.length.of.at.least(1);
          return Event.count();
        })
        .catch(err => console.log('error get /api/event', err))
        .then(function (count) {
          res.body.events.should.have.length.of(count);
        })
        .catch(err => console.log('error on test 1'));
    });



    it('should return events with right fields', function () {
      let resEvent;
      return agent
        .get('/api/event')
        .then(function (res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.events.should.be.a('array');
          res.body.events.should.have.length.of.at.least(1);

          res.body.events.forEach(function (event) {
            event.should.be.a('object');
            event.should.include.keys(
              'eventDate', 'venueName', 'venueAddress', 'startTime', 'soundCheckTime', 'manifest', 'notes');
          });
          resEvent = res.body.events[0];
          return Event.findById(resEvent.id);
        })
        .then(function (event) {
          resEvent.eventDate.should.equal(event.eventDate.toISOString());
          resEvent.venueName.should.equal(event.venueName);
          resEvent.venueAddress.should.equal(event.venueAddress);
          resEvent.startTime.should.equal(event.startTime);
          resEvent.soundCheckTime.should.equal(event.soundCheckTime);
          resEvent.manifest.should.deep.equal(event.manifest);
          resEvent.notes.should.equal(event.notes);
        })
        .catch(err => console.log('error on test 2'));
    });
  });

  ////////////////////////////////////////////////////////////

  describe('POST endpoint', function () {
    it('should add a new event', function () {

      const newEvent = generateEventData(_user);
      //Event
      return agent
        .post('/api/event')
        .send(newEvent)
        .then(function (res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
            'eventDate', 'venueName', 'venueAddress', 'startTime', 'soundCheckTime', 'manifest', 'notes');
          res.body.eventDate.should.equal(newEvent.eventDate);
          res.body.venueName.should.equal(newEvent.venueName);
          res.body.venueAddress.should.equal(newEvent.venueAddress);
          res.body.startTime.should.equal(newEvent.startTime);
          res.body.soundCheckTime.should.equal(newEvent.soundCheckTime);
          res.body.manifest.should.deep.equal(newEvent.manifest);
          res.body.notes.should.equal(newEvent.notes);
          return Event.findById(res.body.id);
        })
        .then(function (event) {
          event.venueName.should.equal(newEvent.venueName);
          event.venueAddress.should.equal(newEvent.venueAddress);
          event.startTime.should.equal(newEvent.startTime);
          event.soundCheckTime.should.equal(newEvent.soundCheckTime);
          event.manifest.should.deep.equal(newEvent.manifest);
          event.notes.should.equal(newEvent.notes);
          event.dateCreated.toString().should.equal(newEvent.dateCreated.toString());
          event.dateModified.toString().should.equal(newEvent.dateModified.toString());
          event.userId.should.equal(newEvent.userId);
        })
        .catch(err => console.log(err));
    });
  });

  ////////////////////////////////////////////////////////////

  describe('PUT endpoint', function () {

    it('should update requested fields', function () {
      const updateData = {
        startTime: '10:00pm',
        soundCheckTime: '8:00pm'
      };
      return agent
      Event
        .findOne()
        .exec()
        .then(function (event) {
          updateData.id = event.id;
          return chai.request(app)
            .put(`/api/event/${event.id}`)
            .send(updateData);
        })
        .then(function (res) {
          res.should.have.status(204);

          return Event.findById(updateData.id).exec();
        })
        .then(function (event) {
          event.startTime.should.equal(updateData.startTime);
          event.soundCheckTime.should.equal(updateData.soundCheckTime);
        })
        .catch(err => console.log(err));
    });
  });


  ////////////////////////////////////////////////////////////

  describe('DELETE endpoint', function () {
    it('should delete an event by id', function () {
      let event;
      return agent
      Event
        .findOne()
        .exec()
        .then(function (_event) {
          event = _event;
          return chai.request(app).delete(`/api/event/${event.id}`);
        })
        .then(function (res) {
          res.should.have.status(204);
          return Event.findById(event.id).exec();
        })
        .then(function (_event) {
          should.not.exist(_event);
        })
        .catch(err => console.log(err));
    })
  });
});
