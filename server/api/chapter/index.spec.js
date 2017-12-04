'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var chapterCtrlStub = {
  index: 'chapterCtrl.index',
  show: 'chapterCtrl.show',
  create: 'chapterCtrl.create',
  update: 'chapterCtrl.update',
  destroy: 'chapterCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var chapterIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './chapter.controller': chapterCtrlStub
});

describe('Chapter API Router:', function() {

  it('should return an express router instance', function() {
    chapterIndex.should.equal(routerStub);
  });

  describe('GET /api/chapters', function() {

    it('should route to chapter.controller.index', function() {
      routerStub.get
        .withArgs('/', 'chapterCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/chapters/:id', function() {

    it('should route to chapter.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'chapterCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/chapters', function() {

    it('should route to chapter.controller.create', function() {
      routerStub.post
        .withArgs('/', 'chapterCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/chapters/:id', function() {

    it('should route to chapter.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'chapterCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/chapters/:id', function() {

    it('should route to chapter.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'chapterCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/chapters/:id', function() {

    it('should route to chapter.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'chapterCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
