'use strict';

var app = require('../..');
import request from 'supertest';

var newForgot;

describe('Forgot API:', function() {

  describe('GET /api/forgot', function() {
    var forgots;

    beforeEach(function(done) {
      request(app)
        .get('/api/forgot')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          forgots = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      forgots.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/forgot', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/forgot')
        .send({
          name: 'New Forgot',
          info: 'This is the brand new forgot!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newForgot = res.body;
          done();
        });
    });

    it('should respond with the newly created forgot', function() {
      newForgot.name.should.equal('New Forgot');
      newForgot.info.should.equal('This is the brand new forgot!!!');
    });

  });

  describe('GET /api/forgot/:id', function() {
    var forgot;

    beforeEach(function(done) {
      request(app)
        .get('/api/forgot/' + newForgot._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          forgot = res.body;
          done();
        });
    });

    afterEach(function() {
      forgot = {};
    });

    it('should respond with the requested forgot', function() {
      forgot.name.should.equal('New Forgot');
      forgot.info.should.equal('This is the brand new forgot!!!');
    });

  });

  describe('PUT /api/forgot/:id', function() {
    var updatedForgot;

    beforeEach(function(done) {
      request(app)
        .put('/api/forgot/' + newForgot._id)
        .send({
          name: 'Updated Forgot',
          info: 'This is the updated forgot!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedForgot = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedForgot = {};
    });

    it('should respond with the updated forgot', function() {
      updatedForgot.name.should.equal('Updated Forgot');
      updatedForgot.info.should.equal('This is the updated forgot!!!');
    });

  });

  describe('DELETE /api/forgot/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/forgot/' + newForgot._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when forgot does not exist', function(done) {
      request(app)
        .delete('/api/forgot/' + newForgot._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
