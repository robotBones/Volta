'use strict';

describe('Controller: GarbageCtrl', function () {

  // load the controller's module
  beforeEach(module('writerboyApp'));

  var GarbageCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GarbageCtrl = $controller('GarbageCtrl', {
      $scope: scope
    });
  }));

  // it('should ...', function () {
  //   1.should.equal(1);
  // });
});
