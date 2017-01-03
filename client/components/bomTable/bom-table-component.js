define( [], function(){ return BomTableComponent; });

var angular = require('angular');

var BomTableComponent = {
	    controller: ['$scope', '$rootScope', 'AssemblySvc', BomTableCtrl],
	    templateUrl: 'pages/ssv/components/bomTable/bom-table-tmpl.html'
	};

function BomTableCtrl($scope, $rootScope, AssemblySvc){
	var ctrl = this;
	
	ctrl.originalAssembly;
	ctrl.initialLoadComplete = false;
	ctrl.assembly = null;
	ctrl.assemblies = [];
	ctrl.isScheduleView = true;
	ctrl.isSpcView = false;
	ctrl.isQnoteView = false;
	ctrl.isMaterialView = true;
	ctrl.isSupplierView = false;
	ctrl.search = {};
	ctrl.madeRoot = false;

	ctrl.$onInit = onInit;
	ctrl.changeTreeRoot = changeTreeRoot;
	ctrl.zoomToAssembly = zoomToAssembly;
	ctrl.clearSearch = clearSearch;
	ctrl.resetView = resetView;

	function onInit(){
		$rootScope.$on('bomTreeRootChanged', handleChangedRoot);
		$rootScope.$on('openTable', handleOpenTable);
		$rootScope.$on('closeTable', handleCloseTable);
		$rootScope.$on('bomTreeConfigChanged', handleConfigChanged );
		
		// when a user clears out the field with backspace/delete the
		// value filtered on is a blank string which remove null values
		// in that column. these watches are needed to changed the
		// search value back to undefined
		$scope.$watch( function(){ return ctrl.search.bomLevel; }, function(newValue, oldValue){if(newValue == ''){ctrl.search.bomLevel = undefined;}}, true );
		$scope.$watch( function(){ return ctrl.search.partNumber; }, function(newValue, oldValue){if(newValue == ''){ctrl.search.partNumber = undefined;}}, true );
		$scope.$watch( function(){ return ctrl.search.partDescription; }, function(newValue, oldValue){if(newValue == ''){ctrl.search.partDescription = undefined;}}, true );
		$scope.$watch( function(){ return ctrl.search.partSite; }, function(newValue, oldValue){if(newValue == ''){ctrl.search.partSite = undefined;}}, true );
		$scope.$watch( function(){ return ctrl.search.partSupplier; }, function(newValue, oldValue){if(newValue == ''){ctrl.search.partSupplier = undefined;}}, true );
		$scope.$watch( function(){ return ctrl.search.scheduleDaysLate; }, function(newValue, oldValue){if(newValue == ''){ctrl.search.scheduleDaysLate = undefined;}}, true );
		$scope.$watch( function(){ return ctrl.search.scheduleQuantityLate; }, function(newValue, oldValue){if(newValue == ''){ctrl.search.scheduleQuantityLate = undefined;}}, true );
		$scope.$watch( function(){ return ctrl.search.spcReason; }, function(newValue, oldValue){if(newValue == ''){ctrl.search.spcReason = undefined;}}, true );
		$scope.$watch( function(){ return ctrl.search.qnoteReason; }, function(newValue, oldValue){if(newValue == ''){ctrl.search.qnoteReason = undefined;}}, true );
	}
	
    /**
     * Callback/Handler for the change of config
     */
    function handleConfigChanged( event, config ){
    	ctrl.isSupplierView = (config.isSupplierView) ? config.isSupplierView : false;
    	ctrl.isMaterialView = (config.isMaterialView) ? config.isMaterialView : false;
    	ctrl.isScheduleView = (config.isScheduleView) ? config.isScheduleView : false;
    	ctrl.isSpcView = (config.isSpcView) ? config.isSpcView : false;
    	ctrl.isQnoteView = (config.isQnoteView) ? config.isQnoteView : false;
    	
    	clearSearch();
    	
    	if(ctrl.assemblies.length > 0){
    		handleOpenTable();    		
    	}
    }
    
    /**
     * Callback/Handler for the change of root event 
     */
    function handleChangedRoot(event, opts) {
		ctrl.assemblies = [];
		ctrl.assembly = opts.assembly;
		if(ctrl.initialLoadComplete){
			populateAssemblies(ctrl.assembly);
			sortWorstCaseTop();
		} else {
			ctrl.initialLoadComplete = true;
		}
    }
    
    /**
     * Callback/Handler for closing of table 
     */
    function handleCloseTable() {
    	ctrl.assemblies = [];
    }
    
    /**
     * Callback/Handler for opening of table 
     */
    function handleOpenTable() {
    	ctrl.assemblies = [];
    	populateAssemblies(ctrl.assembly);
    	sortWorstCaseTop();
    }
    
    function sortWorstCaseTop(){
		ctrl.assemblies.sort( function( a, b ){
			if(ctrl.isMaterialView){
				if(ctrl.isScheduleView){
					if(typeof a.scheduleStatus == 'undefined' && typeof b.scheduleStatus == 'undefined'){
						return 0;
					} else if(typeof a.scheduleStatus == 'undefined' && typeof b.scheduleStatus != 'undefined'){
						return 1;
					} else if(typeof a.scheduleStatus != 'undefined' && typeof b.scheduleStatus == 'undefined'){
						return -1;
					} else if(a.scheduleStatus == "R" && b.scheduleStatus == "Y"){
						return -1;
					} else if(a.scheduleStatus == "R" && b.scheduleStatus == "G"){
						return -1;
					} else if(a.scheduleStatus == "Y" && b.scheduleStatus == "G"){
						return -1;
					} else if(a.scheduleStatus == "Y" && b.scheduleStatus == "R"){
						return 1;
					} else if(a.scheduleStatus == "G" && b.scheduleStatus == "R"){
						return 1;
					} else if(a.scheduleStatus == "G" && b.scheduleStatus == "Y"){
						return 1;
					}
				} else if(ctrl.isSpcView){
					if(typeof a.spcStatus == 'undefined' && typeof b.spcStatus == 'undefined'){
						return 0;
					} else if(typeof a.spcStatus == 'undefined' && typeof b.spcStatus != 'undefined'){
						return 1;
					} else if(typeof a.spcStatus != 'undefined' && typeof b.spcStatus == 'undefined'){
						return -1;
					} else if(a.spcStatus == "R" && b.spcStatus == "Y"){
						return -1;
					} else if(a.spcStatus == "R" && b.spcStatus == "G"){
						return -1;
					} else if(a.spcStatus == "Y" && b.spcStatus == "G"){
						return -1;
					} else if(a.spcStatus == "Y" && b.spcStatus == "R"){
						return 1;
					} else if(a.spcStatus == "G" && b.spcStatus == "R"){
						return 1;
					} else if(a.spcStatus == "G" && b.spcStatus == "Y"){
						return 1;
					}
				} else if(ctrl.isQnoteView){
					if(typeof a.qnoteStatus == 'undefined' && typeof b.qnoteStatus == 'undefined'){
						return 0;
					} else if(typeof a.qnoteStatus == 'undefined' && typeof b.qnoteStatus != 'undefined'){
						return 1;
					} else if(typeof a.qnoteStatus != 'undefined' && typeof b.qnoteStatus == 'undefined'){
						return -1;
					} else if(a.qnoteStatus == "R" && b.qnoteStatus == "Y"){
						return -1;
					} else if(a.qnoteStatus == "R" && b.qnoteStatus == "G"){
						return -1;
					} else if(a.qnoteStatus == "Y" && b.qnoteStatus == "G"){
						return -1;
					} else if(a.qnoteStatus == "Y" && b.qnoteStatus == "R"){
						return 1;
					} else if(a.qnoteStatus == "G" && b.qnoteStatus == "R"){
						return 1;
					} else if(a.qnoteStatus == "G" && b.qnoteStatus == "Y"){
						return 1;
					}
				}	
			} else {
				if(ctrl.isScheduleView){
					if(typeof a.scheduleStatusWorstCase == 'undefined' && typeof b.scheduleStatusWorstCase == 'undefined'){
						return 0;
					} else if(typeof a.scheduleStatusWorstCase == 'undefined' && typeof b.scheduleStatusWorstCase != 'undefined'){
						return 1;
					} else if(typeof a.scheduleStatusWorstCase != 'undefined' && typeof b.scheduleStatusWorstCase == 'undefined'){
						return -1;
					} else if(a.scheduleStatusWorstCase == "R" && b.scheduleStatusWorstCase == "Y"){
						return -1;
					} else if(a.scheduleStatusWorstCase == "R" && b.scheduleStatusWorstCase == "G"){
						return -1;
					} else if(a.scheduleStatusWorstCase == "Y" && b.scheduleStatusWorstCase == "G"){
						return -1;
					} else if(a.scheduleStatusWorstCase == "Y" && b.scheduleStatusWorstCase == "R"){
						return 1;
					} else if(a.scheduleStatusWorstCase == "G" && b.scheduleStatusWorstCase == "R"){
						return 1;
					} else if(a.scheduleStatusWorstCase == "G" && b.scheduleStatusWorstCase == "Y"){
						return 1;
					}
				} else if(ctrl.isSpcView){
					if(typeof a.spcStatusWorstCase == 'undefined' && typeof b.spcStatusWorstCase == 'undefined'){
						return 0;
					} else if(typeof a.spcStatusWorstCase == 'undefined' && typeof b.spcStatusWorstCase != 'undefined'){
						return 1;
					} else if(typeof a.spcStatusWorstCase != 'undefined' && typeof b.spcStatusWorstCase == 'undefined'){
						return -1;
					} else if(a.spcStatusWorstCase == "R" && b.spcStatusWorstCase == "Y"){
						return -1;
					} else if(a.spcStatusWorstCase == "R" && b.spcStatusWorstCase == "G"){
						return -1;
					} else if(a.spcStatusWorstCase == "Y" && b.spcStatusWorstCase == "G"){
						return -1;
					} else if(a.spcStatusWorstCase == "Y" && b.spcStatusWorstCase == "R"){
						return 1;
					} else if(a.spcStatusWorstCase == "G" && b.spcStatusWorstCase == "R"){
						return 1;
					} else if(a.spcStatusWorstCase == "G" && b.spcStatusWorstCase == "Y"){
						return 1;
					}
				} else if(ctrl.isQnoteView){
					if(typeof a.qnoteStatusWorstCase == 'undefined' && typeof b.qnoteStatusWorstCase == 'undefined'){
						return 0;
					} else if(typeof a.qnoteStatusWorstCase == 'undefined' && typeof b.qnoteStatusWorstCase != 'undefined'){
						return 1;
					} else if(typeof a.qnoteStatusWorstCase != 'undefined' && typeof b.qnoteStatusWorstCase == 'undefined'){
						return -1;
					} else if(a.qnoteStatusWorstCase == "R" && b.qnoteStatusWorstCase == "Y"){
						return -1;
					} else if(a.qnoteStatusWorstCase == "R" && b.qnoteStatusWorstCase == "G"){
						return -1;
					} else if(a.qnoteStatusWorstCase == "Y" && b.qnoteStatusWorstCase == "G"){
						return -1;
					} else if(a.qnoteStatusWorstCase == "Y" && b.qnoteStatusWorstCase == "R"){
						return 1;
					} else if(a.qnoteStatusWorstCase == "G" && b.qnoteStatusWorstCase == "R"){
						return 1;
					} else if(a.qnoteStatusWorstCase == "G" && b.qnoteStatusWorstCase == "Y"){
						return 1;
					}
				}
			}
		});
    }
	
	function changeTreeRoot(assembly){
		ctrl.madeRoot = true;
		
		ctrl.originalAssembly = angular.copy(ctrl.assembly);
		
		$rootScope.$broadcast('bomTreeRootChanged', { "assembly" : assembly, "replaceTree" : true });
	}

	function zoomToAssembly(assembly){
		window.scrollTo(0,0);
		$rootScope.$broadcast('bomTreeZoom', { "assembly" : assembly });
	}
	
	function populateAssemblies(assembly, bomLevel){
		if(!bomLevel){
			bomLevel = 0;
		}
		
		assembly.bomLevel = bomLevel;
		
		ctrl.assemblies.push(assembly);
		
		bomLevel++;
		
		angular.forEach(assembly.children, function(child){
			populateAssemblies(child, bomLevel);
		});
		
		angular.forEach(assembly._children, function(child){
			populateAssemblies(child, bomLevel);
		});
	}
	
	function clearSearch(){
		if(ctrl.search){
			ctrl.search = {};
		}
	}
	
	function resetView(){
		ctrl.madeRoot = false;
		ctrl.assembly = ctrl.originalAssembly;
		$rootScope.$broadcast('bomTreeRootChanged', { "assembly" : ctrl.assembly, "replaceTree" : true, "resetTree" : true });
	}
}