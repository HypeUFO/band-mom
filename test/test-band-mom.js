const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {Event} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// load html

describe('index page', function () {
    it('should load', function () {
        return chai.request(app)
            .get('/')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.html;
            });
    });
});

describe('dashboard page', function () {
    it('should load', function () {
        return chai.request(app)
            .get('/dashboard')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.html;
            });
    });
});

// API Event Endpoint Setup

function seedEventData() {
    console.info('seeding event data');
    const seedData = [];

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateEventData());
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
        misc: {
            description: "guitar picks",
            qty: faker.random.number()
        }
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

function generateEventData() {
    return {
        eventDate: faker.date.future(),
        venueName: generateVenueName(),
        venueAddress: faker.address.streetAddress(),
        startTime: generateStartTime(),
        soundCheckTime: generateSoundcheckTime(),
        manifest: generateManifest(),
        notes: faker.lorem.sentence(),
        dateCreated: new Date(),
        dateModified: new Date(),
        userId: faker.random.number()
    };
};

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
};

// API Event Endpoint Tests

describe('Events API Endpoint', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedEventData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });
  /////////////////////////

describe('GET endpoint', function() {

    it('should return all existing events', function() {
      let res;
      return chai.request(app)
        .get('/api/event')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.body.events.should.have.length.of.at.least(1);
          return Event.count();
        })
        .then(function(count) {
          res.body.events.should.have.length.of(count);
        });
    });


    it('should return events with right fields', function() {

      let resEvent;
      return chai.request(app)
        .get('/api/event')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.events.should.be.a('array');
          res.body.events.should.have.length.of.at.least(1);

          res.body.events.forEach(function(event) {
            event.should.be.a('object');
            event.should.include.keys(
              'eventDate', 'venueName', 'venueAddress', 'startTime', 'soundCheckTime', 'manifest', 'notes');
          });
          resEvent = res.body.events[0];
          return Event.findById(resEvent.id);
        })
        .then(function(event) {
          resEvent.eventDate.should.equal(event.eventDate.toISOString());
          resEvent.venueName.should.equal(event.venueName);
          resEvent.venueAddress.should.equal(event.venueAddress);
          resEvent.startTime.should.equal(event.startTime);
          resEvent.soundCheckTime.should.equal(event.soundCheckTime);
          //resEvent.manifest.should.contain(event.manifest);
          resEvent.notes.should.equal(event.notes);
        });
    });
  });

/////////////////////////////////
  describe('POST endpoint', function() {
    it('should add a new event', function() {

      const newEvent = generateEventData();

      return chai.request(app)
        .post('/api/event')
        .send(newEvent)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(
              'eventDate', 'venueName', 'venueAddress', 'startTime', 'soundCheckTime', 'manifest', 'notes');
          res.body.eventDate.should.equal(newEvent.eventDate.toISOString());
          res.body.venueName.should.equal(newEvent.venueName);
          res.body.venueAddress.should.equal(newEvent.venueAddress);
          res.body.startTime.should.equal(newEvent.startTime);
          res.body.soundCheckTime.should.equal(newEvent.soundCheckTime);
          //res.body.manifest.should.equal(newEvent.manifest);
          res.body.notes.should.equal(newEvent.notes);
          return Event.findById(res.body.id);
        })
        .then(function(event) {
          event.venueName.should.equal(newEvent.venueName);
          event.venueAddress.should.equal(newEvent.venueAddress);
          event.startTime.should.equal(newEvent.startTime);
          event.soundCheckTime.should.equal(newEvent.soundCheckTime);
          //event.manifest.should.equal(newEvent.manifest);
          event.notes.should.equal(newEvent.notes);
          //event.dateCreated.should.equal(newEvent.dateCreated);
          //event.dateModified.should.equal(newEvent.dateModified);
          //event.userId.should.equal(newEvent.userId);
        });
    });
  });


  describe('PUT endpoint', function() {

    it('should update requested fields', function() {
      const updateData = {
        startTime: '10:00pm',
        soundCheckTime: '8:00pm'
      };

      return Event
        .findOne()
        .exec()
        .then(function(event) {
          updateData.id = event.id;
          return chai.request(app)
            .put(`/api/event/${event.id}`)
            .send(updateData);
        })
        .then(function(res) {
          res.should.have.status(204);

          return Event.findById(updateData.id).exec();
        })
        .then(function(event) {
          event.startTime.should.equal(updateData.startTime);
          event.soundCheckTime.should.equal(updateData.soundCheckTime);
        });
      });
  });

  describe('DELETE endpoint', function(){
      it('should delete an event by id', function(){
          let event;
          return Event
          .findOne()
          .exec()
          .then(function(_event) {
              event = _event;
              return chai.request(app).delete(`/api/event/${event.id}`);
          })
          .then(function(res) {
              res.should.have.status(204);
              return Event.findById(event.id).exec();
          })
          .then(function(_event) {
              should.not.exist(_event);
          })
      })
  })

});