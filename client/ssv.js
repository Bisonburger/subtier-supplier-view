/* RAYTHEON PROPRIETARY
 * 
 * 
 * Company Name: Raytheon Company Address 1151 E. Hermans Road, Tucson, AZ. 85706
 * 
 * Unpublished work Copyright 2016 Raytheon Company.
 * 
 * Contact Methods: RMS
 * 
 * This document contains proprietary data or information pertaining to items, or components, or processes, or other matter developed or acquired at
 * the private expense of the Raytheon Company and is restricted to use only by persons authorized by Raytheon in writing to use it. Disclosure to
 * unauthorized persons would likely cause substantial competitive harm to Raytheon's business position. Neither said document nor said technical data
 * or information shall be furnished or disclosed to or copied or used by persons outside Raytheon without the express written approval of Raytheon.
 * 
 * This Proprietary Notice Is Not Applicable If Delivered To The US Government
 */

define([ 'pages/ssv/services/ssv-services',
		'pages/ssv/components/ssv-components',
		'pages/ssv/ssv-config'],

/**
 * Define and register an angular module for ssv and create dependencies on the required services/components;
 * creates some basic filters and directives to be used throughout
 * 
 * @module ssv
 * @name ssv
 * 
 */		
function(ssvServices, ssvComponents, ssvConfig ) {
	
	var angular = require( 'angular' );
	
	var ssv = angular.module('ssv', [ 'ssv.services', 'ssv.components' ]);

	ssv
	 .constant( 'SSVConfig', ssvConfig )	
	 .directive('vbox', vboxDirective )
	 .filter('camelCaseToHuman', camelCaseToHumanFilter )
	 .filter('charLimit', charLimitFilter )
	 .filter( 'mapped', mappedFilter );
	
	/**
	 * Angular filter to limit the number of characters of the input
	 * 
	 * @name charLimit
	 * @param {string} input value to filter
	 * @param {number} [limit=30] characters to limit the output to
	 * @return {string} input limited to limit characters; if over the limit, only limit characters are output, followed by ... 
	 */
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

	/**
	 * Angular filter to convert from camel case to a human readable format
	 * 
	 * For example:
	 * 	abcDef is converted to Abc Def
	 *  aBCd is converted to AB Cd (i.e. successive single capitals dont get a space)
	 * 
	 * If there is a displayName in the ssvConfig constants, no conversion is performed
	 * 
	 * @name camelCaseToHuman
	 * @param {string} input value to filter
	 * @return {string} converted values 
	 */
	function camelCaseToHumanFilter(){
		return function(input) {
			if( !input || !angular.isString( input ) || (ssvConfig[input] && ssvConfig[input].displayName) )
				return input;
			var result = input.replace( /([A-Z])/g, " $1" );
			var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
		
			
			return finalResult.replace(/([A-Z])\s(?=[A-Z]\b)/g, '$1');
		};	
	}

	/**
	 * Angular filter to fetch a mapped value for an attribute (if one exists)
	 * 
	 * @name mapped
	 * @param {string} input value to filter
	 * @return {string} displayValue for the input from ssvConfig constants if one exists, otherwise the input value 

	 */
	function mappedFilter(){
		return function(input){
			return ( ssvConfig[input] && ssvConfig[input].displayName)? ssvConfig[input].displayName : input;
		};
	}

	/**
	 * Angular directive to set the value for viewBox - Angular's jQuery wrapper can't handle camel case attributes
	 * 
	 * @name vbox
	 */
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

