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
define( [], function(){ return FavoriteDetailsComponent; } );

/**
 * Definition of the FavoriteDetails component
 * 
 * @name favoriteDetails
 * @module ssv.components
 * 
 */
var FavoriteDetailsComponent = {
    controller: [ '$scope', '$state', '$stateParams', 'alertService', 'AssemblySvc', 'SupplierSvc', 'FavoriteSvc', FavoriteDetailsCtrl],
    templateUrl: 'pages/ssv/components/favorite/favoriteDetails/favorite-details-tmpl.html'
};

/**
 * Controller for the FavoriteDetails component
 * 
 * @name FavoriteDetailsCtrl
 * @param {service} $state ui-router state management service
 * @param {service} $stateParams ui-router service to access URL/route parameters
 * @param {AlertService} alertService RefApp5 Alerting service
 * @param {AssemblySvc} AssemblySvc SSV Assembly service
 * @param {FavoriteSvc} FavoriteSvc SSV Assembly service
 */
function FavoriteDetailsCtrl( $scope, $state, $stateParams, alertService, AssemblySvc, SupplierSvc, FavoriteSvc ){
	
	/** @alias this */
    var ctrl = this;
    
    ctrl.partSelected = false;
    ctrl.selectedPart;
    ctrl.foundParts;
    
    /** Controller initializer @function @see onInit @public */    
    ctrl.$onInit = onInit;

    /** search for assemblies based on the search term  @function @see search @public */
    ctrl.searchAssemblies = searchAssemblies;
    
    /** search for a supplier based on the search term  @function @see search @public */
    ctrl.searchSuppliers = searchSuppliers;
    
    /** save the user's favorites @function @see save @public */
    ctrl.save = save;

    /** cancel saving the user's favorites @function @see cancelSave @public */
    ctrl.cancelSave = cancelSave;
    
    /** load the user's favorites @function @see loadFavorite @public */
    ctrl.loadFavorite = loadFavorite;

    $scope.onSelect = function ($item, $model, $label) {
    	ctrl.partSelected = true;
    	ctrl.selectedAssembly = $item;
    	ctrl.favorite.partNumber = $item.partNumber;
    	ctrl.favorite.partSite = $item.partSite;
    	ctrl.favorite.assemblyNumber = $item.assemblyNumber;
    	ctrl.favorite.assemblySite = $item.assemblySite;
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
    };
    
    /**
	 * Action when a user wants to find a part based on the search term provided
	 */
	function searchAssemblies(searchTerm){
		return AssemblySvc.findAssemblies(searchTerm, ctrl.selectedSupplier.name).then(function(results){
			return results;
		});
	}
	
    /**
	 * Action when a user wants to find a supplier based on the search term provided
	 */
	function searchSuppliers(searchTerm){
		return SupplierSvc.findSuppliers(searchTerm).then(function(results){
			return results;
		});
	}
	
    /**
	 * Action when a user cancel's the save; returns to the favorite-list state
	 * without save
	 */
	function cancelSave(){
		$state.go('app.favorite-list');
	}
	
	/**
	 * Action when a user saves the favorites; updates the REST service and returns to the favorite-list state
	 * uses the alerting service to display success/failure of the save
	 */
	function save(){
		if(ctrl.partSelected){
			ctrl.favorite.$update().then(function(result){
				alertService.add('success', 'Favorite has been sucessfully saved.', 4000);
				ctrl.form.$setPristine(true);
				$state.go('app.favorite-list');
			});
		}
	}
    
	/**
	 * Load all of the users favorites
	 */
	function loadFavorite(id){
		ctrl.favorite = null;
    	FavoriteSvc.fetch($stateParams.id).then(function(favorite){
    		ctrl.favorite = favorite;
			if(ctrl.favorite){
				ctrl.loaded = true;
			} else {
				$state.go( 'app.favorite-list', null, {reload: true} );
			}
    	});
	}
	
	/**
	 * Initialize the controller
	 */
    function onInit(){
        ctrl.favorite;    
        ctrl.loaded = false;
        ctrl.isAdd = false;
        ctrl.matchingAssemblies = [];
        ctrl.showNoMatchingAssembliesError = false;
        ctrl.selectedAssembly = null;
        ctrl.partSelected = true;

		if($stateParams.id){
			ctrl.loadFavorite($stateParams.id);
		} else {
			ctrl.partSelected = false;
			ctrl.isAdd = true;
			ctrl.loaded = true;
			ctrl.favorite = null;
			ctrl.favorite = FavoriteSvc.create();
		}
    }
}