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

define( [], function(){ return AssemblyLegendComponent; });

/**
 * Definition of the AssemblyLegend component
 * 
 * @name assemblyLegend
 * @module ssv.components
 * 
 */
var AssemblyLegendComponent = {
	    controller: ['$scope', AssemblyLegendCtrl],
	    templateUrl: 'pages/ssv/components/assemblyLegend/assembly-legend-tmpl.html'
	};

/**
 * Controller for the AssemblyLegend component
 * 
 * @name BOMTreeController
 * @param {service} $scope AngularJS current scope service
 */
function AssemblyLegendCtrl($scope){
    
	/** @alias this */
	var ctrl = this;
	
	/** Controller initializer @function @see onInit @public */
	ctrl.$onInit = onInit;

    /**
     * Initialize the controller
     * 
     * @private
     */
	function onInit(){
    	ctrl.isMaterialView = true;
        ctrl.isSupplierView = false;
    	ctrl.isScheduleView = true;
    	ctrl.isSpcView = false;
    	ctrl.isQnoteView = false;	

    	$scope.$on('bomTreeConfigChanged', handleConfigChanged );
    }
    
    /**
     * Callback/Handler for the bomTreeConfigChanged event
     * 
     * @private
     * @param {Event} event event that triggered the action
     * @param {{isSupplierView:boolean, isMaterialView:boolean, isScheduleView:boolean, isSpcView:boolean; isQnoteView:boolean}} opts data passed with the event
     */
    function handleConfigChanged( event, opts ){
    	ctrl.isSupplierView = (opts.isSupplierView) ? opts.isSupplierView : false;
    	ctrl.isMaterialView = (opts.isMaterialView) ? opts.isMaterialView : false;
    	ctrl.isScheduleView = (opts.isScheduleView) ? opts.isScheduleView : false;
    	ctrl.isSpcView = (opts.isSpcView) ? opts.isSpcView : false;
    	ctrl.isQnoteView = (opts.isQnoteView) ? opts.isQnoteView : false;
    }
}