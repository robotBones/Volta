'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var forgotCtrlStub = {
  index: 'forgotCtrl.index',
  show: 'forgotCtrl.show',
  create: 'forgotCtrl.create',
  update: 'forgotCtrl.update',
  destroy: 'forgotCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var forgotIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './forgot.controller': forgotCtrlStub
});

describe('Forgot API Router:', function() {

  it('should return an express router instance', function() {
    forgotIndex.should.equal(routerStub);
  });

  describe('GET /api/forgot', function() {

    it('should route to forgot.controller.index', function() {
      routerStub.get
        .withArgs('/', 'forgotCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/forgot/:id', function() {

    it('should route to forgot.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'forgotCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/forgot', function() {

    it('should route to forgot.controller.create', function() {
      routerStub.post
        .withArgs('/', 'forgotCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/forgot/:id', function() {

    it('should route to forgot.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'forgotCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/forgot/:id', function() {

    it('should route to forgot.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'forgotCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/forgot/:id', function() {

    it('should route to forgot.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'forgotCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
