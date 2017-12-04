'use strict';

angular.module('writerboyApp')
	.controller('SidebarCtrl', function ($scope, $uibModal, $mdDialog, $rootScope, Auth, Upload, $http, $location) {

		$scope.toggleMenu = function () {
			// console.log("hello");
			$('#wrapper').toggleClass('toggled');
		};

		$scope.reportAbug = function () {

			// $mdDialog.show({
			//   templateUrl: 'bugModal.html',
			//   controller: 'BugModalCtrl',
			//   parent: angular.element(document.body),
			//   clickOutsideToClose: true
			// });
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'bugModal.html',
				controller: 'BugModalCtrl',
				size: '',
				resolve: {
					redirect: true
				}
			});
		};

		$scope.uploadFile = function (file, errFile) {
			console.log('logging doc');
			var doc = {
				title: (file.name).replace('.docx', '').replace('.txt', ''),
				body: '',
				words: 0,
				userID: Auth.getCurrentUser()._id,
				file: file
			}
			console.log(doc);
			if (file !== null) {
				Upload.upload({
					url: '/api/uploads',
					data: doc
				}).then(function (response) {
					// sweetAlert('Done!', 'Video Uploaded.', 'success');
					console.log(response.data);
					$location.path('/dashboard/edit/' + response.data._id);
					//$rootScope.docData = resp.data;
					//$uibModalInstance.dismiss();
					console.log('Uploaded');
				}, function (resp) {
					console.log('Error status: ' + resp.status);
				}, function (evt) {
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
				});
			}
		};

		$scope.newChapter = function () {
			$http.post('/api/chapters', {
					title: 'Untitled Document',
					body: '',
					words: 0,
					userID: Auth.getCurrentUser()._id
				})
				.then(function successCallback(response) {
					console.log(response);
					$location.path('/dashboard/edit/' + response.data._id);
				});
		};

		$scope.newProject = function () {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'app/dashboard/modals/newProject/newProjectModal.html',
				controller: 'NewProjectModalInstanceCtrl',
				size: 'md',
				resolve: {
					redirect: true,
					chapterId: false
				}
			});
		};
	});
