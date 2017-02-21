'use strict'
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const multer  = require('multer');
const fs = require('fs');

mongoose.Promise = global.Promise;


const {PORT, DATABASE_URL} = require('./config');
const {Event} = require('./models/event-model');
const {StagePlot} = require('./models/stage-plot-model');
const {User} = require('./models/user-model');

const app = express();
app.use(express.static('public'));

app.use(bodyParser.json());


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 resave: true}));
app.use(cookieParser());
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// logging
app.use(morgan('common'));

const localStrategy = new LocalStrategy(function(username, password, callback) {
  let user;
  User
    .findOne({userName: username})
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, {message: 'Incorrect username'});
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, {message: 'Incorrect password'});
      }
      else {
        return callback(null, user)
      }
    });
});

const router = express.Router();
passport.use(localStrategy);
router.use(passport.initialize());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// serve html

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// GET Event

router.get('/api/event', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  Event
    .find({ userId: req.user.id })
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

router.get('/api/event/:id', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }
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

router.post('/api/event', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }
    Event
    .create({
      eventDate: req.body.eventDate,
      venueName: req.body.venueName,
      venueAddress: req.body.venueAddress,
      startTime: req.body.startTime,
      soundCheckTime: req.body.soundCheckTime,
      manifest: { quarterInchCables: req.body.quarterInchCables,
      xlrCables: req.body.xlrCables,
      strings: req.body.strings,
      dIs: req.body.dIs },
      notes: req.body.notes,
      dateCreated: req.body.dateCreated,
      dateModified: req.body.dateModified,
      userId: req.user.id
    })
    .then(
      event => res.status(201).json(event.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});


// UPDATE Event

router.put('/api/event/:id', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }
  const toUpdate = {dateModified: new Date().toISOString()};
  const updateableFields = ['eventDate', 'venueName', 'venueAddress', 'startTime', 'soundCheckTime', 'manifest.quarterInchCables', 'manifest.xlrCables', 'manifest.dIs', 'manifest.strings', 'notes', 'dateModified'];

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

router.delete('/api/event/:id', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  Event
  .findByIdAndRemove(req.params.id)
  .exec()
  .then(event => res.status(204).end())
  .catch(err => res.status(500).json({message: 'Internal server error'}));
})

///////////////////////////////////////////////////

// GET STAGE PLOT

router.get('/api/stage-plot', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  StagePlot
    .find({ userId: req.user._id })
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

router.get('/api/stage-plot/:id', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  StagePlot
    .findById(req.params.id)
    .exec()
    .then(stageplot =>res.json(stageplot.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

router.delete('/api/stage-plot/:id', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: 'Not logged in'
    });
  }
  StagePlot
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(stageplot => {
      fs.unlink('./public/stage-plots/' + req.body.img, (err) => {
        if (err) throw err;
      });
      res.status(204).end()
    })
    .catch(err => res.status(500).json({
      message: 'Internal server error'
    }));
})

// CREATE STAGE PLOT

var storage = multer.diskStorage({
  destination: 'public/stage-plots',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname );
  }
});

var upload = multer({ storage: storage });



router.route('/api/stage-plot')
.all(upload.single('stageplot'))
.post( (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not logged in' });
  }
    StagePlot
    .create({
      img: req.file.filename,
      dateCreated: new Date,
      dateModified: new Date,
      userId: req.user.id
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

router.post('/api/user', (req, res) => {
  if (req.body.password !== req.body.passwordConfirm) {
    res.status(500).json({
      message: 'passwords do not match'
    })
  }
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

  router.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

router.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
    return res.status(401).json({ message: 'Not logged in' });
  }
  res.status(200).sendFile(__dirname + '/public/dashboard.html', {
    user: req.user.apiRepr()
  });
})

router.post('/api/login',
  passport.authenticate('local', {session: true, successRedirect: '/dashboard', failureRedirect: '/login', failureFlash: 'Incorrect username or password'}),
  (req, res) => {
    // if (req.body.userName === 'demo' && req.isAuthenticated()) {
  //   //seedDemoInfo();
  // }
  });


router.get('/api/logout', function(req, res){
  req.logout();
  res.redirect('/');
});




///////////////////////////////////////////////////
app.use('/', router);

router.use('*', function(req, res) {
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


