'use strict';

angular.module('writerboyApp')
	.controller('HeaderCtrl', function ($scope, $uibModal, $rootScope, Auth, Upload, $http, $location, $mdToast) {
		$scope.opened = false;
		$scope.gotMatch = true;
		$scope.toggleSearch = function () {
			$scope.opened = !$scope.opened;
			if (!$scope.opened) {
				$scope.gotMatch = true;
				$scope.searching = false;
				$scope.query = '';
			}
		};
		$scope.settings = function () {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/dashboard/modals/settings/settings.html',
				controller: 'SettingsModalCtrl',
				size: 'md'
			});
		};
		$scope.closeMessage = function () {
			$rootScope.showVerifyMessage = false;
		};
		$scope.sendLink = function () {
			$http.get('/api/users/resend-token/' + Auth.getCurrentUser().email)
				.then(function (payload) {
					if (payload.status === 204) {
						if (payload.data === 'NOT_FOUND') {
							swal('Oops!', 'The account associated with the email was not found.');
							$location.path('/signup');
						} else {
							swal('Oops!', 'There was a problem verifying your account. Please try again later.');
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
					}
				});
		};

	});