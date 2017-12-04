'use strict';

describe('Controller: ForgotPassCtrl', function () {

  // load the controller's module
  beforeEach(module('writerboyApp'));

  var ForgotPassCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ForgotPassCtrl = $controller('ForgotPassCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
