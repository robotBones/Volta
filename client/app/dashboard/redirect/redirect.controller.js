'use strict';

angular.module('writerboyApp')
	.controller('RedirectCtrl', function ($scope, $http, Auth, $routeParams, $location) {
		$scope.message = 'Hello';
		if ($routeParams.newProject !== '0') {
			console.log('doing for project');
			var userId = $routeParams.userId;
			// console.log(Auth.getCurrentUser()._id);
			$http.post('/api/projects', {
					title: $routeParams.projectName,
					userID: userId
				})
				.then(function successCallback(response) {
					/*if ($rootScope.projectChapterId) {
						$http.put('/api/chapters/' + $rootScope.projectChapterId, {
								project: response.data._id
							})
							.then(function (payload) {

							});
					}*/
					console.log(response);
					$http.post('/api/chapters', {
							title: 'Untitled Document',
							body: '',
							words: 0,
							userID: userId,
							project: response.data._id
						})
						.then(function successCallback(response) {
							console.log(response);
							$location.path('/dashboard/edit/' + response.data._id);
						});

				});
		} else {
			$http.post('/api/chapters', {
					title: 'Untitled Document',
					body: '',
					words: 0,
					userID: userId
				})
				.then(function successCallback(response) {
					console.log(response);
					$location.path('/dashboard/edit/' + response.data._id);
				});
		}

	});
