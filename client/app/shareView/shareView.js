'use strict';

angular.module('writerboyApp')
    .config(function($routeProvider) {
        $routeProvider
            .when('/share/:email/:chapter', {
                templateUrl: 'app/shareView/shareView.html',
                controller: 'ShareViewCtrl'
            });
    });
