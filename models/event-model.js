//const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var date = require('date-and-time');

mongoose.Promise = global.Promise;

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
        //eventDate: this.eventDate.toLocaleDateString('en-US') || '',
        eventDate: date.format(this.eventDate, 'M/D/YY'),
        venueName: this.venueName || '',
        venueAddress: this.venueAddress || '',
        startTime: this.startTime || '',
        soundCheckTime: this.soundCheckTime || '',
        manifest: this.manifest || {},
        notes: this.notes || '',
        id: this.id || '',
    };
};


const Event = mongoose.model('Event', EventSchema);

module.exports = { Event };

