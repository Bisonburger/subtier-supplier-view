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

define( [], function(){ return AssemblyViewComponent; } );

/**
 * Definition of the AssemblyView component
 * 
 * @name assemblyView
 * @module ssv.components
 * 
 */
var AssemblyViewComponent = {
    controller: [ '$rootScope', 'alertService', 'FavoriteSvc', 'AssemblySvc', AssemblyViewCtrl],
    templateUrl: 'pages/ssv/components/assemblyView/assembly-view-tmpl.html'
};

/**
 * Controller for the AssemblyView component
 * 
 * @name AssemblyViewController
 * @param {service} $scope AngularJS current scope service
 * @param {AssemblySvc} AssemblySvc SSV Assembly service
 */
function AssemblyViewCtrl( $scope, alertService, FavoriteSvc, AssemblySvc ){
    
	/** @alias this */
	var ctrl = this;
	ctrl.saveFavorite = saveFavorite;
    
    /** Controller initializer @function @see onInit @public */
    ctrl.$onInit = onInit;
    
    /**
     * Initialize the controller
     * 
     * @private
     */
    function onInit(){    	
    	ctrl.isScheduleView = true;
    	ctrl.isSpcView = false;
    	ctrl.isQnoteView = false;
    	
    	ctrl.isMaterialView = true;
    	ctrl.isSupplierView = false;

    	$scope.$on('bomTreeRootChanged', handleNodeSelected );
    	$scope.$on('bomTreeConfigChanged', handleConfigChanged );
    	$scope.$on('bomTreeNodeSelected', handleNodeSelected );
    }
    
    /**
     * Handler for the bomTreeRootChanged and bomTreeNodeSelected events
     * sets the current assembly to the assembly passed in the event
     * 
     * @param {Event} event Event object that triggered the handler
     * @param {{assembly:Assembly}} opts The data passed with the event
     */
    function handleNodeSelected( event, opt ){
    	ctrl.assembly = opt.assembly;
    }

    function saveFavorite(assembly){
    	if(assembly.partDescription == null || typeof assembly.partDescription == 'undefined' || assembly.partDescription == ""){
    		assembly.partDescription = assembly.partNumber;
    	}
    	FavoriteSvc.wrap({description: assembly.partDescription, partNumber: assembly.partNumber, partSite: assembly.partSite, assemblyNumber: assembly.assemblyNumber, assemblySite: assembly.assemblySite})[0].$save().then(function(result){
			alertService.add('success', assembly.partDescription + ' saved as a favorite.', 4000);
		});
    }
    
    /**
     * Callback/Handler for bomTreeConfigChanged event
     * 
     * @private
     * @param {Event} event event that triggered the action
     * @param {{isSupplierView:boolean, isMaterialView:boolean, isScheduleView:boolean, isSpcView:boolean; isQnoteView:boolean}} opts data passed with the event
     */
    function handleConfigChanged( event, config ){
    	ctrl.isSupplierView = (config.isSupplierView) ? config.isSupplierView : false;
    	ctrl.isMaterialView = (config.isMaterialView) ? config.isMaterialView : false;
    	ctrl.isScheduleView = (config.isScheduleView) ? config.isScheduleView : false;
    	ctrl.isSpcView = (config.isSpcView) ? config.isSpcView : false;
    	ctrl.isQnoteView = (config.isQnoteView) ? config.isQnoteView : false;
    }    
}