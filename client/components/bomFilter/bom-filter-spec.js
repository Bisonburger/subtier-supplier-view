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
		    $ctrl = $componentController( 'bomFilter', 
		    	{
		    		$scope: $scope,
		    		$rootScope: $rootScope,
		    		ssvConfig: ssvConfigMock,
		    		$localStorage: localStorageMock
		    	});
		  }));
		
				
		describe( 'Test initialization of the bom-filter-component', function(){
			
			it( 'should initialize without localstorage values', function(){
				localStorageMock.get.and.returnValue( null );
				$ctrl.$onInit();
				$scope.$apply();
				expect($ctrl.filters.length).toEqual(1);
				expect($ctrl.filters[0].name).toEqual( 'Filter 1');
				expect($ctrl.currentFilter).toEqual($ctrl.filters[0]);
			});

			it( 'should initialize with localstorage values', function(){
				pending();
			});
			
			it( 'should set material & supplier attributes from the config', function(){
				//TODO: write test
			});

			it( 'should initialize to material view', function(){
				localStorageMock.get.and.returnValue( null );
				$ctrl.$onInit();
				expect($ctrl.isMaterialView).toBe(true);
				expect($ctrl.attributes).toEqual($ctrl.attrMaterial);
			});

		});
		
		it( 'should create a new filter', function(){
				localStorageMock.get.and.returnValue( null );
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
			localStorageMock.get.and.returnValue( null );
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
			localStorageMock.get.and.returnValue( null );
			$ctrl.$onInit();
			expect( $ctrl.currentFilter.active).toBe(false);
			$ctrl.changeFilterActive();
			expect( $ctrl.currentFilter.active).toBe(true);
			$ctrl.changeFilterActive();
			expect( $ctrl.currentFilter.active).toBe(false);
		});
		
		it( 'should map configuration values for attributes', function(){
			//TODO: write test
			pending();
		});

	});
});
		
