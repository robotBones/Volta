'use strict';

describe('Controller: SettingsModalCtrl', function () {

	// load the controller's module
	beforeEach(module('writerboyApp'));

	var SettingsModalCtrl, scope;

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($controller, $rootScope) {
		scope = $rootScope.$new();
		SettingsModalCtrl = $controller('SettingsModalCtrl', {
			$scope: scope
		});
	}));

	it('should ...', function () {
		1. should.equal(1);
	});
});
