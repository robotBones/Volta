'use strict';

angular.module('writerboyApp')
	.controller('MoveChapterModalCtrl', function ($scope, $http, Auth, $uibModalInstance, chapter, $uibModal) {
		$scope.chapterId = chapter.id;
		$http.get('/api/projects?uid=' + Auth.getCurrentUser()._id + '&trash=false')
			.success(function (projects) {
				console.log(projects);
				$scope.projects = projects;
			});
		$scope.addToProject = function (chapterId, projectid) {
			// add project to existing chapter
			console.log(projectid);
			$http.put('/api/chapters/' + chapterId, {
				project: projectid
			}).then(function (response) {
				//while we are at it also lets update this project with
				var actionwithIndex = {
					action: 'mv',
					index: chapter.idx,
					id: chapter.id
				};
				$uibModalInstance.close(actionwithIndex);
			});
		};
		$scope.deleteChapter = function (chapterId) {
			$http.put('/api/chapters/' + chapterId, {
				inGarbage: true
			});
			var actionwithIndex = {
				action: 'del',
				index: chapter.idx
			}
			$uibModalInstance.close(actionwithIndex);
		};
		// create a new project and move this chapter to it
		$scope.newProject = function () {
			var actionwithIndex = {
				action: 'new',
				index: chapter.idx,
				id: $scope.chapterId
			}
			$uibModalInstance.close(actionwithIndex);
		};
		$scope.ok = function () {
			$uibModalInstance.close();
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
