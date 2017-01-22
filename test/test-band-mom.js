const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {User} = require('../models');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// load html

describe ('index page', function(){
    it ('should load', function(){
        return chai.request(app)
        .get('/')
        .then(function(res){
            res.should.have.status(200);
            res.should.be.html;
        });
    });
});

describe ('dashboard page', function(){
    it ('should load', function(){
        return chai.request(app)
        .get('/dashboard')
        .then(function(res){
            res.should.have.status(200);
            res.should.be.html;
        });
    });
});

// API Endpoint Tests