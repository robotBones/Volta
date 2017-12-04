'use strict';

angular.module('writerboyApp')
	.controller('shareDocCtrl', function ($scope, $rootScope, $uibModalInstance, Auth, $timeout, $http, chapterId) {
		
		$scope.emails = {
			emails: ''
		};
		$scope.share = function () {
			$http.post('/api/shareDoc', {
				emails: $scope.emails.emails,
				name: Auth.getCurrentUser().firstName + ' ' + Auth.getCurrentUser().lastName,
				chapter: chapterId
			})
			.then(function (response) {
				console.log(response);
				$uibModalInstance.close();
			});
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});