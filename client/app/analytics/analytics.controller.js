'use strict';

angular.module('writerboyApp')
    .controller('AnalyticsCtrl', function($scope, $http, NgTableParams) {
        $scope.message = 'Hello';
        $scope.authed = false;
        console.log('Hello from AnalyticsCtrl');
        $scope.user = {
            username: '',
            password: ''
        };
        $scope.login = function() {
            $http.post('/api/chapters/count', $scope.user)
                .then(function(payload) {
                    $scope.authed = true;
                    console.log(payload.data);
                    $scope.tableParams = new NgTableParams({
                        count: 1000
                    }, {
                        data: payload.data,
                        counts: []
                    });
                }, function(err) {
                    console.log(err);
                    if (err.status === 403) {
            			sweetAlert('Hmm...', 'Please provide the correct credentials.', 'info');
                    }
                });
        };
    });
