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
define([], function() {return BOMTreeConfigComponent;});

var angular = require('angular');

/**
 * Definition of the BOMTreeConfig component
 * 
 * @name bomTreeConfig
 * @module ssv.components
 * 
 */
var BOMTreeConfigComponent = {
		templateUrl : 'pages/ssv/components/bomTree/bomTreeConfig/bom-tree-config-tmpl.html',
		controller : ['$rootScope', '$scope', '$stateParams', 'SSVConfig', 'AssemblySvc', BOMTreeConfigController]
};

/**
 * Controller for the BOMTreeConfig component
 * 
 * @name BOMTreeConfigController
 * @param {service} $rootScope AngularJS rootScope service
 * @param {service} $scope AngularJS current scope service
 * @param {service} $stateParams ui-router URL/route parameter access service
 * @param {SSVConfig} ssvConfig SSV configuration constants
 * @param {AssemblySvc} AssemblySvc SSV Assembly service
 * 
 */
function BOMTreeConfigController($rootScope, $scope, $stateParams, ssvConfig, AssemblySvc){
	
	/** @alias this */
	var ctrl = this;

    /** Controller initializer @function @see onInit @public */	
	ctrl.$onInit = onInit;
	
	/** count the attributes selected @function @see countSelected @public */
	ctrl.countSelected = countSelected; 
	
	/** Action for showing the supplier view @function @see showSupplierView @public */
	ctrl.showSupplierView = showSupplierView;
	
	/** Action for showing the material view @function @see showMaterialView @public */
	ctrl.showMaterialView = showMaterialView;
	
	/** Determine if the attribute is disabled @function @see isDisabled @public */
	ctrl.isDisabled = isDisabled;
		
	ctrl.mappedFn = mapped;
	
	/** 
	 * Initialize the controller
	 * 
	 * @private
	 */
	function onInit(){
		//show the swim lanes
		ctrl.showSwimlanes = true;
		ctrl.showWatermark = true;
		
		//what bom tree structure to show
		ctrl.isMaterialView = true;
		ctrl.isSupplierView = false;
		
		//what colored status to show
		ctrl.isScheduleView = true;
		ctrl.isSpcView = false;
		ctrl.isQnoteView = false;
		
		ctrl.selectedSupplier = {};
		ctrl.selectedMaterial = {};
		
		angular.forEach( Object.keys( ssvConfig ), function( attribute ){ 
			if( ssvConfig[attribute].supplierView )
				ctrl.selectedSupplier[attribute] = ssvConfig[attribute].supplierViewChecked;
			if( ssvConfig[attribute].materialView )
				ctrl.selectedMaterial[attribute] = ssvConfig[attribute].materialViewChecked;
		});
		
		ctrl.selected = ctrl.selectedMaterial;

		ctrl.attributes = Object.keys( ctrl.selected );				
		$scope.$watch( function(){ return ctrl.selected; }, _triggerConfigChange, true ); 		
		$scope.$watch( function(){ return ctrl.showSwimlanes; }, _triggerConfigChange, true );
		$scope.$watch( function(){ return ctrl.isScheduleView; }, _triggerConfigChange, true );
		$scope.$watch( function(){ return ctrl.isSpcView; }, _triggerConfigChange, true );
		$scope.$watch( function(){ return ctrl.isQnoteView; }, _triggerConfigChange, true );
		$scope.$watch( function(){ return ctrl.isMaterialView; }, _triggerConfigChange, true );
		$scope.$watch( function(){ return ctrl.isSupplierView; }, _triggerConfigChange, true );
	}
	
    function mapped(input){
    	return (ssvConfig[input] && ssvConfig[input].displayName)? ssvConfig[input].displayName : input;
    }
	
	/**
	 * Count the attributes selected
	 * 
	 * @returns {number} number of attributes selected
	 */
	function countSelected(){
		return Object.keys( ctrl.selected ).filter( function(key){ return ctrl.selected[key]; } ).length;		
	}
	
	/** 
	 * Determine if an attribute is disabled.  Disabled is per the ssvConfig constants
	 * 
	 * @returns {boolean} true if the attribute is in the config and marked as disabled; false otherwise
	 */
	function isDisabled( attribute ){
		return ssvConfig[attribute] && ssvConfig[attribute].disabled;
	}
	
	/**
	 * Action taken when any of the configuration elements change; broadcasts a bomTreeConfigChanged event with the configuration
	 * 
	 * @param {Object} newValue configuration element changed value
	 * @param {Object} oldValue configuration element previous value
	 */
	function _triggerConfigChange(newValue, oldValue){
		if(newValue != oldValue){
			var attrs = ctrl.attributes.filter( function(attr){ return ctrl.selected[attr]; } );
			$rootScope.$broadcast( 'bomTreeConfigChanged', { showWatermark: ctrl.showWatermark, showSwimlanes: ctrl.showSwimlanes, attributes: attrs, isSupplierView : ctrl.isSupplierView, isMaterialView : ctrl.isMaterialView, isScheduleView : ctrl.isScheduleView, isSpcView : ctrl.isSpcView, isQnoteView : ctrl.isQnoteView} );
		}
	}
	
	/**
	 * Action when the supplier view is shown
	 */
	function showSupplierView(){
		if(ctrl.isMaterialView){
			ctrl.isMaterialView = false;
			ctrl.isSupplierView = true;
			
			ctrl.selectedMaterial = ctrl.selected; // save the old ones
			ctrl.selected = ctrl.selectedSupplier; // put the new ones in place
			ctrl.attributes = Object.keys( ctrl.selected );	// build list
			
			AssemblySvc.query($stateParams.partNumber, $stateParams.partSite, $stateParams.assemblyNumber, $stateParams.assemblySite, 3, "supplier").then( function(assembly){
				$rootScope.$broadcast('bomTreeRootChanged', { "assembly" : assembly, "replaceTree" : true });
			});
		}		
	}

	/**
	 * Action when the material view is shown
	 */
	function showMaterialView(){
		if(ctrl.isSupplierView){
			ctrl.isMaterialView = true;
			ctrl.isSupplierView = false;

			ctrl.selectedSupplier = ctrl.selected; // save the old ones
			ctrl.selected = ctrl.selectedMaterial; // put the new ones in place
			ctrl.attributes = Object.keys( ctrl.selected );	// build the list

			
			AssemblySvc.query($stateParams.partNumber, $stateParams.partSite, $stateParams.assemblyNumber, $stateParams.assemblySite, 3, "material").then( function(assembly){
				$rootScope.$broadcast('bomTreeRootChanged', { "assembly" : assembly, "replaceTree" : true });
			});
		}
	}
	
}