'use strict';

angular.module('writerboyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard/projects', {
        templateUrl: 'app/dashboard/projects/projects.html',
        controller: 'ProjectsCtrl'
      });
  });
