'use strict';

angular.module('writerboyApp')
	.controller('GarbageActionModalCtrl', function ($location, $scope, $http, Auth, $uibModalInstance, tObject) {
		$scope.delete = function () {
			if (angular.isUndefined(tObject.body)) {
				//this is a project
				$http.delete('/api/projects/' + tObject.id).then(function (response) {
					$uibModalInstance.close(tObject.idx);
				});
			} else {
				$http.delete('/api/chapters/' + tObject.id).then(function (response) {
					$uibModalInstance.close(tObject.idx);
				});
			}
		};
		$scope.restore = function () {
			$http.put('/api/chapters/' + tObject.id, {
				inGarbage: false
			});
			$location.path('/dashboard/edit/' + tObject.id);
			$uibModalInstance.close(tObject.idx);
		};
	});
