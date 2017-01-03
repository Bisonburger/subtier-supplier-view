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
define( [], function(){ return SSVViewComponent; } );

/**
 * Definition of the SSVView component
 * 
 * @name ssvView
 * @module ssv.components
 * 
 */
var SSVViewComponent = {
		controller: ['$scope', '$stateParams', '$rootScope', '$timeout', '$state', 'alertService', 'AssemblySvc', SSVViewController],
		templateUrl: 'pages/ssv/components/ssvView/ssv-view-tmpl.html'
};

/**
 * Controller for the SSVView component
 * 
 * @name SSVViewController
 * @param {service} $scope AngularJS current scope service
 * @param {service} $stateParams
 * @param {service} $rootScope AngularJS rootScope service
 * @param {service} $state 
 * @param {AlertSvc} alertService RefApp5 alerting service
 * @param {AssemblySvc} AssemblySvc SSV Assembly service
 * 
 */
function SSVViewController( $scope, $stateParams, $rootScope, $timeout, $state, alertService, AssemblySvc ) {
	/** @alias this */
	var ctrl = this;
	
    ctrl.sideBarOpen = false;
    ctrl.tableOpen = false;
    ctrl.treeViewType = "material";
    ctrl.expandAll = false;
    ctrl.showMinimap = false;
    ctrl.showTable = false;
    ctrl.showDetail = true;
	
	/** Controller initializer @function @see onInit @public */
	ctrl.$onInit = onInit;
	
	/** Action to expand/collapse all nodes @function @see expandCollapseAll @public */
    ctrl.expandCollapseAll = expandCollapseAll;
    
    /** Action when sidebar is opened/closed @function @see openSidebar @public */
    ctrl.openSidebar = openSidebar;
    
    /**
     * Action when the sidebar is opened/closed
     * Dispatches the event openSidebar/closeSidebar based on state
     */
    function openSidebar(){
    	$scope.$broadcast( (!ctrl.sideBarOpen)? 'openSidebar' : 'closeSidebar' );
    	ctrl.sideBarOpen = !ctrl.sideBarOpen;
    }
    
    
    /**
     * Action to expand or collapse all nodes
     * Dispatches bomTreeExpandAll/bomTreeCollapseAll based on state
     */
    function expandCollapseAll(){
    	ctrl.expandAll = !ctrl.expandAll;
    	$scope.$broadcast( ( ctrl.expandAll )? 'bomTreeExpandAll' : 'bomTreeCollapseAll');
    }
    
    /**
     * Initialize the controller
     * 
     * @private
     */
    function onInit(){
    	$scope.$watch( function(){ return ctrl.showTable; }, function(newVal,oldVal){
    	    if( oldVal !== newVal ){
        	    $rootScope.$broadcast( (ctrl.showTable)? 'openTable' : 'closeTable' );
        	    ctrl.tableOpen = ctrl.showTable;
    	    }
    	});
    	
    	AssemblySvc.query($stateParams.partNumber, $stateParams.partSite, $stateParams.assemblyNumber, $stateParams.assemblySite, 3, ctrl.treeViewType)
    	.then( function(assembly){
    		$timeout( function(){
    			$rootScope.$broadcast('bomTreeRootChanged', { "assembly" : assembly, "replaceTree" : true });
    			ctrl.loaded = true;    			
        	}, 100);
    		
    	}, function(error){
    		ctrl.loaded = true;
			alertService.add('danger', 'You do not have access to view part number ' + $stateParams.partNumber + ' at part site ' + $stateParams.partSite + ' or the part number doesn\'t exist.', 6000);
			$state.go('app.favorite-list');
    	});
    }    
}