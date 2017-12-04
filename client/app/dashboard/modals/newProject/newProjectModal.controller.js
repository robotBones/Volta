'use strict';

angular.module('writerboyApp')
	.controller('NewProjectModalInstanceCtrl', function ($scope, $http, $location, Auth, $uibModalInstance, redirect, chapterId, $mdToast) {

		$scope.title = "";
		$scope.author = "";
		$scope.subheading = "";
		if (chapterId) {
			$scope.button = 'Create Project';
		} else {
			$scope.button = 'Write Now';
		}
		var dismiss = true;
		// console.log($location.path());
		console.log('Hello from NewProjectModalInstanceCtrl');


		$scope.save = function () {
			$http.post('/api/projects', {
					title: $scope.title,
					userID: Auth.getCurrentUser()._id
				})
				.then(function successCallback(response) {
					if (chapterId) {
						dismiss = false;
						$http.put('/api/chapters/' + chapterId, {
								project: response.data._id
							})
							.then(function (payload) {
								$mdToast.show(
									$mdToast.simple()
									.textContent('Project Created')
									.position("right")
									.hideDelay(3000)
								);
								$uibModalInstance.close(chapterId);
							});
					}
					if (redirect === true) {
						// $location.path('/dashboard/new/' + response.data._id)
						console.log(response);
						$http.post('/api/chapters', {
								title: 'Untitled Document',
								body: '',
								words: 0,
								userID: Auth.getCurrentUser()._id,
								project: response.data._id
							})
							.then(function successCallback(response) {
								console.log(response);
								$mdToast.show(
									$mdToast.simple()
									.textContent('Project Created')
									.position("right")
									.hideDelay(3000)
								);
								$location.path('/dashboard/edit/' + response.data._id);
								$uibModalInstance.dismiss();
							});
					}
				});

			$scope.title = "";
			$scope.author = "";
			$scope.subheading = "";
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
