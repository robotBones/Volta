'use strict';

angular.module('writerboyApp')
    .controller('ShareViewCtrl', function($scope, Auth, $routeParams, $http, $window) {
        if (Auth.isLoggedIn() && Auth.getCurrentUser().email === $routeParams.email) {
            //show doc
        } else {
            $http.post('/api/chapters/getShared', {
                    chapter: $routeParams.chapter,
                    email: $routeParams.email
                })
                .then(function(payload) {
                    console.log(payload);
                    if (payload.status === 204) {
                    	$window.location.href = 'http://www.voltawriter.com/';
                    } else if (payload.status === 201) {
                    	$scope.chapter = payload.data.chapter;
                    	$scope.writer = payload.data.writer;
                    }
                }, function (err) {
                	console.log(err);
                	$window.location.href = 'http://www.voltawriter.com/';
                });
        }
    });
