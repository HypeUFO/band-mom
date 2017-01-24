//const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// USERS

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


const User = mongoose.model('User', UserSchema);

module.exports = { User };