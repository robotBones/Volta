'use strict';

angular.module('writerboyApp')
	.controller('resendVerifyTokenCtrl', function ($scope, $http, $uibModalInstance, email, $mdToast, $location) {
		console.log('Hello from resendVerifyTokenCtrl');
		$scope.sendToken = function () {
			$http.get('/api/users/resend-token/' + email)
				.then(function (payload) {
					if (payload.status === 204) {
						if (payload.data === 'NOT_FOUND') {
							swal('Oops!', 'The account associated with the email was not found.');
							$location.path('/signup');
						} else {
							swal('Oops!', 'There was a problem verifying your account. Please try again later.');
							$location.path('/dashboard');
						}
					}
					if (payload.status === 203) {
						console.log('Verification link sent');
						$mdToast.show(
							$mdToast.simple()
							.textContent('Verification link sent.')
							.position("right")
							.hideDelay(3000)
						);
						$location.path('/dashboard');
					}
					$uibModalInstance.close(payload.status);
				});

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
		};
	});