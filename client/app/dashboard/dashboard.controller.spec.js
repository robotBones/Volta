'use strict';

describe('Controller: DashboardCtrl', function () {

  // load the controller's module
  beforeEach(module('writerboyApp'));

  var DashboardCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $http) {
    scope = $rootScope.$new();
    self.projects = [];
    DashboardCtrl = $controller('DashboardCtrl', {
      $scope: scope
    });
  }));


  // it('should fetch projects', function (){
  //   $http.get('/api/projects').then(function(response) {
  //     self.projects = response.data;
  //     self.projects.length.should.equal(0);
  //   });
  // });
});
