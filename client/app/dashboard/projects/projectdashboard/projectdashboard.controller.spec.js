'use strict';

describe('Controller: ProjectdashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('writerboyApp'));

  var ProjectdashboardCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectdashboardCtrl = $controller('ProjectdashboardCtrl', {
      $scope: scope
    });
  }));

  // it('should ...', function () {
  //   1.should.equal(1);
  // });
});
