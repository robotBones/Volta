'use strict';

describe('Controller: BugModalCtrl', function () {

  // load the controller's module
  beforeEach(module('writerboyApp'));

  var BugModalCtrlCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BugModalCtrlCtrl = $controller('BugModalCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    1.should.equal(1);
  });
});
