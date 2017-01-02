define([], function() {
	return BOMTreeConfigComponent;
});

var BOMTreeConfigComponent = {
		templateUrl : 'pages/ssv/components/bomTree/bom-tree-config-tmpl.html',
		controller : ['$rootScope', '$scope', '$stateParams', 'SSVConfig', 'AssemblySvc', BOMTreeConfigController]
};

function BOMTreeConfigController($rootScope, $scope, $stateParams, ssvConfig, AssemblySvc){
	var ctrl = this;
	
	ctrl.$onInit = onInit;
	
	
	ctrl.countSelected = function(){
		return Object.keys( ctrl.selected ).filter( function(key){ return ctrl.selected[key]; } ).length;		
	};
	
	//show the swim lanes
	ctrl.showSwimlanes = true;
	
	//what bom tree structure to show
	ctrl.isMaterialView = true;
	ctrl.isSupplierView = false;
	
	//what colored status to show
	ctrl.isScheduleView = true;
	ctrl.isSpcView = false;
	ctrl.isQnoteView = false;
	
	//functions
	ctrl.showSupplierView = showSupplierView;
	ctrl.showMaterialView = showMaterialView;
	
	function onInit(){
		// TODO:  Get these (at least the keys) from AssemblySvc
		ctrl.selected =  {
				"partNumber" : true,
				"partSite" : true,
				"partSupplierName" : false,
				"cspl" : false,
				"mcil" : false,
				"mdaSrm" : false,
				"carl" : false,
				"criticalDefenseInfo" : false,
				"logicBearing" : false,
				"foreign" : false,
				"country" : false,
				"dmeaTrustedSource" : false,
				"gidepSubscriber" : false
		};
		
		ctrl.attributes = Object.keys( ctrl.selected );				
		$scope.$watch( function(){ return ctrl.selected; }, _triggerConfigChange, true ); 		
		$scope.$watch( function(){ return ctrl.showSwimlanes; }, _triggerConfigChange, true );
		$scope.$watch( function(){ return ctrl.isScheduleView; }, _triggerConfigChange, true );
		$scope.$watch( function(){ return ctrl.isSpcView; }, _triggerConfigChange, true );
		$scope.$watch( function(){ return ctrl.isQnoteView; }, _triggerConfigChange, true );
		$scope.$watch( function(){ return ctrl.isMaterialView; }, _triggerConfigChange, true );
		$scope.$watch( function(){ return ctrl.isSupplierView; }, _triggerConfigChange, true );
	}
	
	function _triggerConfigChange(newValue, oldValue){
		if(newValue != oldValue){
			var attrs = ctrl.attributes.filter( function(attr){ return ctrl.selected[attr]; } );
			$rootScope.$broadcast( 'bomTreeConfigChanged', { showSwimlanes: ctrl.showSwimlanes, attributes: attrs, isSupplierView : ctrl.isSupplierView, isMaterialView : ctrl.isMaterialView, isScheduleView : ctrl.isScheduleView, isSpcView : ctrl.isSpcView, isQnoteView : ctrl.isQnoteView} );
		}
	}
	
	function showSupplierView(){
		if(ctrl.isMaterialView){
			ctrl.isMaterialView = false;
			ctrl.isSupplierView = true;
			
			AssemblySvc.query($stateParams.partNumber, $stateParams.partSite, $stateParams.assemblyNumber, $stateParams.assemblySite, 3, "supplier").then( function(assembly){
				$rootScope.$broadcast('bomTreeRootChanged', { "assembly" : assembly, "replaceTree" : true });
			});
		}		
	};
	
	function showMaterialView(){
		if(ctrl.isSupplierView){
			ctrl.isMaterialView = true;
			ctrl.isSupplierView = false;
			
			AssemblySvc.query($stateParams.partNumber, $stateParams.partSite, $stateParams.assemblyNumber, $stateParams.assemblySite, 3, "material").then( function(assembly){
				$rootScope.$broadcast('bomTreeRootChanged', { "assembly" : assembly, "replaceTree" : true });
			});
		}
	};
	
}