/*
 * RequireJS configuration for the Karma tests
 *  
 */

// initialize the set of tests we want...
var tests = [];
for (var file in window.__karma__.files) {
  if (/\-spec\.js$/.test(file)) {
    if(!(/e2e/.test(file)) )
      tests.push(file);
  }
}

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  // a bit confusing (and even moreso if you read the documentaiton but
  // /base => karma.config.js file's baseUrl
  baseUrl: '/base',

  // dynamically load all test files
  deps: tests,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start,

  paths: {
    //3rd party resources
    // relative to the Karma basepath
    'jquery': 'pages/ssv/tests/unit/node_modules/jquery/dist/jquery.min',
    'angular': 'pages/ssv/tests/unit/node_modules/angular/angular.min',
    'angular-mocks': 'pages/ssv/tests/unit/node_modules/angular-mocks/angular-mocks',
    'angular-animate': 'pages/ssv/tests/unit/node_modules/angular-animate/angular-animate.min',
    'ui-bootstrap': 'pages/ssv/tests/unit/node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.min',
    'angular-ui-router': 'pages/ssv/tests/unit/node_modules/angular-ui-router/release/angular-ui-router.min',
    'bootstrap': 'pages/ssv/tests/unit/node_modules/bootstrap/dist/js/bootstrap.min',
    'd3': 'pages/ssv/tests/unit/node_modules/d3/d3.min',
    'ngSidebar': 'js/angularjs-directives/ngSidebar',
    'ngColorPicker': 'js/angularjs-directives/ngColorPicker',
    'ssv': 'pages/ssv/ssv',
  },
  shim: {
    'ssv': {
      deps: ['angular-animate', 'ui-bootstrap', 'bootstrap', 'angular-ui-router', 'd3', 'ngSidebar', 'ngColorPicker'],
      exports: 'ssv'
    },
    'angular-animate': {
      deps: ['angular']
    },
    'angular': {
      deps: ['jquery'],
      exports: 'angular'
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'ui-bootstrap': {
      deps: ['angular', 'bootstrap']
    },
    'ngSidebar': {
      deps: ['angular-animate', 'ui-bootstrap']
    },
    'ngColorPicker': {
      deps: ['angular-animate', 'ui-bootstrap']
    },
    'd3': {
      exports: 'd3'
    },
    'angular-ui-router': {
      deps: ['angular']
    },
    'angular-mocks': {
      deps: ['angular']
    }
  }

});
