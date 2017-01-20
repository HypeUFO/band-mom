const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// USERS

const UserSchema = {
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    }
};

UserSchema.methods.apiRepr = function () {
    return {
        userName: this.userName || '',
        firstName: this.firstName || '',
        lastName: this.lastName || ''
    };
}

UserSchema.methods.validatePassword = function (password) {
    return bcrypt
        .compare(password, this.password)
        .then(isValid => isValid);
}

UserSchema.statics.hashPassword = function (password) {
    return bcrypt
        .hash(password, 10)
        .then(hash => hash);
}

// EVENTS

const EventSchema = {
   venueName: {type: String},
   venueAddress: {type: String},
   startTime: {type: Date},
   soundCheckTime: {type: Date},
   manifest: {type: Object},
   dateCreated: {type: Date},
   dateModified: {type: Date},
   userId: {type: String} // The user id of the user that made the event
};

EventSchema.methods.apiRepr = function () {
    return {
        venueName: this.venueName || '',
        venueAddress: this.venueAddress || '',
        startTime: this.startTime || '',
        soundCheckTime: this.soundCheckTime || '',
        manifest: this.manifest || ''
    };
}


const User = mongoose.model('User', UserSchema);
const Event = mongoose.model('Event', EventSchema);

module.exports = { User, Event };