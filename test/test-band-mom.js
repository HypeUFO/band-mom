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


/////////////////////////////////
  describe('POST endpoint', function() {
    it('should add a new event', function() {

      const newEvent = generateEventData();

      return chai.request(app)
        .post('/api/event')
        .send(newEvent)
        .then(function(res) {
          res.should.have.status(201);
          //res.should.be.json;
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

});