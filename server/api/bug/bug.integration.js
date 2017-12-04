'use strict';

var app = require('../..');
import request from 'supertest';

var newBug;

describe('Bug API:', function() {

  describe('GET /api/bugs', function() {
    var bugs;

    beforeEach(function(done) {
      request(app)
        .get('/api/bugs')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          bugs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      bugs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/bugs', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/bugs')
        .send({
          name: 'New Bug',
          info: 'This is the brand new bug!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBug = res.body;
          done();
        });
    });

    it('should respond with the newly created bug', function() {
      newBug.name.should.equal('New Bug');
      newBug.info.should.equal('This is the brand new bug!!!');
    });

  });

  describe('GET /api/bugs/:id', function() {
    var bug;

    beforeEach(function(done) {
      request(app)
        .get('/api/bugs/' + newBug._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          bug = res.body;
          done();
        });
    });

    afterEach(function() {
      bug = {};
    });

    it('should respond with the requested bug', function() {
      bug.name.should.equal('New Bug');
      bug.info.should.equal('This is the brand new bug!!!');
    });

  });

  describe('PUT /api/bugs/:id', function() {
    var updatedBug;

    beforeEach(function(done) {
      request(app)
        .put('/api/bugs/' + newBug._id)
        .send({
          name: 'Updated Bug',
          info: 'This is the updated bug!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBug = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBug = {};
    });

    it('should respond with the updated bug', function() {
      updatedBug.name.should.equal('Updated Bug');
      updatedBug.info.should.equal('This is the updated bug!!!');
    });

  });

  describe('DELETE /api/bugs/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/bugs/' + newBug._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when bug does not exist', function(done) {
      request(app)
        .delete('/api/bugs/' + newBug._id)
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
