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
define( [], function(){ return FavoriteListComponent; } );

var angular = require('angular');

/**
 * Definition of the FavoriteList component
 * 
 * @name favoriteList
 * @module ssv.components
 * 
 */
var FavoriteListComponent = {
    controller: [ '$state', 'FavoriteSvc', FavoriteListCtrl],
    templateUrl: 'pages/ssv/components/favorite/favoriteList/favorite-list-tmpl.html'
};

/**
 * Controller for the FavoriteList component
 * 
 * @name FavoriteListCtrl
 * @param {service} $state ui-router state management service
 * @param {FavoriteSvc} FavoriteSvc SSV Assembly service
 */
function FavoriteListCtrl( $state, FavoriteSvc ){
	
	/** @alias this */
    var ctrl = this;

    /** Controller initializer @function @see onInit @public */    
    ctrl.$onInit = onInit;
    
    /** Action for deleting a favorite @function @see deleteFavorite @public */
    ctrl.deleteFavorite = deleteFavorite;
    
    /**
     * Initialize the controller
     */
    function onInit(){
        ctrl.loaded = false;
        ctrl.favorites = [];

        FavoriteSvc.query().then(function(favorites){
    		ctrl.favorites = favorites;
    		ctrl.loaded = true;
    	});
    }
    
    /**
     * Delete the specified favorite
     * 
     * @param {Favorite} favorite to delete via the REST service
     */
    function deleteFavorite(favorite){
    	favorite.$delete().then(function(){
        	angular.forEach( ctrl.favorites, function(eachFavorite, index){
        		if(eachFavorite.id === favorite.id){
        			ctrl.favorites.splice(index, 1);
        		}
        	});
    	});
    }
}