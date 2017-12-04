'use strict';

angular.module('writerboyApp')
	.controller('LoginCtrl', function ($scope, Auth, $location, $timeout, $rootScope) {
		console.log('Hello from LoginCtrl');


		var loggedIn = false;

		if (Auth.isLoggedIn()) {
				console.log('Logged in. Redirecting');
				loggedIn = true;
				$location.path('/dashboard');
		}

		$scope.user = {};
		$scope.errors = {};
		$timeout(function () {
			if (Auth.isLoggedIn()) {
				console.log('Logged in. Redirecting');
				$location.path('/dashboard');
			} else {
				console.log('Not logged in');
			}
		}, 1000);
		$scope.login = function (form) {
			$scope.loading = true;
			$scope.submitted = true;

			if (form.$valid) {
				Auth.login({
						email: $scope.user.email,
						password: $scope.user.password
					})
					.then(function (user) {
						console.log('USER LOGIN: ', user);
						if (user.verified === 'true') {
							$rootScope.showVerifyMessage = false;
						} else {
							$rootScope.showVerifyMessage = true;
						}
						console.log('SHOW VERIFY MESSAGE: ', $rootScope.showVerifyMessage);
						// Logged in, redirect to home
						$scope.loading = false;
						$location.path('/dashboard');
					})
					.catch(function (err) {
						$scope.loading = false;
						$scope.errors.other = err.message;
					});
			}
		};

	});