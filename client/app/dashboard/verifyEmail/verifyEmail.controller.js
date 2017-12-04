'use strict';

angular.module('writerboyApp')
    .controller('VerifyEmailCtrl', function($scope, $routeParams, $http, $location, $uibModal, $mdToast, Auth, $rootScope) {
        $scope.message = 'Hello';
        console.log('Email: ', $routeParams.email);
        console.log('Token: ', $routeParams.token);
        $http.post('/api/users/verify', {
                email: $routeParams.email,
                token: $routeParams.token
            })
            .then(function(payload) {
                if (payload.status === 203) {
                    Auth.getCurrentUser().verified = 'true';
                    $location.path('/login');
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('Account verified!')
                        .position("right")
                        .hideDelay(3000)
                    );
                } else {
                    console.log('Failed');
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'app/dashboard/modals/resendVerifyToken/resendVerifyToken.html',
                        controller: 'resendVerifyTokenCtrl',
                        size: 'md',
                        resolve: {
                            email: function() {
                                return $routeParams.email;
                            }
                        }
                    });
                    modalInstance.result.then(function() {}, function() {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                }
            });
    });
