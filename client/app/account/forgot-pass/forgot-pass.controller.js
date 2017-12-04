'use strict';

angular.module('writerboyApp')
	.controller('ForgotPassCtrl', function ($scope, $http, $location, $window) {
		$scope.user = {
			email: ''
		};
		$scope.send = function (form) {
			$scope.submitted = true;
			console.log('doing it.');
			if (form.$valid) {
				$http.post('/api/forgot', $scope.user)
					.then(function (payload) {
						if (payload.status === 203) {
							swal('Oops!', 'Your email is not registered to any account.', 'info');
						} else {
							swal('Success!', 'A password reset link was sent to your email.', 'info');
							$window.open('http://voltawriter.com/', '_self');
						}
						console.log(payload);
					}, function (err) {
						console.log(err);
					});
			}
		};
	});
