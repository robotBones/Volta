'use strict';

angular.module('writerboyApp')
	.config(function ($routeProvider) {
		$routeProvider
			.when('/dashboard/redirect/:newProject/:projectName/:userId', {
				templateUrl: 'app/dashboard/redirect/redirect.html',
				controller: 'RedirectCtrl'
			});
	});
