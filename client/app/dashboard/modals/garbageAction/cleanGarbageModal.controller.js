'use strict';

angular.module('writerboyApp')
	.controller('CleanGarbageModalCtrl', function ($scope, $http, Auth, $uibModalInstance, chapters) {
		$scope.empty = function () {
			//this is a project
			console.log(chapters);
			var ids = [];
			for (var i = 0; i < chapters.length; i++) {
				console.log('doing');
				ids.push(chapters[i]._id);
				if (i === chapters.length - 1) {
					console.log('posting');
					$http.post('/api/chapters/empty', ids)
						.then(function (response) {
							console.log('done');
							$uibModalInstance.close();
						});
				}
			}
		};
		$scope.cancel = function () {
			$uibModalInstance.close();
		};
	});
