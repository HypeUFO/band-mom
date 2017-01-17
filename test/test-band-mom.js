const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');

const should = chai.should();

const app = server.app;

chai.use(chaiHttp);

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