'use strict';

var app = require('../..');
import request from 'supertest';

var newShareDoc;

describe('ShareDoc API:', function() {

  describe('GET /api/shareDoc', function() {
    var shareDocs;

    beforeEach(function(done) {
      request(app)
        .get('/api/shareDoc')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          shareDocs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      shareDocs.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/shareDoc', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/shareDoc')
        .send({
          name: 'New ShareDoc',
          info: 'This is the brand new shareDoc!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newShareDoc = res.body;
          done();
        });
    });

    it('should respond with the newly created shareDoc', function() {
      newShareDoc.name.should.equal('New ShareDoc');
      newShareDoc.info.should.equal('This is the brand new shareDoc!!!');
    });

  });

  describe('GET /api/shareDoc/:id', function() {
    var shareDoc;

    beforeEach(function(done) {
      request(app)
        .get('/api/shareDoc/' + newShareDoc._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          shareDoc = res.body;
          done();
        });
    });

    afterEach(function() {
      shareDoc = {};
    });

    it('should respond with the requested shareDoc', function() {
      shareDoc.name.should.equal('New ShareDoc');
      shareDoc.info.should.equal('This is the brand new shareDoc!!!');
    });

  });

  describe('PUT /api/shareDoc/:id', function() {
    var updatedShareDoc;

    beforeEach(function(done) {
      request(app)
        .put('/api/shareDoc/' + newShareDoc._id)
        .send({
          name: 'Updated ShareDoc',
          info: 'This is the updated shareDoc!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedShareDoc = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedShareDoc = {};
    });

    it('should respond with the updated shareDoc', function() {
      updatedShareDoc.name.should.equal('Updated ShareDoc');
      updatedShareDoc.info.should.equal('This is the updated shareDoc!!!');
    });

  });

  describe('DELETE /api/shareDoc/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/shareDoc/' + newShareDoc._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when shareDoc does not exist', function(done) {
      request(app)
        .delete('/api/shareDoc/' + newShareDoc._id)
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
