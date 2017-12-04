'use strict';

angular.module('writerboyApp')
    .controller('SignupNavbarCtrl', function($scope, $location, Auth) {
        $scope.menu = [];

        $scope.showSignin = false;

        $scope.isCollapsed = true;
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;
        console.log('current route: ', $location.path());
        if ($location.path() === '/' || $location.path() === '/login') {
            $scope.inLogin = true;
        } else {
            $scope.inLogin = false;
        }
    });
