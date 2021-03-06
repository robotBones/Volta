// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'chai', 'sinon-chai', 'chai-as-promised', 'chai-things'],

    client: {
      mocha: {
        timeout: 5000 // set default mocha spec timeout
      }
    },

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'client/bower_components/jquery/dist/jquery.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/bower_components/angular-cookies/angular-cookies.js',
      'client/bower_components/angular-resource/angular-resource.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/angular-socket-io/socket.js',
      'client/bower_components/angular-validation-match/dist/angular-validation-match.min.js',
      'client/bower_components/lodash/dist/lodash.compat.js',
      'client/bower_components/quill/dist/quill.js',
      'client/bower_components/angular-fullscreen/src/angular-fullscreen.js',
      'client/bower_components/ngQuill/src/ng-quill.js',
      'client/bower_components/angular-xeditable/dist/js/xeditable.js',
      'client/bower_components/moment/moment.js',
      'client/bower_components/angular-moment/angular-moment.js',
      'client/bower_components/ng-table/dist/ng-table.min.js',
      'client/bower_components/angular-animate/angular-animate.js',
      'client/bower_components/ngToast/dist/ngToast.js',
      'client/bower_components/angular-popover-toggle/popover-toggle.js',
      'client/bower_components/angular-read-more/dist/readmore.min.js',
      'client/bower_components/angular-aria/angular-aria.js',
      'client/bower_components/angular-messages/angular-messages.js',
      'client/bower_components/angular-material/angular-material.js',
      'client/bower_components/ng-focus-if/focusIf.js',
      'client/bower_components/ng-lodash/build/ng-lodash.js',
      'client/bower_components/ng-file-upload/ng-file-upload.js',
      'client/bower_components/angular-scroll/angular-scroll.js',
      'client/bower_components/angular-lodash/angular-lodash.js',
      'client/bower_components/sweetalert/dist/sweetalert.min.js',
      'client/bower_components/SHA-1/sha1.js',
      'client/bower_components/angulartics/src/angulartics.js',
      'client/bower_components/angulartics-google-analytics/lib/angulartics-google-analytics.js',
      'client/bower_components/spin.js/spin.js',
      'client/bower_components/ladda/dist/ladda.min.js',
      'client/bower_components/angular-ladda/dist/angular-ladda.min.js',
      'client/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
      'client/bower_components/raven-js/dist/raven.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'node_modules/socket.io-client/socket.io.js',
      'client/app/app.js',
      'client/app/**/*.js',
      'client/components/**/*.js',
      'client/app/**/*.jade',
      'client/components/**/*.jade',
      'client/app/**/*.html',
      'client/components/**/*.html'
    ],

    preprocessors: {
      '**/*.jade': 'ng-jade2js',
      '**/*.html': 'html2js',
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    ngJade2JsPreprocessor: {
      stripPrefix: 'client/'
    },



    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // reporter types:
    // - dots
    // - progress (default)
    // - spec (karma-spec-reporter)
    // - junit
    // - growl
    // - coverage
    reporters: ['spec'],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
