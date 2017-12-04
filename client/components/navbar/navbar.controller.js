'use strict';

angular.module('writerboyApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'HOME',
      'link': '/'
    },
    {
      'title': 'PRODUCT',
      'link': '#product'
    },
    {
      'title' : 'ABOUT',
      'link': '#story'
    },
    {
      'title' : 'DONATE',
      'link': 'https://voltawriter.dntly.com/campaign/1450#/'
    },
    {
      'title' : 'ANNEX',
      'link': 'http://writerboyannex.storenvy.com/'
    },
    {
      'title' : 'BLOG',
      'link': 'http://holycannoliitswriterboy.tumblr.com/'
    }];

    $scope.showSignin = false;

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.isActive = function(route) {
      if (route !== '/login')
      {
          $scope.showSignin = true;
      }
      return route === $location.path();

    };
  });
