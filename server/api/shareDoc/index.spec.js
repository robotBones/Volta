'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var shareDocCtrlStub = {
  index: 'shareDocCtrl.index',
  show: 'shareDocCtrl.show',
  create: 'shareDocCtrl.create',
  update: 'shareDocCtrl.update',
  destroy: 'shareDocCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var shareDocIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './shareDoc.controller': shareDocCtrlStub
});

describe('ShareDoc API Router:', function() {

  it('should return an express router instance', function() {
    shareDocIndex.should.equal(routerStub);
  });

  describe('GET /api/shareDoc', function() {

    it('should route to shareDoc.controller.index', function() {
      routerStub.get
        .withArgs('/', 'shareDocCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/shareDoc/:id', function() {

    it('should route to shareDoc.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'shareDocCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/shareDoc', function() {

    it('should route to shareDoc.controller.create', function() {
      routerStub.post
        .withArgs('/', 'shareDocCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/shareDoc/:id', function() {

    it('should route to shareDoc.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'shareDocCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/shareDoc/:id', function() {

    it('should route to shareDoc.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'shareDocCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/shareDoc/:id', function() {

    it('should route to shareDoc.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'shareDocCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
