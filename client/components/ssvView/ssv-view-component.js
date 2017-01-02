define( [], function(){ return SSVViewComponent; } );

var angular = require('angular');

var SSVViewComponent = {
		controller: ['$scope', '$stateParams', '$rootScope', '$state', 'alertService', 'AssemblySvc', SSVViewController],
		templateUrl: 'pages/ssv/components/ssvView/ssv-view-tmpl.html'
};

function SSVViewController( $scope, $stateParams, $rootScope, $state, alertService, AssemblySvc ) {
	var ctrl = this;
    ctrl.sideBarOpen = false;
    ctrl.tableOpen = false;
    ctrl.treeViewType = "material";
    ctrl.$onInit = onInit;
    ctrl.expandAll = false;
    ctrl.showMinimap = false;
    ctrl.showTable = false;
    ctrl.showDetail = true;
    
    ctrl.openSidebar = function(){
    	if( !ctrl.sideBarOpen ) $scope.$broadcast('openSidebar');
    	else $scope.$broadcast('closeSidebar');
    	ctrl.sideBarOpen = !ctrl.sideBarOpen;
    };
    
    ctrl.expandCollapseAll = function(){
    	ctrl.expandAll = !ctrl.expandAll;
    	if( ctrl.expandAll ) $scope.$broadcast( 'bomTreeExpandAll' );
    	else $scope.$broadcast('bomTreeCollapseAll');
    };
    
    function onInit(){
    	
    	$scope.$watch( function(){ return ctrl.showTable; }, function(){
        	if( ctrl.showTable ) $rootScope.$broadcast('openTable');
        	else $scope.$broadcast('closeTable');
        	ctrl.tableOpen = ctrl.showTable;
    	});
    	
    	AssemblySvc.query($stateParams.partNumber, $stateParams.partSite, $stateParams.assemblyNumber, $stateParams.assemblySite, 3, ctrl.treeViewType).then( function(assembly){
			$rootScope.$broadcast('bomTreeRootChanged', { "assembly" : assembly, "replaceTree" : true });
			ctrl.loaded = true;
    	}, function(error){
    		ctrl.loaded = true;
			alertService.add('danger', 'You do not have access to view part number ' + $stateParams.partNumber + ' at part site ' + $stateParams.partSite + ' or the part number doesn\'t exist.', 6000);
			$state.go('app.favorite-list');
    	});
    };    
};