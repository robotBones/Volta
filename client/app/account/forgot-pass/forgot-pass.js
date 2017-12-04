'use strict';

angular.module('writerboyApp')
    .config(function($routeProvider) {
        $routeProvider
            .when('/forgot-pass', {
                templateUrl: 'app/account/forgot-pass/forgot-pass.html',
                controller: 'ForgotPassCtrl'
            });
    });
