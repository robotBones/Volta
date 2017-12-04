'use strict';

describe('Controller: EditdocumentCtrl', function () {

  // load the controller's module
  beforeEach(module('writerboyApp'));

  var EditdocumentCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditdocumentCtrl = $controller('EditdocumentCtrl', {
      $scope: scope
    });
  }));

});
