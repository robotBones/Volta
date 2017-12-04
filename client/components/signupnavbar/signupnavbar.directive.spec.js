'use strict';

describe('Directive: signupnavbar', function () {

  // load the directive's module and view
  beforeEach(module('writerboyApp'));
  beforeEach(module('components/signupnavbar/signupnavbar.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<signupnavbar></signupnavbar>');
    element = $compile(element)(scope);
    scope.$apply();
    element.text().should.equal('this is the signupnavbar directive');
  }));
});
