'use strict';

angular.module('writerboyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/verify/:email/:token', {
        templateUrl: 'app/dashboard/verifyEmail/verifyEmail.html',
        controller: 'VerifyEmailCtrl'
      });
  });
