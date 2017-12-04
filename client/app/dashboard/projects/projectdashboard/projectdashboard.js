'use strict';

angular.module('writerboyApp')
	.config(function ($routeProvider) {
		$routeProvider
			.when('/dashboard/projects/:id', {
				templateUrl: 'app/dashboard/projects/projectdashboard/projectdashboard.html',
				controller: 'ProjectdashboardCtrl'
			});
	});
