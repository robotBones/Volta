'use strict';

angular.module('writerboyApp')
	.controller('GarbageCtrl', function ($scope, $http, Auth, NgTableParams, $uibModal) {

		$scope.data = [];
		$scope.tableParams = new NgTableParams();

		var getData = function () {
			$http.get('/api/chapters?uid=' + Auth.getCurrentUser()._id + '&trash=true').then(function (response) {
				$scope.data = response.data;
				console.log($scope.data);
				if ($scope.data.length === 0) {
					$scope.firstRun = true;
				} else {
					$scope.firstRun = false;
					$scope.tableParams = new NgTableParams({
						count: 1000
					}, {
						data: $scope.data,
						counts: []
					});
					setTimeout(function () {
						$('tbody td').attr('title', '');
					}, 200);
				}
			});
		};
		getData();

		$scope.openCleanGarbage = function () {
			var modalInstance = $uibModal.open({
				animation: true,
				size: 'md',
				templateUrl: 'app/dashboard/modals/garbageAction/cleanGarbageModal.html',
				controller: 'CleanGarbageModalCtrl',
				resolve: {
					chapters: function () {
						return $scope.data;
					}
				}
			});
			modalInstance.result.then(function () {
				getData();
				$scope.tableParams.reload();
			});
		}

		$scope.openGarbageAction = function (id, body, index) {
			var modalInstance = $uibModal.open({
				animation: true,
				size: 'sm',
				templateUrl: 'app/dashboard/modals/garbageAction/garbageActionModal.html',
				controller: 'GarbageActionModalCtrl',
				resolve: {
					tObject: function () {
						var object = {
							id: id,
							body: body,
							idx: index
						};

						return object;
					}
				}
			});

			modalInstance.result.then(function (idx) {
				$scope.data.splice(1, idx);
				getData();
				$scope.tableParams.reload();
			});
		};

	});
