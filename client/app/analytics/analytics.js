'use strict';

angular.module('writerboyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/analytics', {
        templateUrl: 'app/analytics/analytics.html',
        controller: 'AnalyticsCtrl'
      });
  });
