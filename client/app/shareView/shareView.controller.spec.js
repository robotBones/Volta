'use strict';

describe('Controller: ShareViewCtrl', function () {

  // load the controller's module
  beforeEach(module('writerboyApp'));

  var ShareViewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShareViewCtrl = $controller('ShareViewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
