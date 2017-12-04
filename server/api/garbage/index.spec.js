'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var garbageCtrlStub = {
  index: 'garbageCtrl.index',
  show: 'garbageCtrl.show',
  create: 'garbageCtrl.create',
  update: 'garbageCtrl.update',
  destroy: 'garbageCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var garbageIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './garbage.controller': garbageCtrlStub
});

describe('Garbage API Router:', function() {

  it('should return an express router instance', function() {
    garbageIndex.should.equal(routerStub);
  });

  describe('GET /api/garbage', function() {

    it('should route to garbage.controller.index', function() {
      routerStub.get
        .withArgs('/', 'garbageCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/garbage/:id', function() {

    it('should route to garbage.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'garbageCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/garbage', function() {

    it('should route to garbage.controller.create', function() {
      routerStub.post
        .withArgs('/', 'garbageCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/garbage/:id', function() {

    it('should route to garbage.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'garbageCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/garbage/:id', function() {

    it('should route to garbage.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'garbageCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/garbage/:id', function() {

    it('should route to garbage.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'garbageCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
