define([ 'pages/ssv/services/ssv-services',
		'pages/ssv/components/ssv-components',
		'pages/ssv/ssv-config'],
		

function(ssvServices, ssvComponents, ssvConfig ) {
	var angular = require( 'angular' );	
	var ssv = angular.module('ssv', [ 'ssv.services', 'ssv.components' ]);

	ssv
	 .constant( 'SSVConfig', ssvConfig )	
	 .directive('vbox', vboxDirective )
	 .filter('camelCaseToHuman', camelCaseToHumanFilter )
	 .filter('charLimit', charLimitFilter )
	 .filter( 'mapped', mappedFilter );
	
	function charLimitFilter(){
		return function(input,limit) {
			if( !input || !angular.isString( input ) )
				return input;
			if( !limit ) limit = 30;
			var trunc = input.substr( 0, limit );
			if( input.length > limit ) trunc = trunc + "...";
			return trunc;
		};	
		
	}

	function camelCaseToHumanFilter(){
		return function(input) {
			if( !input || !angular.isString( input ) )
				return input;
			var result = input.replace( /([A-Z])/g, " $1" );
			var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
		
			
			return finalResult.replace(/([A-Z])\s(?=[A-Z]\b)/g, '$1');
		};	
	}

	function mappedFilter(){
		return function(input){
			return ( ssvConfig.attributeMap[input] )? ssvConfig.attributeMap[input] : input;
		}
	}

	function vboxDirective(){
		return {
			link : function(scope, element, attrs) {
				attrs.$observe('vbox', function(value) {
					element.get(0).setAttribute('viewBox', value);
				});
			}
		};	
	}

	return ssv;
});

