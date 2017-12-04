'use strict';

angular.module('writerboyApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'btford.socket-io',
        'ui.bootstrap',
        'popoverToggle',
        'ngAnimate',
        'validation.match',
        'ngQuill',
        'ngTable',
        'FBAngular',
        'ngToast',
        'angularMoment',
        'hm.readmore',
        'ngMaterial',
        'focus-if',
        'ngLodash',
        'ngFileUpload',
        'duScroll',
        // 'angular-lodash',
        'angulartics',
        'angulartics.google.analytics',
        'angular-ladda',
        'infinite-scroll',
        'focus-if'
    ])
    .config(function($routeProvider, $locationProvider, $httpProvider, $mdThemingProvider) {
        $routeProvider
            .otherwise({
                redirectTo: 'http://www.voltawriter.com/'
            });

        $locationProvider.html5Mode(true);
        $httpProvider.interceptors.push('authInterceptor');

        var voltaGreenMap = $mdThemingProvider.extendPalette('green', {
            '500': '2ecc71'
        });

        $mdThemingProvider.definePalette('voltaGreen', voltaGreenMap);

        $mdThemingProvider.theme('default')
            .dark()
            .primaryPalette('voltaGreen')
            .accentPalette('indigo')
    })
    .factory('authInterceptor', function($rootScope, $q, $cookies, $location) {
        return {
            // Add authorization token to headers
            request: function(config) {
                config.headers = config.headers || {};
                if ($cookies.get('token')) {
                    config.headers.Authorization = 'Bearer ' + $cookies.get('token');
                }
                return config;
            },

            // Intercept 401s and redirect you to login
            responseError: function(response) {
                if (response.status === 401) {
                    $location.path('/login');
                    // remove any stale tokens
                    $cookies.remove('token');
                    return $q.reject(response);
                } else {
                    return $q.reject(response);
                }
            }
        };
    })
    .run(function($rootScope, $location, Auth) {

        $rootScope.isOpen = true;
        // Redirect to login if route requires auth and the user is not logged in
        $rootScope.$on('$routeChangeStart', function(event, next) {
            if (next.authenticate) {
                Auth.isLoggedIn(function(loggedIn) {
                    if (!loggedIn) {
                        event.preventDefault();
                        $location.path('/login');
                    }
                });
            }
        });
    })
    .directive('sglclick', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                console.log('Hello from sglclick directive');
                var fn = $parse(attr['sglclick']);
                var delay = 300,
                    clicks = 0,
                    timer = null;
                element.on('click', function(event) {
                    console.log('clicked');
                    clicks++; //count clicks
                    if (clicks === 1) {
                        timer = setTimeout(function() {
                            scope.$apply(function() {
                                fn(scope, { $event: event });
                            });
                            clicks = 0; //after action performed, reset counter
                        }, delay);
                    } else {
                        clearTimeout(timer); //prevent single-click action
                        clicks = 0; //after action performed, reset counter
                    }
                });
            }
        };
    }]);

(function() {
    'use strict';
    angular
        .module('focus-if', [])
        .directive('focusIf', focusIf);

    focusIf.$inject = ['$timeout'];

    function focusIf($timeout) {
        function link($scope, $element, $attrs) {
            var dom = $element[0];
            if ($attrs.focusIf) {
                $scope.$watch($attrs.focusIf, focus);
            } else {
                focus(true);
            }

            function focus(condition) {
                if (condition) {
                    $timeout(function() {
                        dom.focus();
                    }, $scope.$eval($attrs.focusDelay) || 0);
                }
            }
        }
        return {
            restrict: 'A',
            link: link
        };
    }
})();
