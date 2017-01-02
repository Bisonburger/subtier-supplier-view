/* global requirejs angular */

requirejs.config({
	baseUrl : '',
	waitSeconds: 60,
	paths : {
		//3rd party resources
		'jquery': 'jquery/jquery.min',
		'angular' : 'angular/angular.min',
		'angular-animate' : 'angular-animate/angular-animate.min',
		'ui-bootstrap' : 'angular-ui-bootstrap/ui-bootstrap-tpls.min',
		'angular-ui-router': 'angular-ui-router/angular-ui-router.min',
		'bootstrap' : 'bootstrap/js/bootstrap.min',
		'd3': 'd3/d3.min', 
		'ngSidebar': 'directives/ngSidebar',
		'ngColorPicker': 'directives/ngColorPicker',
		'ssv': 'ssv',
		'ssv-init': 'ssv-init'
	},
	shim : {
		'ssv-init': {
			deps: [ 'ssv' ]	
		},
		'ssv' : {
			deps : [ 'angular-animate', 'ui-bootstrap', 'bootstrap', 'angular-ui-router', 'd3', 'ngSidebar', 'ngColorPicker'],
			exports: 'ssv'
		},
		'angular-animate': {
			deps: [ 'angular' ]
		},
		'angular':{
			deps: ['jquery'],
			exports: 'angular'
		},
		'bootstrap':{
			deps: [ 'jquery' ]
		},
		'ui-bootstrap' : {
			deps : [ 'angular', 'bootstrap' ]
		},
		'ngSidebar': {
			deps: ['angular-animate','ui-bootstrap']
		},
		'ngColorPicker': {
			deps: ['angular-animate','ui-bootstrap']
		},
		'd3':{
			exports: 'd3'
		},
		'angular-ui-router':{
			deps: ['angular']
		}
	}
});

requirejs.onError = function (err) {
 	console.log( err );
};

requirejs(['ssv','ssv-init'], function() {
	angular.bootstrap(document, [ 'ssv' ]);
});
