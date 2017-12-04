'use strict';

var app = require('../..');
var request = require('supertest');

var newChapter;

describe('Chapter API:', function() {

  describe('GET /api/chapters', function() {
    var chapters;

    beforeEach(function(done) {
      request(app)
        .get('/api/chapters')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          chapters = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      chapters.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/chapters', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/chapters')
        .send({
          title: 'New Chapter',
          body: 'This is the brand new chapter!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          newChapter = res.body;
          done();
        });
    });

    it('should respond with the newly created chapter', function() {
      newChapter.title.should.equal('New Chapter');
      newChapter.body.should.equal('This is the brand new chapter!!!');
    });

  });

  describe('GET /api/chapters/:id', function() {
    var chapter;

    beforeEach(function(done) {
      request(app)
        .get('/api/chapters/' + newChapter._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          chapter = res.body;
          done();
        });
    });

    afterEach(function() {
      chapter = {};
    });

    it('should respond with the requested chapter', function() {
      chapter.title.should.equal('New Chapter');
      chapter.body.should.equal('This is the brand new chapter!!!');
    });

  });

  describe('PUT /api/chapters/:id', function() {
    var updatedChapter

    beforeEach(function(done) {
      request(app)
        .put('/api/chapters/' + newChapter._id)
        .send({
          title: 'Updated Chapter',
          body: 'This is the updated chapter!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedChapter = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedChapter = {};
    });

    it('should respond with the updated chapter', function() {
      updatedChapter.title.should.equal('Updated Chapter');
      updatedChapter.body.should.equal('This is the updated chapter!!!');
    });

  });

  describe('DELETE /api/chapters/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/chapters/' + newChapter._id)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when chapter does not exist', function(done) {
      request(app)
        .delete('/api/chapters/' + newChapter._id)
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
