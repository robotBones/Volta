'use strict';

angular.module('writerboyApp')
	.controller('uploadDocModalCtrl', function ($scope, socket, Auth, $http, $rootScope, $location, $uibModalInstance, redirect, Upload) {
		$scope.doc = {
			title: ($rootScope.fileToUpload.name).replace('.docx', '').replace('.txt', ''),
			body: '',
			words: 0,
			userID: Auth.getCurrentUser()._id,
			file: $rootScope.fileToUpload,
			projectTitle: '',
			project: ''
		}
		$http.get('/api/projects?uid=' + Auth.getCurrentUser()._id + '&trash=false').success(function (projects) {
			// console.log('this is working');
			// console.log(projects);
			$scope.projects = projects;
			if (projects.length > 0) {
				$scope.hasProjects = true;
			}
			socket.syncUpdates('project', $scope.projects);
		});
		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('project');
		});
		console.log('Hello from uploadDocModalCtrl');
		$scope.uploadFile = function () {
			var file = $scope.doc.file;
			console.log('logging doc');
			console.log($scope.doc);
			if (file !== null) {
				Upload.upload({
					url: '/api/uploads',
					data: $scope.doc
				}).then(function (resp) {
					// sweetAlert('Done!', 'Video Uploaded.', 'success');
					console.log(resp.data);
					//$rootScope.docData = resp.data;
					$uibModalInstance.dismiss();
					console.log('Uploaded');
				}, function (resp) {
					console.log('Error status: ' + resp.status);
				}, function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				});
			}
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
