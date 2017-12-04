'use strict';

angular.module('writerboyApp')
	.config(function ($routeProvider) {
		$routeProvider
			.when('/reset-password/:id', {
				templateUrl: 'app/account/reset-pass/reset-pass.html',
				controller: 'ResetPassCtrl'
			});
	});
