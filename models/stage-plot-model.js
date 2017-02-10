//const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// STAGE PLOTS

const StagePlotSchema = mongoose.Schema({
    img: {
        type: String
        },
    dateCreated: {
        type: Date
    },
    dateModified: {
        type: Date
    },
    userId: {
        type: String,
        required: true
    } // The user id of the user that made the event
});

StagePlotSchema.methods.apiRepr = function () {
    return {
        img: this.img || 'Upload a stage plot',
        dateCreated: this.dateCreated || '',
        dateModified: this.dateModified || '',
        id: this.id || ''
    };
};


const StagePlot = mongoose.model('StagePlot', StagePlotSchema);

module.exports = { StagePlot };

