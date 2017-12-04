'use strict';

angular.module('writerboyApp')
  .directive('sidebar', function () {
    return {
      templateUrl: 'components/sidebar/sidebar.html',
      restrict: 'EA',
      controller: 'SidebarCtrl'
    };
  });
