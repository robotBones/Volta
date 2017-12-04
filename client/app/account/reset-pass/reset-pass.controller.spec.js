'use strict';

describe('Controller: ResetPassCtrl', function () {

  // load the controller's module
  beforeEach(module('writerboyApp'));

  var ResetPassCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResetPassCtrl = $controller('ResetPassCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
