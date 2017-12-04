'use strict';

angular.module('writerboyApp')
	.directive('header', function () {
		return {
			templateUrl: 'components/header/header.html',
			restrict: 'EA',
			controller: 'HeaderCtrl'
				/*
				link: function (scope, element, attrs) {
					console.log(scope.sbModal);
					console.log(scope.sbResult);
				}*/
		};
	});
