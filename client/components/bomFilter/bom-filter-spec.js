define( ['ssv','angular-mocks'], function(){
	describe('Test bom-filter-component controller', function() {
		/* global inject expect pending jasmine */		
		var $componentController;
		var $rootScope;
		var ssvConfigMock;
		var localStorageMock;
		var $ctrl;
		var $scope;

		beforeEach( module('ssv') );
		
		beforeEach( inject(function(_$componentController_, _$rootScope_) {
		    $componentController = _$componentController_;
		    $rootScope = _$rootScope_;
		    $scope = _$rootScope_.$new();
		    
		    ssvConfigMock = {};
		    localStorageMock = jasmine.createSpyObj('$localStorage', ['get','set'] );
		    $ctrl = $componentController( 'bomFilter', {
		    	$scope: $scope,
		    	$rootScope: $rootScope,
		    	ssvConfig: ssvConfigMock,
		    	$localStorage: localStorageMock
		   });
		    
		    $ctrl.clearFilterStorage();
		}));
		
		describe( 'Test initialization of the bom-filter-component', function(){
			it( 'should initialize', function(){
				$ctrl.$onInit();
				$scope.$apply();
				expect($ctrl.filters.length).toEqual(1);
				expect($ctrl.filters[0].name).toEqual( 'Filter 1');
				expect($ctrl.currentFilter).toEqual($ctrl.filters[0]);
			});

			it( 'should set material & supplier attributes from the config', function(){
				$ctrl.$onInit();
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
				
				expect($ctrl.attrMaterial).toEqual(['partSite', 'partMakeBuyTransfer', 'partSupplier', 'cspl', 'mcil', 'mdaSrm', 'carl', 'criticalDefenseInfo', 'logicBearing', 'foreign', 'country', 'dmeaTrustedSource', 'gidepSubscriber']);
				expect($ctrl.attrSupplier).toEqual(['foreign', 'country', 'dmeaTrustedSource', 'gidepSubscriber']);
			});

			it( 'should initialize to material view', function(){
				$ctrl.$onInit();
				expect($ctrl.isMaterialView).toBe(true);
				expect($ctrl.attributes).toEqual($ctrl.attrMaterial);
			});
		});
		
		it( 'should create a new filter', function(){
			$ctrl.$onInit();
			var filterLen = $ctrl.filters.length;
			$ctrl.newFilter();
			expect( $ctrl.filters.length).toEqual(filterLen+1);
			expect( $ctrl.filters[$ctrl.filters.length-1].name).toEqual( 'Filter ' + (filterLen + 1) );
			expect( $ctrl.filters[$ctrl.filters.length-1].active).toBe( false );
			expect( $ctrl.currentFilter ).toEqual( $ctrl.filters[$ctrl.filters.length-1]);
			$ctrl.newFilter();
			expect( $ctrl.filters.length).toEqual(filterLen+2);
			expect( $ctrl.filters[$ctrl.filters.length-1].name).toEqual( 'Filter ' + (filterLen + 2) );
			expect( $ctrl.filters[$ctrl.filters.length-1].active).toBe( false );
			expect( $ctrl.currentFilter ).toEqual( $ctrl.filters[$ctrl.filters.length-1]);
		});
		
		it( 'should remove the current filter', function(){
			$ctrl.$onInit();
			$ctrl.removeFilter();
			expect( $ctrl.filters.length ).toEqual(0);
			$ctrl.filters = [ {name: 'Filter 1'}, {name:'Filter 2'}];
			$ctrl.currentFilter = $ctrl.filters[0];
			$ctrl.removeFilter();
			expect($ctrl.filters.length).toEqual(1);
			expect($ctrl.currentFilter.name).toEqual("Filter 2");
		});

		it( 'should toggle the active state for the current filter', function(){
			$ctrl.$onInit();
			expect( $ctrl.currentFilter.active).toBe(false);
			$ctrl.changeFilterActive();
			expect( $ctrl.currentFilter.active).toBe(true);
			$ctrl.changeFilterActive();
			expect( $ctrl.currentFilter.active).toBe(false);
		});
		
		it( 'should map configuration values for attributes', function(){
			$ctrl.$onInit();
			expect($ctrl.mappedFn('nothing')).toBe('nothing');
			expect($ctrl.mappedFn('foreign')).toBe('Foreign');
		});
		
		it( 'should apply filter changes', function(){
			spyOn($rootScope, '$broadcast').and.callThrough();
			
			localStorageMock.get.and.returnValue( null );
			$ctrl.$onInit();
			
			$ctrl.filterForm = {
				$submitted : false
			};

			$ctrl.applyFilterChange();
			$scope.$apply();
			expect($rootScope.$broadcast).toHaveBeenCalledWith('bomFilterChanged', $ctrl.filters? $ctrl.filters : [] );
			expect($ctrl.localMaterialFilters).toEqual($ctrl.filters);
			
			$ctrl.isSupplierView = true;
			$ctrl.isMaterialView = false;
			
			$ctrl.applyFilterChange();
			$scope.$apply();
			expect($rootScope.$broadcast).toHaveBeenCalledWith('bomFilterChanged', $ctrl.filters? $ctrl.filters : [] );
			expect($ctrl.localMaterialFilters).toEqual($ctrl.filters);
			
			$ctrl.filter = undefined;
			
			$ctrl.applyFilterChange();
			$scope.$apply();
			expect($rootScope.$broadcast).toHaveBeenCalledWith('bomFilterChanged', $ctrl.filters? $ctrl.filters : [] );
			expect($ctrl.localMaterialFilters).toEqual($ctrl.filters);
		});
		
		it( 'should show side nav after receiving sideNavShow event', function(){
			$ctrl.newFilter();
			$ctrl.filterForm = {
					$submitted : false
			};
			$ctrl.applyFilterChange();
			
			$ctrl.$onInit();
			$scope.$apply();
			
			$ctrl.currentFilter = null;
			$ctrl.filters = [];
			$rootScope.$broadcast('sideNavShow');
			$scope.$apply();
			expect($ctrl.currentFilter).not.toBe(null);
			expect($ctrl.filters.length).toBe(1);
		});
		
		it('should handle config changes when receiving the bomTreeConfigChanged event', function(){
			$ctrl.$onInit();
			$scope.$apply();
			
			$rootScope.$broadcast('bomTreeConfigChanged', { isMaterialView: false });			
			expect($ctrl.isMaterialView).toBe(false);
			expect($ctrl.attributes).toEqual($ctrl.attrSupplier);
			expect($ctrl.filters).toBe($ctrl.localSupplierFilters);
			
			$rootScope.$broadcast('bomTreeConfigChanged', { isMaterialView: true });			
			expect($ctrl.isMaterialView).toBe(true);
			expect($ctrl.attributes).toEqual($ctrl.attrMaterial);
			expect($ctrl.filters).toBe($ctrl.localMaterialFilters);
			
			$rootScope.$broadcast('bomTreeConfigChanged', { isMaterialView: true });			
			expect($ctrl.isMaterialView).toBe(true);
			expect($ctrl.attributes).toEqual($ctrl.attrMaterial);
			expect($ctrl.filters).toBe($ctrl.localMaterialFilters);
		});
		
		it( 'should apply filter changes after receiving sideNavHide event', function(){
			$ctrl.$onInit();
			$ctrl.filterForm = {
					$submitted : false
			};
			$scope.$apply();
			
			$rootScope.$broadcast('sideNavHide');
			
			spyOn($rootScope, '$broadcast').and.callThrough();
			
			$ctrl.applyFilterChange();
			$scope.$apply();
			expect($rootScope.$broadcast).toHaveBeenCalledWith('bomFilterChanged', $ctrl.filters? $ctrl.filters : [] );
			expect($ctrl.localMaterialFilters).toEqual($ctrl.filters);
		});
		
		it('should handle the root changing after receiving the bomTreeRootChanged event', function(){
			$ctrl.$onInit();
			$ctrl.filterForm = {
					$submitted : false
			};
			$scope.$apply();
						
			var assembly = {
					id : '1',
					_children : [{
						id : '3',
						parentId : '1',
						partSite: '123',
						scheduleStatus : 'R',
						spcStatus : 'R',
						qnoteStatus : 'R',
						scheduleStatusWorstCase : 'R',
						spcStatusWorstCase : 'R',
						qnoteStatusWorstCase : 'R',
						getColor : function(){},
						isDisplayed : function(){}
					},{
						id : '2',
						parentId : '1',
						scheduleStatus : 'R',
						spcStatus : 'R',
						qnoteStatus : 'R',
						scheduleStatusWorstCase : 'R',
						spcStatusWorstCase : 'R',
						qnoteStatusWorstCase : 'R',
						getColor : function(){},
						isDisplayed : function(){},
						children : [{
							id : '3',
							parentId : '1',
							scheduleStatus : 'R',
							spcStatus : 'R',
							qnoteStatus : 'R',
							scheduleStatusWorstCase : 'R',
							spcStatusWorstCase : 'R',
							qnoteStatusWorstCase : 'R',
							getColor : function(){},
							isDisplayed : function(){}
						}]
					}]
			};
			
			$ctrl.filters[0].active = true;
			$ctrl.filters[0].selected = {
					partSite : '123'
			};
			
			$rootScope.$broadcast('bomTreeRootChanged', {
				assembly: assembly
			});
		});
	});
});