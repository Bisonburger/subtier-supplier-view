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

define( [], function(){ return AssemblyParentageComponent; });

/**
 * Definition of the AssemblyParentage component
 * 
 * @name assemblyParentage
 * @module ssv.components
 * 
 */
var AssemblyParentageComponent = {
	    controller: ['$scope', '$rootScope', AssemblyParentageCtrl],
	    templateUrl: 'pages/ssv/components/assemblyParentage/assembly-parentage-tmpl.html'
	};

/**
 * Controller for the AssemblyParentage component
 * 
 * @name AssemblyParentageController
 * @param {service} $scope AngularJS current scope service
 * @param {service} $rootScope AngularJS rootScope service
 */
function AssemblyParentageCtrl($scope,$rootScope){

	/** @alias this */
	var ctrl = this;
    
	/** Controller initializer @function @see onInit @public */
    ctrl.$onInit = onInit;
    
    /** Action for zooming to an assembly @function @see onInit @public */
    ctrl.zoomToAssembly = zoomToAssembly;

    /**
     * Initialize the controller
     * 
     * @private
     */
    function onInit(){
    	ctrl.isMaterialView = true;
        ctrl.parenttree = [];
        
        $scope.$on( 'bomTreeNodeSelected', _updatePath );
        $scope.$on('bomTreeConfigChanged', _handleConfigChanged );

    }
    
    /**
     * Handler for the bomTreeNodeSelected event
     * Extracts the path to root (in reverse order) for display in the breadcrumbs
     * 
     * @param {Event} event the event that triggered the action
     * @param {{pathToRoot:Assembly[]}} opts data passed with the event
     */
    function _updatePath(event,opts){
    	ctrl.parenttree = (opts && opts.pathToRoot)? opts.pathToRoot.reverse() : [];    	
    }
    
    /**
     * Handler for the bomTreeConfigChanged event
     * Sets the flag for Material view based on the event indicators
     * 
     * @param {Event} event the event that triggered the action
     * @param {{isMaterialView:boolean}} opts data passed with the event
     */
    function _handleConfigChanged(event,opts){
    	ctrl.isMaterialView = (opts && opts.isMaterialView); 
    }
    
    /**
     * Action for zooming to an assembly; fires the bomTreeZoom event passing the assembly to zoom to
     */
    function zoomToAssembly(assembly){
    	$rootScope.$broadcast( 'bomTreeZoom', {assembly: assembly} );
    }
}