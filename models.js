//const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// USERS
/*
const UserSchema = mongoose.Schema({
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
});

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
*/
// EVENTS

const EventSchema = mongoose.Schema({
    eventDate: {
        type: Date
    },
    venueName: {
        type: String
    },
    venueAddress: {
        type: String
    },
    startTime: {
        type: String
    },
    soundCheckTime: {
        type: String
    },
    manifest: {
        type: Object
    },
    notes: {
        type: String
    },
    dateCreated: {
        type: Date
    },
    dateModified: {
        type: Date
    },
    userId: {
        type: String
    } // The user id of the user that made the event
});

EventSchema.methods.apiRepr = function () {
    return {
        eventDate: this.eventDate || '',
        venueName: this.venueName || '',
        venueAddress: this.venueAddress || '',
        startTime: this.startTime || '',
        soundCheckTime: this.soundCheckTime || '',
        manifest: this.manifest || '',
        notes: this.notes || '',
        id: this.id || '',
    };
};


const Event = mongoose.model('Event', EventSchema);
//const User = mongoose.model('User', UserSchema);

module.exports = { Event };
//module.exports = { User };
