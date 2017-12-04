'use strict';

var app = require('../..');
var request = require('supertest');

var newGarbage;

describe('Garbage API:', function() {

  describe('GET /api/garbage', function() {
    var garbages;

    beforeEach(function(done) {
      request(app)
        .get('/api/garbage')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          garbages = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      garbages.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/garbage', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/garbage')
        .send({
          name: 'New Garbage',
          info: 'This is the brand new garbage!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newGarbage = res.body;
          done();
        });
    });

    it('should respond with the newly created garbage', function() {
      newGarbage.name.should.equal('New Garbage');
      newGarbage.info.should.equal('This is the brand new garbage!!!');
    });

  });

  describe('GET /api/garbage/:id', function() {
    var garbage;

    beforeEach(function(done) {
      request(app)
        .get('/api/garbage/' + newGarbage._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          garbage = res.body;
          done();
        });
    });

    afterEach(function() {
      garbage = {};
    });

    it('should respond with the requested garbage', function() {
      garbage.name.should.equal('New Garbage');
      garbage.info.should.equal('This is the brand new garbage!!!');
    });

  });

  describe('PUT /api/garbage/:id', function() {
    var updatedGarbage

    beforeEach(function(done) {
      request(app)
        .put('/api/garbage/' + newGarbage._id)
        .send({
          name: 'Updated Garbage',
          info: 'This is the updated garbage!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedGarbage = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedGarbage = {};
    });

    it('should respond with the updated garbage', function() {
      updatedGarbage.name.should.equal('Updated Garbage');
      updatedGarbage.info.should.equal('This is the updated garbage!!!');
    });

  });

  describe('DELETE /api/garbage/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/garbage/' + newGarbage._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when garbage does not exist', function(done) {
      request(app)
        .delete('/api/garbage/' + newGarbage._id)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
