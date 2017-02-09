define( ['ssv','angular-mocks', 'pages/ssv/tests/unit/mocks/AssemblySvcMock'], function(ssv, mocks, AssemblySvcMock){
	describe('Test bom-tree-config-component controller', function() {
		var $componentController;
		var $rootScope;
		var $scope;
		var ssvConfigMock;
		var $q;

		beforeEach( module('ssv') );
		beforeEach( inject(function(_$componentController_, _$rootScope_, _$q_ ) {
		    $componentController = _$componentController_;
		    $rootScope = _$rootScope_;
		    $scope = _$rootScope_.$new();
		    $q = _$q_;
		    ssvConfigMock = {};
		    assemblySvcMock = AssemblySvcMock.Basic;
		    
			$ctrl = $componentController('bomTreeConfig', {
				$rootScope : $rootScope,
				$scope : $scope,
				$stateParams : {},
				ssvConfig: ssvConfigMock,
				AssemblySvc : assemblySvcMock
			});
			
			$ctrl.$onInit();
			$scope.$apply();
		}));
		
		describe( 'Test initialization of the bom-tree-config-component', function(){
			it( 'should initialize to material view and set selected material & supplier attributes from the config', function(){
				ssvConfig = {			
						'partNumber': {
							displayName: 'Part Number',
							materialView: true,
							materialViewChecked: true,
							disabled: false,
							noFilter: true
						},
						'partDescription': {
							displayName: 'Part Description',
							disabled: true
						},
						'partSite':{
							displayName: 'CAGE Code',
							materialView: true,
							materialViewChecked: true,
							disabled: false
						},
						'partMakeBuyTransfer':{
							displayName: 'Transfer Code',
							materialView: true			
						},
						'partSupplier': {
							displayName: 'Supplier',
							materialView: true,
							materialViewChecked: false
						},
						'cspl': {
							displayName: 'CSPL',
							materialView: true,
							materialViewChecked: false
						},
						'mcil': {
							displayName: 'MCIL',
							materialView: true,
							materialViewChecked: false
						},
						'mdaSrm': {
							displayName: 'MDA SRM',
							materialView: true,
							materialViewChecked: false
						},
						'carl': {
							displayName: 'CARL',
							materialView: true,
							materialViewChecked: false
						},
						'criticalDefenseInfo': {
							displayName: 'Critical Defense Info',
							materialView: true,
							materialViewChecked: false
						},
						'logicBearing': {
							displayName: 'Logic Bearing',
							materialView: true,
							materialViewChecked: false
						},
						'foreign': {
							displayName: 'Foreign',
							supplierView: true,
							supplierViewChecked: true,
							materialView: true,
							materialViewChecked: false
						},
						'country': {
							displayName: 'Country',
							supplierView: true,
							supplierViewChecked: true,
							materialView: true,
							materialViewChecked: false
						},
						'dmeaTrustedSource': {
							displayName: 'DMEA Trusted Source',
							supplierView: true,
							supplierViewChecked: true,
							materialView: true,
							materialViewChecked: false
						},
						'gidepSubscriber': {
							displayName: 'GIDEP Subscriber',
							supplierView: true,
							supplierViewChecked: true,
							materialView: true,
							materialViewChecked: false
						}
				};
				
				expect($ctrl).toBeDefined();
				expect($ctrl.countSelected).toBeDefined();
				expect($ctrl.showSupplierView).toBeDefined();
				expect($ctrl.showMaterialView).toBeDefined();
				expect($ctrl.isDisabled).toBeDefined();
				expect($ctrl.mappedFn).toBeDefined();				
				expect($ctrl.showSwimlanes).toBe(true);
				expect($ctrl.showWatermark).toBe(true);
				expect($ctrl.isMaterialView).toBe(true);
				expect($ctrl.isSupplierView).toBe(false);
				expect($ctrl.isScheduleView).toBe(true);
				expect($ctrl.isSpcView).toBe(false);
				expect($ctrl.isQnoteView).toBe(false);
				expect($ctrl.selectedSupplier).toBeDefined();
				expect($ctrl.selectedMaterial).toBeDefined();
				expect($ctrl.selectedMaterial['foreign']).toBe(false);
				expect($ctrl.selectedSupplier['foreign']).toBe(true);
				expect($ctrl.selected).toBe($ctrl.selectedMaterial);
				expect($ctrl.attributes).toEqual(['partNumber', 'partSite', 'partMakeBuyTransfer', 'partSupplier', 'cspl', 'mcil', 'mdaSrm', 'carl', 'criticalDefenseInfo', 'logicBearing', 'foreign', 'country', 'dmeaTrustedSource', 'gidepSubscriber']);
			});

		});
		
		it( 'should determine the count selected', function(){
			expect($ctrl.countSelected()).toBe(2);
		});
		
		it( 'should show the supplier view', function(){
			var rootAssembly = {
					name: 'Root'
			};
			assemblySvcMock.query.and.returnValue($q.when(rootAssembly));
			
			spyOn( $rootScope, '$broadcast' );
			$ctrl.showSupplierView();
			$scope.$apply();
			
			expect($ctrl.isMaterialView).toBe(false);
			expect($ctrl.isSupplierView).toBe(true);
			expect($ctrl.selected).toEqual($ctrl.selectedSupplier);
			expect($ctrl.attributes).toEqual(Object.keys($ctrl.selected));
			
			expect($rootScope.$broadcast).toHaveBeenCalledWith('bomTreeRootChanged', { "assembly" : rootAssembly, "replaceTree" : true });
			
			$rootScope.$broadcast.calls.reset();
			
			$ctrl.showSupplierView();
			$scope.$apply();
			
			expect($ctrl.isMaterialView).toBe(false);
			expect($ctrl.isSupplierView).toBe(true);
			expect($ctrl.selected).toEqual($ctrl.selectedSupplier);
			expect($ctrl.attributes).toEqual(Object.keys($ctrl.selected));
			
			expect($rootScope.$broadcast).not.toHaveBeenCalled();
		});

		it( 'should show the material view', function(){
			$ctrl.isSupplierView = true;
			
			var rootAssembly = {
					name: 'Root'
			};
			assemblySvcMock.query.and.returnValue($q.when(rootAssembly));
			
			spyOn( $rootScope, '$broadcast' );
			$ctrl.showMaterialView();
			$scope.$apply();
			
			expect($ctrl.isMaterialView).toBe(true);
			expect($ctrl.isSupplierView).toBe(false);
			expect($ctrl.selected).toEqual($ctrl.selectedMaterial);
			expect($ctrl.attributes).toEqual(Object.keys($ctrl.selected));
			
			expect($rootScope.$broadcast).toHaveBeenCalledWith('bomTreeRootChanged', { "assembly" : rootAssembly, "replaceTree" : true });
			
			$rootScope.$broadcast.calls.reset();
			
			$ctrl.showMaterialView();
			$scope.$apply();
			
			expect($ctrl.isMaterialView).toBe(true);
			expect($ctrl.isSupplierView).toBe(false);
			expect($ctrl.selected).toEqual($ctrl.selectedMaterial);
			expect($ctrl.attributes).toEqual(Object.keys($ctrl.selected));
			
			expect($rootScope.$broadcast).not.toHaveBeenCalled();
		});
		
		it( 'should determine if the attribute is disabled', function(){
			expect($ctrl.isDisabled('partDescription')).toBe(true);
		});
		
		it( 'should map configuration values for attributes', function(){
			expect($ctrl.mappedFn('nothing')).toBe('nothing');
			expect($ctrl.mappedFn('foreign')).toBe('Foreign');
		});
	});
});