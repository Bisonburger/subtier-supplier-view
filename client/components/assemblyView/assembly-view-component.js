define( [], function(){ return AssemblyViewComponent; } );

var AssemblyViewComponent = {
    controller: [ '$rootScope', 'AssemblySvc', AssemblyViewCtrl],
    templateUrl: 'pages/ssv/components/assemblyView/assembly-view-tmpl.html'
};

function AssemblyViewCtrl( $scope, AssemblySvc ){
    var ctrl = this;
    
    ctrl.$onInit = onInit;
    ctrl.assemblies = [];
    
	ctrl.isScheduleView = true;
	ctrl.isSpcView = false;
	ctrl.isQnoteView = false;
	
	ctrl.isMaterialView = true;
	ctrl.isSupplierView = false;
    
    function onInit(){
    	$scope.$on('bomTreeRootChanged', handleChangedRoot);
    	$scope.$on('bomTreeConfigChanged', handleConfigChanged );
    	$scope.$on('bomTreeNodeSelected', handleNodeSelected );
    };
    
    function handleNodeSelected( event, opt ){
    	ctrl.assembly = opt.assembly;
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
    }
    
    /**
     * Callback/Handler for the change of root event 
     */
    function handleChangedRoot(event, opts) {
    	ctrl.assembly = [];
    	ctrl.assembly = opts.assembly;
    };
}