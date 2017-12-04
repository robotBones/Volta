'use strict';

angular.module('writerboyApp')
	.controller('SettingsModalCtrl', function ($scope, $http, $uibModalInstance, $mdToast, Auth, User) {
		$scope.passwordDirty = false;
		$scope.profileDirty = false;
		$scope.user = Auth.getCurrentUser();

		$scope.updateChanges = function () {
			if ($scope.passwordDirty === true) {
				$scope.changePassword();
			} else if ($scope.profileDirty === true) {
				Auth.changeProfile($scope.user)
					.then(function () {
						$mdToast.show(
							$mdToast.simple()
							.textContent('Profile Updated')
							.position('top right')
							.hideDelay(3000)
						)
					})
					.catch(function () {
						$mdToast.show(
							$mdToast.simple()
							.textContent('An error occured')
							.position('top right')
							.hideDelay(3000)
						)
					})
			}
			$uibModalInstance.close();
		}

		$scope.updateProfile = function () {

		};

		$scope.changePassword = function () {

			Auth.changePassword($scope.oldPassword, $scope.newPassword)
				.then(function () {
					$mdToast.show(
						$mdToast.simple()
						.textContent('Password Updated')
						.position('top right')
						.hideDelay(3000)
					)
				})
				.catch(function () {
					$mdToast.show(
						$mdToast.simple()
						.textContent('An error occured')
						.position('top right')
						.hideDelay(3000)
					)
				})
		};

		$scope.cancel = function () {
			$uibModalInstance.close();
		}

	});
