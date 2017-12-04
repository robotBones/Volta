'use strict';

angular.module('writerboyApp')
	.controller('SignupCtrl', function ($scope, Auth, $location, $timeout, $mdToast, $analytics, $http, $rootScope) {
		$scope.user = {};
		$scope.errors = {};

		// $timeout(function () {
		// 	var elem = angular.element($document[0].querySelector('input[type=email]:-webkit-autofill'));
		//
		// 	if (elem.length) {
		// 		elem.parent().addClass('md-input-has-value');
		// 	}
		// }, 150);

		$scope.hello = function () {
			console.log(form);
		}

		$scope.register = function (form) {
			$scope.submitted = true;

			if (form.$valid) {
				$mdToast.show(
					$mdToast.simple()
					.textContent('Please Wait!')
					.position("right")
					.hideDelay(3000)
				);
				$scope.loading = true;
				Auth.createUser({
						name: $scope.user.firstName + ' ' + $scope.user.lastName,
						username: $scope.user.email,
						email: $scope.user.email,
						firstName: $scope.user.firstName,
						lastName: $scope.user.lastName,
						password: $scope.user.password
					})
					.then(function (payload) {
						console.log(payload);
						$rootScope.showVerifyMessage = true;
						// Account created, redirect to home. but first check if user token is set
						$timeout(function () {
							$scope.loading = false;
							if (Auth.getCurrentUser()._id !== undefined) {
								$analytics.eventTrack('SignUp', {
									category: 'User Account',
									label: $scope.user.email
								});
								$http.post('/api/chapters', {
										title: 'Welcome to Volta',
										body: '<div><b><span style="font-size: 18px;">Thank you for trying Volta!</span></b></div><div><br></div><div>The purpose of this application is to make the writing experience more enjoyable. The idea is that if writers like writing more they will do it more, thereby producing better work. With Volta, writers can enjoy a distraction-free writing experience on a beautiful platform built for the cloud. And it\'s absolutely free!</div><div><br></div><div>In an effort to enhance the writing experience, we\'ve stripped down the typical cloud-based word processor to the absolute essentials. It might be a little different than what you\'re used to, but once you get the hang of it, we\'re confident you\'ll find yourself writing more and writing better because you will be able to concentrate on the only thing that really matters: writing!</div><div><br></div><div>To help you get started, we\'ve created this document that will help you find your way around. If you have any questions or any feedback, please drop us a line at <a href="mailto:support@voltawriter.com">support@voltawriter.com</a>.</div><div><br></div><div>Enjoy!</div><div><br></div><div><b><span style="font-size: 18px;">Text Editor Functions</span></b></div><div><br></div><div><b>Title Rename</b> - See the words "Untitled Document" at the bottom of the screen? You can click that and rename it.</div><div><br></div><div><b>Word Count</b> - Lower righthand corner.</div><div><br></div><div><b>Save</b> - As long as you\'re online, everything auto-saves. We\'re working on offline.</div><div><br></div><div><b>Full-screen</b> - Diagonal Arrows in the Toolbar at the top of the screen. Press esc to resize back to normal.</div><div><br></div><div><b>Theme Selection</b> - Volta has a special feature that lets you change the look of the screen. You can access that by clicking the little TV icon in the toolbar at the top of the screen. Try Doogie Howser. That\'s a cool one. </div><div><br></div><div><b>Distraction-free Mode</b> - Click the little eye with the line through it in the toolbar at the top of the screen. This will hide everything on the screen except the writing. Press \'esc\' to bring everything back.</div><div><br></div><div><b>Typeface</b> - You can change the font by clicking the little triangles next to \'Inconsolata. You have three fonts to choose from: Inconsolata, Serif, and Open Sans. You can change the size by clicking the little triangles next to "Normal." Once the export document features are working, documents will export to DOCx and PDF in 12 pt, Black, double-spaced, Times New Roman (Standard MLA Format).</div><div><br></div><div><b><span style="font-size: 18px;">Hot Keys</span></b></div><div><br></div><div><b>Undo </b>- (Mac) Command-Z, (Win) Control-Z</div><div><br></div><div><b>Redo </b>- (Mac) Command-Shift-Z, (Win) Control-Y</div><div><br></div><div><b>Copy </b>- (Mac) Command-C, (Win) Control-C </div><div><br></div><div><b>Paste </b>- (Mac) Command-V, (Win) Control-V</div><div><br></div><div><b>Select All </b>- (Mac) Command-A, (Win) Control-A</div><div><br></div><div><br></div>',
										words: 0,
										userID: Auth.getCurrentUser()._id
									})
									.then(function successCallback(response) {
										console.log(response);
									});
								$location.path('/dashboard');
							}
						}, 3000);
					})
					.catch(function (err) {
						$scope.loading = false;
						console.log(err);
						err = err.data;
						$scope.errors = {};

						// Update validity of form fields that match the mongoose errors
						angular.forEach(err.errors, function (error, field) {
							form[field].$setValidity('mongoose', false);
							$scope.errors[field] = error.message;
						});
					});
			}
		};

	});