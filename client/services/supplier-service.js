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
define([], function() { return [ '$http', 'ENDPOINTS', SupplierService ]; });

var angular = require( 'angular' );

/**
 * Defines the SupplierService; This service is a factory for providing simple functions to query the REST service for supplier information
 * 
 * @name SupplierSvc
 * @module ssv.services
 *  
 * @param {service} $http AngularJS service to access REST services
 * @param {constants} ENDPOINTS RefApp5 constants for system endpoints
 */
function SupplierService($http, ENDPOINTS) {
	/** @var Base URL for the Supplier REST Service */
	var URL = ENDPOINTS["ssv"] + "/supplier";

	/**
	 * Finds a list of suppliers based on the search term provided
	 * 
	 * @param {string} search
	 * @returns an array of supplier names that match the search term; empty array if no match
	 */
	function findSuppliers(searchTerm){
		var reqURL = URL + "/?name=" + searchTerm;
		return $http.post( reqURL).then( function(results){
			return results.data;
		});
	};

	/** @var service Definition of the exposed service methods */
	var service = {
		
		/** Finds a list of suppliers based on the search term provided @function @see findParts @public */
		findSuppliers : findSuppliers
	};

	return service;
};