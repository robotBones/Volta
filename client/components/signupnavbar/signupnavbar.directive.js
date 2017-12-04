'use strict';

angular.module('writerboyApp')
  .directive('signupnavbar', function () {
    return {
      templateUrl: 'components/signupnavbar/signupnavbar.html',
      restrict: 'E',
      controller: 'SignupNavbarCtrl'
    };
  });
