'use strict';

angular.module('writerboyApp')
.config(function ($provide) {
  $provide.decorator('mdInputContainerDirective', function ($delegate, $timeout) {
    // decorate the $delegate
    var directive = $delegate[0];

    directive.compile = function() {
      return {
        post: function($scope, element, attr, ctrl) {
          if (ctrl.input[0].type === 'email') {
            $timeout(function() {
              if (ctrl.input.parent()[0].querySelector('input:-webkit-autofill')) {
                ctrl.element.addClass('md-input-has-value');
              }
            }, 100);
          }
        }
      };
    };
    return $delegate;
  });
});
