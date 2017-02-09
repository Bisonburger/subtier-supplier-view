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
define( [], function(){ return BomFilterComponent; } );

var angular = require('angular');

/**
 * Definition of the BomFilter component
 * 
 * @name bomFilter
 * @module ssv.components
 * 
 */
var BomFilterComponent = {
    controller: ['$rootScope', 'SSVConfig', 'LocalStorageSvc', BomFilterCtrl],
    templateUrl: 'pages/ssv/components/bomFilter/bom-filter-tmpl.html'
};

/**
 * Controller for the BomFilter component
 * 
 * @name BomFilterController
 * @param {service} $rootScope AngularJS rootScope service
 * @param {SSVConfig} ssvConfig SSV configuration constants
 * 
 */
function BomFilterCtrl($rootScope,ssvConfig,$localStorage){
	/** @alias this */
	var ctrl = this;
	
	ctrl.localMaterialFilters = [];
	ctrl.localSupplierFilters = [];
	ctrl.filters = [];
    
    /** Controller initializer @function @see onInit @public */
    ctrl.$onInit = onInit;

    /** Applies a filter change by broadcasting the bomFilterChanged event @function @see applyFilterChange @public */
    ctrl.applyFilterChange = applyFilterChange;

    /** Create a new filter @function @see newFilter @public */
    ctrl.newFilter = newFilter;
    
    /** Remove the currentFilter @function @see removeFilter @public */
    ctrl.removeFilter = removeFilter;    
    
    /** Toggle active state for the currentFilter @function @see changeFilterActive @public */
    ctrl.changeFilterActive = changeFilterActive;
    
    ctrl.mappedFn = mapped;
    
    /** Clears the local storage @function @see clearFilterStorage @public */
    ctrl.clearFilterStorage = clearFilterStorage;
        
    /**
     * Initializer for the BomFilter controller, called as part of the ON-INIT lifecycle hook
     * 
     * @private
     */
    function onInit(){    	
    	ctrl.localMaterialFilters = ($localStorage.get( 'ssv-material-filters' ) != 'undefined' && $localStorage.get( 'ssv-material-filters' ) != null) ? JSON.parse($localStorage.get( 'ssv-material-filters' )) : [];
    	ctrl.localSupplierFilters = ($localStorage.get( 'ssv-supplier-filters' ) != 'undefined' && $localStorage.get( 'ssv-supplier-filters' ) != null) ? JSON.parse($localStorage.get( 'ssv-supplier-filters' )) : [];
    	    	
    	ctrl.filters = ctrl.localMaterialFilters;
    	ctrl.currentFilter = null;
    	if( !ctrl.filters || ctrl.filters.length === 0 ) newFilter(); // we'll add one filter
    	ctrl.currentFilter = ctrl.filters[ ctrl.filters.length - 1 ];
    	ctrl.selectedColor = '#7bd148';
    	ctrl.selectType = 'highlight';
    	ctrl.attrValues = {};
    	ctrl.isMaterialView = true;
    	
    	ctrl.attrMaterial = [];
    	ctrl.attrSupplier = [];
    	
		angular.forEach( Object.keys( ssvConfig ), function( attribute ){ 
			if( ssvConfig[attribute].supplierView && !ssvConfig[attribute].noFilter )
				ctrl.attrSupplier.push( attribute );
			if( ssvConfig[attribute].materialView && !ssvConfig[attribute].noFilter)
				ctrl.attrMaterial.push( attribute );
		});
		
		ctrl.attributes = ctrl.attrMaterial;
    	
    	ctrl.partNumber = null;
    	$rootScope.$on('bomTreeRootChanged', _handleChangedRoot);
    	$rootScope.$on('sideNavShow', _onShow );
    	$rootScope.$on('sideNavHide', _onHide );
    	$rootScope.$on('bomTreeConfigChanged', _handleChangedConfig);
    }
    
    function clearFilterStorage(){
    	$localStorage.clear();
    }
    
    function mapped(input){
    	return (ssvConfig[input] && ssvConfig[input].displayName)? ssvConfig[input].displayName : input;
    }
        
    /**
     * Handler for the sideNavShow event
     * 
     * @private
     */
    function _onShow(){
    	if( !ctrl.filters || ctrl.filters.length < 1 ){
    		newFilter(); // make sure we always have a filter ready...    		
    	}
    	ctrl.currentFilter = ctrl.filters[ ctrl.filters.length - 1 ];
    }
    
    /**
     * Handler for the sideNavHide event
     * 
     * @private
     */
    function _onHide(){
    	applyFilterChange(); // apply any changes we may have...
    }
    
    
    /**
     * Applies a filter change by broadcasting the bomFilterChanged event
     */
    function applyFilterChange(){
    	if( ctrl.filterForm && !ctrl.filterForm.$submitted ){
    		
    		$rootScope.$broadcast( 'bomFilterChanged', ctrl.filters? ctrl.filters : [] );
    		if( ctrl.isMaterialView ){ ctrl.localMaterialFilters = ctrl.filters; }
    		else{ ctrl.localSupplierFilters = ctrl.filters; }
    		    		
    		$localStorage.set( 'ssv-material-filters', JSON.stringify(ctrl.localMaterialFilters) );
    		$localStorage.set( 'ssv-supplier-filters', JSON.stringify(ctrl.localSupplierFilters) );
    	}
    }
    
    /**
     * Fetches all the values for a particular attribute as found from the specified root down
     * 
     * @param {Assembly} root node/assembly to fetch values from
     * @param {string} attr attribute name to fetch values for
     * @return {Object[]} array of distinct values for the attribute as found in the tree starting with root
     */
	    function _fetchAllValuesForAttribute(root, attr) {
		if (!root || !attr){
			return;
		}
		
		if (!ctrl.attrValues[attr]){
			ctrl.attrValues[attr] = [];			
		}

		if (root[attr]) {
			var idx = ctrl.attrValues[attr].indexOf(root[attr]);
			if (idx < 0)
				ctrl.attrValues[attr].push(root[attr]);
		}

		if (root.children && root.children.length > 0){
			angular.forEach(root.children, function(child) {
				_fetchAllValuesForAttribute(child, attr);
			});			
		}
		
		if (root._children && root._children.length > 0){
			angular.forEach(root._children, function(child) {
				_fetchAllValuesForAttribute(child, attr);
			});			
		}
	}
    
    /**
	 * Event handler for the bomTreeRootChanged event
	 * 
	 * @private
	 * @param {Event}
	 *            event Event object that triggered the handler
	 * @param {{assembly:Assembly}}
	 *            opts The data passed with the event
	 */
    function _handleChangedRoot( event, opts ){
    	angular.forEach( ctrl.attrMaterial, function(attr){
    		_fetchAllValuesForAttribute( opts.assembly, attr );
    		_addFilterAttributes(attr);
    	});    	
    	angular.forEach( ctrl.attrSupplier, function(attr){ 
    		_fetchAllValuesForAttribute( opts.assembly, attr );
    		_addFilterAttributes(attr);
    	});
    }
    
    /**
     * For the selected attribute loop over filters and check if the filter is currently selected
     * 
     * @private
     * @param {String} attr The attribute to check against filters
     */
    function _addFilterAttributes(attr){
    	this.attr = attr;
		angular.forEach(ctrl.filters, function(filter){
			angular.forEach(filter.selected, function(value, key){
				if((key == this.attr) && value != "" && typeof value != 'undefined'){
					_addFilterOption(key, value);
				}
			}, this);
		}, this);
    }
    
    function _addFilterOption(attr, value){
    	var found = false;
    	
    	angular.forEach(ctrl.attrValues[attr], function(attrValue){
    		if(attrValue == value){
    			found = true;
    		}
    	});
    	
    	if(!found){
    		ctrl.attrValues[ attr ].push( value);	
    	}
    }
    
    /**
     * Event handler for the bomTreeConfigChanged event
     * 
     * @private
     * @param {Event} event Event object that triggered the handler
     * @param {{isMaterialView:boolean}} opts The data passed with the event
     */
    function _handleChangedConfig( event, opts ){
    	if( opts.isMaterialView != ctrl.isMaterialView ){
    		if( opts.isMaterialView ){
    			ctrl.localSupplierFilters = ctrl.filters;
    		} else {
    			ctrl.localMaterialFilters = ctrl.filters;
    		}
    		
    		ctrl.isMaterialView = opts.isMaterialView;
    		ctrl.attributes = (ctrl.isMaterialView)? ctrl.attrMaterial : ctrl.attrSupplier;
    		ctrl.filters = (ctrl.isMaterialView)? ctrl.localMaterialFilters : ctrl.localSupplierFilters;
    		
    		if( !ctrl.filters || ctrl.filters.length === 0 ){
    			newFilter();
    		} else {
    			ctrl.currentFilter = ctrl.filters[ ctrl.filters.length - 1 ];
    		}
    	}
    }
    
    /**
     * Create a new filter
     */
    function newFilter(){
    	ctrl.filters.push({ name: 'Filter ' + (ctrl.filters.length + 1), 
    			       active: false, 
    			       selected: {}, 
    			       partNumber: null, 
    			       selectedColor: '#7bd148', 
    			       selectType: 'highlight'
    			     });
    	ctrl.currentFilter = ctrl.filters[ ctrl.filters.length - 1 ];
    }
    
    /**
     * Remove the currentFilter (as defined by ctrl.currentFilter)
     */
    function removeFilter(){
    	
    	var idx = -1;
    	angular.forEach( ctrl.filters, function(filter,index){ if( filter === ctrl.currentFilter ) idx = index; });
    	if( idx >=0 ){ 
    		ctrl.filters.splice( idx,1 );    	   
    		ctrl.currentFilter = (ctrl.filters.length >= 0 )? ctrl.filters[0] : null;
    		applyFilterChange();
    	}
    }
    
    /**
     * Toggles the active state of the currentFilter (as defined by ctrl.currentFilter)
     */
    function changeFilterActive(){
    	ctrl.currentFilter.active = !ctrl.currentFilter.active;
    	applyFilterChange();
    }
}