define([], function() {
	return [ '$http', '$q', '$log', 'ENDPOINTS', FavoriteService ];
});

function FavoriteService($http, $q, $log, ENDPOINTS) {
	var URL = ENDPOINTS["ssv"] + "/favorite";
	
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
	 * Retrieve a list of Favorites for the current user
	 * 
	 * @returns {Array} collection of Favorites that result (empty array if no results)
	 */
	function query(){
		return $http.get(URL).then( function( response ){
			return wrap(response.data);
		});
	};
	
	var service = {
			create : Favorite,
			query : query,
			fetch : fetch,
			wrap : wrap
	};

	return service;
}