'use strict';

angular.module('writerboyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/garbage', {
        templateUrl: 'app/garbage/garbage.html',
        controller: 'GarbageCtrl'
      });
  });
