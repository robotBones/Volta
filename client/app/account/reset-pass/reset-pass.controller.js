'use strict';

angular.module('writerboyApp')
	.controller('ResetPassCtrl', function ($scope, $http, $location, $routeParams) {
		$scope.message = 'Hello from ResetPassCtrl';
		$scope.send = function (form) {
			$scope.submitted = true;
			console.log('doing it.');
			if (form.$valid) {
				if ($scope.data.newPass === $scope.data.confirm) {
					$http.post('/api/forgot/reset/' + $routeParams.id, $scope.data)
						.then(function (payload) {
							console.log(payload);
							if (payload.status === 203) {
								swal('Unmatched Temporary Password', 'The temporary password is wrong.', 'info');
							} else if (payload.status === 200) {
								swal('Success!', 'Your password has been updated.', 'info');
								$location.path('/login');
							} else if (payload.status === 204) {
								swal('Temporary Password Expired', 'Your temporary password reset link has expired.', 'info');
							}
						}, function (err) {
							console.log(err);
						});
				} else {
					alert('Your new and confirm passwords don\'t match');
				}
			}
		};
	});
