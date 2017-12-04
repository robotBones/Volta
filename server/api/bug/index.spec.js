'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var bugCtrlStub = {
  index: 'bugCtrl.index',
  show: 'bugCtrl.show',
  create: 'bugCtrl.create',
  update: 'bugCtrl.update',
  destroy: 'bugCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var bugIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './bug.controller': bugCtrlStub
});

describe('Bug API Router:', function() {

  it('should return an express router instance', function() {
    bugIndex.should.equal(routerStub);
  });

  describe('GET /api/bugs', function() {

    it('should route to bug.controller.index', function() {
      routerStub.get
        .withArgs('/', 'bugCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/bugs/:id', function() {

    it('should route to bug.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'bugCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/bugs', function() {

    it('should route to bug.controller.create', function() {
      routerStub.post
        .withArgs('/', 'bugCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/bugs/:id', function() {

    it('should route to bug.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'bugCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/bugs/:id', function() {

    it('should route to bug.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'bugCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/bugs/:id', function() {

    it('should route to bug.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'bugCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
