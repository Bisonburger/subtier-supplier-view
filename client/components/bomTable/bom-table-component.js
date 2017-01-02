define( [], function(){ return BomTableComponent; });

var BomTableComponent = {
	    controller: ['$scope', '$rootScope', 'AssemblySvc', BomTableCtrl],
	    templateUrl: 'pages/ssv/components/bomTable/bom-table-tmpl.html'
	};

function BomTableCtrl($scope, $rootScope, AssemblySvc){
	var ctrl = this;
	
	ctrl.initialLoadComplete = false; 
	
	ctrl.assembly = null;
	ctrl.assemblies = [];
	
	ctrl.isScheduleView = true;
	ctrl.isSpcView = false;
	ctrl.isQnoteView = false;
	
	ctrl.isMaterialView = true;
	ctrl.isSupplierView = false;
	
	ctrl.$onInit = onInit;
	ctrl.selectAssembly = selectAssembly;
	ctrl.zoomToAssembly = zoomToAssembly;

	function onInit(){
		$rootScope.$on('bomTreeRootChanged', handleChangedRoot);
		$rootScope.$on('openTable', handleOpenTable);
		$rootScope.$on('closeTable', handleCloseTable);
		$rootScope.$on('bomTreeConfigChanged', handleConfigChanged );
	};
	
    /**
     * Callback/Handler for the change of config
     */
    function handleConfigChanged( event, config ){
    	ctrl.isSupplierView = (config.isSupplierView) ? config.isSupplierView : false;
    	ctrl.isMaterialView = (config.isMaterialView) ? config.isMaterialView : false;
    	ctrl.isScheduleView = (config.isScheduleView) ? config.isScheduleView : false;
    	ctrl.isSpcView = (config.isSpcView) ? config.isSpcView : false;
    	ctrl.isQnoteView = (config.isQnoteView) ? config.isQnoteView : false;
    	
    	if(ctrl.assemblies.length > 0){
    		handleOpenTable();    		
    	}
    }
    
    /**
     * Callback/Handler for the change of root event 
     */
    function handleChangedRoot(event, opts) {
    	if(opts.replaceTree){
    		ctrl.assemblies = [];
    		ctrl.assembly = opts.assembly;
    		if(ctrl.initialLoadComplete){
    			populateAssemblies(ctrl.assembly);
    		} else {
    			ctrl.initialLoadComplete = true;
    		}
    	}
    };
    
    /**
     * Callback/Handler for closing of table 
     */
    function handleCloseTable() {
    	ctrl.assemblies = [];
    };
    
    /**
     * Callback/Handler for opening of table 
     */
    function handleOpenTable() {
    	ctrl.assemblies = [];
    	populateAssemblies(ctrl.assembly);
		ctrl.assemblies.sort( function( a, b ){
			if(ctrl.isScheduleView){
				if(a.scheduleStatus == b.scheduleStatus && (a.scheduleStatus != null)){
					return b.scheduleDaysLate - a.scheduleDaysLate;
				} else if(a.scheduleStatus == null && b.scheduleStatus == null){
					return 0;
				} else if(a.scheduleStatus == null && b.scheduleStatus != null){
					return 1;
				} else if(a.scheduleStatus != null && b.scheduleStatus == null){
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
				if(a.spcStatus == b.spcStatus && (a.spcStatus != null)){
					return b.spcReason - a.spcReason;
				} else if(a.spcStatus == null && b.spcStatus == null){
					return 0;
				} else if(a.spcStatus == null && b.spcStatus != null){
					return 1;
				} else if(a.spcStatus != null && b.spcStatus == null){
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
				if(a.qnoteStatus == b.qnoteStatus && (a.qnoteStatus != null)){
					return b.qnoteReason - a.qnoteReason;
				} else if(a.qnoteStatus == null && b.qnoteStatus == null){
					return 0;
				} else if(a.qnoteStatus == null && b.qnoteStatus != null){
					return 1;
				} else if(a.qnoteStatus != null && b.qnoteStatus == null){
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
		});
    };
	
	function selectAssembly(assembly){
		$rootScope.$broadcast('bomTreeRootChanged', { "assembly" : assembly, "replaceTree" : false });
	};

	function zoomToAssembly(assembly){
		$rootScope.$broadcast('bomTreeZoom', { "assembly" : assembly });
	};
	
	function populateAssemblies(assembly){
		ctrl.assemblies.push(assembly);
		
		angular.forEach(assembly.children, function(child){
			populateAssemblies(child);
		});
		
		angular.forEach(assembly._children, function(child){
			populateAssemblies(child);
		});
	};
};