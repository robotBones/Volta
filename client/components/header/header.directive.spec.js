'use strict';

describe('Directive: header', function () {

	// load the directive's module and view
	beforeEach(module('writerboyApp'));
	beforeEach(module('app/components/header/header/header.html'));

	var element, scope;

	beforeEach(inject(function ($rootScope) {
		scope = $rootScope.$new();
	}));

	// it('should make hidden element visible', inject(function ($compile) {
	//   element = angular.element('<header></header>');
	//   element = $compile(element)(scope);
	//   scope.$apply();
	//   element.text().should.equal('this is the header directive');
	// }));
});
