/*
 * RAYTHEON PROPRIETARY
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

define([], function(){ return [ '$window', LocalStorageService ]; });

function LocalStorageService($window){
	var service = this;	
	var PREFIX = 'RTN-LOCAL:'; // unique prefix for all keys to assure we don't step on other key/values
	
	service.get = get;
	service.set = set;
	service.clear = clear;
	service.keys = keys;
	
	/**
	 * Retrieve the key's value or all key/value pairs
	 * 
	 * @param {String} key - optional key to retrieve value for
	 * @returns {Object | Hash} - if key is supplied, returns the value (if any) for that key,
	 * 						      otherwise, returns a hash of key/value pairs stored
	 */
	function get(key){
		if( key )
			return $window.localStorage.getItem( PREFIX + key);
		else{
			var hash = {};
			var keys = service.keys();
			angular.forEach( keys, function(key){ hash[ key ] = service.get( key );	});
			return hash;
		}
	}
	
	/**
	 * Sets the key with the given value (overwrites the value if it exists)
	 * 
	 * @param {String} key to set the value of (can't be null)
	 * @param {Object} value to associate with the key (may be null)
	 */
	function set( key, value ){
		if( key ) $window.localStorage.setItem( PREFIX + key, value );
	}
	
	/**
	 * Removes the key/value pair (if they exist) from storage, if no key is supplied
	 * removes all key/value pairs (for this service) from storage
	 * 
	 * @param {String} key to remove - optional (if not supplied clears all)
	 */
	function clear( key ){
		if( key ){
			$window.localStorage.removeItem( PREFIX + key );
		}
		else{
			var keys = service.keys();
			angular.forEach( keys, function(key){ service.clear(key); } );
		}
	}
	
	/**
	 * Retrieve all keys stored in the localStore
	 * 
	 *  @returns {Array} list of keys in the localStore (empty list if none)
	 */
	function keys(){
		var keys = [];
		for( var idx =0; idx < $window.localStorage.length; idx++ ){
			var str = $window.localStorage.key(idx);
			if( str.indexOf( PREFIX ) > -1 ){
				var key = $window.localStorage.key(idx);
				if( key ){ 
					key = str.substring(PREFIX.length);
					keys.push(key);
				}
			}
		}
		return keys;
	}
};

LocalStorageService.prototype = Object.create( {}, {
	
	/**
	 * Number of items in the local store
	 * 
	 * @readonly
	 */
	length: { get: function(){ return this.keys().length; }}
});
