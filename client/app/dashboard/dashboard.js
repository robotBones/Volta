'use strict';

angular.module('writerboyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardCtrl'
      })
      .when('/dashboard/new/:projectid?', {
        templateUrl: 'app/dashboard/newdocument/newdocument.html',
        controller: 'NewdocumentCtrl'
      })
      .when('/dashboard/edit/:id', {
        templateUrl: 'app/dashboard/editdocument/editdocument.html',
        controller: 'EditdocumentCtrl'
      });
  });
