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
define([], function() { return [ '$http', 'ENDPOINTS', FavoriteService ]; });

var angular = require('angular');

/**
 * Defines the FavoriteService; This service is a factory for creating Favorite objects
 * and provides simple functions to query the REST service for Favorites
 * 
 * @name FavoriteSvc
 * @module ssv.services
 *  
 * @param {service} $http AngularJS service to access REST services
 * @param {constants} ENDPOINTS RefApp5 constants for system endpoints
 */
function FavoriteService($http, ENDPOINTS) {
	
	/** @var Base URL for the Favorite REST Service */
	var URL = ENDPOINTS["ssv"] + "/favorite";
	
    /**
     * Constructor for a Favorite object
     * Favorite objects maintain data and functionality for a user's favorite selection
     * 
     * @constructor
     * @param {Object} [opts] Parent/base class/data for a Favorite Object
     */
	function Favorite(opts){
		// required fields (default)
		// overridden by opts if present		
		this.id = null;
		this.inactiveDate = null;
		this.lastUpdatedDate = Date.now();
		this.lastUpdatedBy = null;
		this.createdBy = null;
		this.createdDate = Date.now();
		this.partNumber = null;
		this.partSite = null;
		this.assemblyNumber = null;
		this.assemblySite = null;
		this.description = null;
		
		angular.extend( this, opts );
		
		/**
		 * Save a new Favorite
		 * 
		 * @returns {Promise | Favorite} the promise then upon resolve a Favorite with the id now filled
		 */
		this.$save = function(){
			this.id = null;
			return $http.post( URL, this ).then( function(results){ 
				this.id = results.data.id;
				return this;
			});
		};
		
		/**
		 * Update the given Favorite via REST PUT if the ID isn't set, calls save instead
		 * 
		 * @returns {Favorite} updated Favorite
		 */
		this.$update = function(){
			var favorite = this;
			var reqURL =   URL + "/" + favorite.id;
			
			if( favorite.id === undefined || favorite.id === null ){
				return favorite.$save();
			} else {
				return $http.put( reqURL, favorite ).then( function(){					
					return favorite;
				});
			}
		};
		
		/**
		 * Delete a Favorite
		 */
		this.$delete = function(){
			return $http['delete'](URL+'/'+this.id);
		};
		
		return this;
	}
	
	
	/**
	 * Helper method to wrap JSON objects with Favorite functions
	 * 
	 * @param {Array|Object} obj - JSON object(s) to wrap - works with either one or an array 
	 * @returns {Array|Favorite} collection of Favorite objects with wrapped objects 
	 */
	function wrap( obj ){
		var favoriteArray = [];
		if(angular.isArray(obj))
			favoriteArray = obj;
		else
			favoriteArray.push(obj);
		
		return favoriteArray.map( function( element ){
			return (element && angular.isFunction(element.$save)) ? element : new Favorite( element );
		} );				
	}
	
	/**
	 * Fetch a favorite by ID
	 * 
	 * @param {string} id - object ID/GUID to match on
	 * @returns {Favorite} matching Favorite or empty object if no match
	 */
	function fetch( id ){
		var reqURL =   URL + "/" + id;
		return $http.get(reqURL).then( function( response ){
			return (response.data.id === id )? new Favorite( response.data ) : {};
		});
	}
	
	/**
	 * Fetch a favorite by ID
	 * 
	 * @param {string} id - object ID/GUID to match on
	 * @returns {Favorite} matching Favorite or empty object if no match
	 */
	function saveFavorite( assembly ){
		var reqURL =   URL + "/" + id;
		return $http.get(reqURL).then( function( response ){
			return (response.data.id === id )? new Favorite( response.data ) : {};
		});
	}
	
	/**
	 * Retrieve a list of Favorites for the current user
	 * 
	 * @returns {Array} collection of Favorites that result (empty array if no results)
	 */
	function query(){
		return $http.get(URL).then( function( response ){
			return wrap(response.data);
		});
	};
	
	/** @var service Definition of the exposed service methods */
	var service = {
			/** create a Favorite @function @see Favorite @public */ 
			create : Favorite,
			
			/** Fetch all Favorites @function @see query @public */ 			
			query : query,
			
			/** Fetch a Favorite by id @function @see fetch @public */ 
			fetch : fetch,
			
			/** Helper function to wrap raw data as a Favorite @function @see wrap @public */ 
			wrap : wrap
	};

	return service;
}