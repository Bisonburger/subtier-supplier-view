define([ 'ssv', 'angular-mocks', 'pages/ssv/tests/unit/mocks/AssemblySvcMock',
		'pages/ssv/tests/unit/mocks/FavoriteSvcMock',
		'pages/ssv/tests/unit/mocks/SupplierSvcMock' ], function(ssv, mocks,
		AssemblySvcMock, FavoriteSvcMock, SupplierSvcMock) {
	describe('Test favorite-details-component controller', function() {

		/* global inject pending */
		var $componentController;
		var $ctrl;
		var $scope;
		var $rootScope;
		var stateMock;
		var alertServiceMock;
		var assemblySvcMock;
		var supplierSvcMock;
		var favoriteSvcMock;

		beforeEach(module('ssv'));
		beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_) {
			$componentController = _$componentController_;
			$q = _$q_;
			$scope = _$rootScope_.$new();
			$rootScope = _$rootScope_;

			stateMock = jasmine.createSpyObj('$state', [ 'go' ]);
			alertServiceMock = jasmine.createSpyObj('alertService', [ 'add' ]);
			assemblySvcMock = AssemblySvcMock.Basic;
			supplierSvcMock = SupplierSvcMock.Basic;
			favoriteSvcMock = FavoriteSvcMock.Basic;

			$ctrl = $componentController('favoriteDetails', {
				$scope : $scope,
				$state : stateMock,
				$stateParams : {},
				alertService : alertServiceMock,
				AssemblySvc : assemblySvcMock,
				SupplierSvc : supplierSvcMock,
				FavoriteSvc : favoriteSvcMock
			});
		}));

		it('should initialize properly with no state params', function() {
			var favorite = {
				id : '1'
			};
			favoriteSvcMock.create.and.returnValue($q.when(favorite));

			$ctrl.$onInit();
			$scope.$apply();

			expect($ctrl.loaded).toBe(true);
			expect($ctrl.isAdd).toBe(true);
			expect(angular.isArray($ctrl.matchingAssemblies)).toBe(true);
			expect($ctrl.showNoMatchingAssembliesError).toBe(false);
			expect($ctrl.selectedAssembly).toBe(null);
			expect($ctrl.partSelected).toBe(false);
			expect($ctrl.favorite).toBeDefined();
		});

		it('should initialize properly with state params and load favorite', function() {
			$ctrl = $componentController('favoriteDetails', {
				$scope : $scope,
				$state : stateMock,
				$stateParams : {
					id : '1'
				},
				alertService : alertServiceMock,
				AssemblySvc : assemblySvcMock,
				SupplierSvc : supplierSvcMock,
				FavoriteSvc : favoriteSvcMock
			});

			var favorite = {
				id : '1'
			};
			favoriteSvcMock.fetch.and.returnValue($q.when(favorite));

			$ctrl.$onInit();
			$scope.$apply();

			expect($ctrl.loaded).toBe(true);
			expect($ctrl.isAdd).toBe(false);
			expect(angular.isArray($ctrl.matchingAssemblies)).toBe(true);
			expect($ctrl.showNoMatchingAssembliesError).toBe(false);
			expect($ctrl.selectedAssembly).toBe(null);
			expect($ctrl.partSelected).toBe(true);
			expect($ctrl.favorite).toBeDefined();
		});
		
		it('should initialize properly, but be unable to load favorite that doesn\'t exist', function() {
			$ctrl = $componentController('favoriteDetails', {
				$scope : $scope,
				$state : stateMock,
				$stateParams : {
					id : '1'
				},
				alertService : alertServiceMock,
				AssemblySvc : assemblySvcMock,
				SupplierSvc : supplierSvcMock,
				FavoriteSvc : favoriteSvcMock
			});

			favoriteSvcMock.fetch.and.returnValue($q.when(null));

			$ctrl.$onInit();
			$scope.$apply();

			$rootScope.$digest();
			expect($ctrl.loaded).toBe(false);
			expect(stateMock.go).toHaveBeenCalledWith('app.favorite-list', null, {reload: true});
		});

		it('should search for assemblies based on the search term', function() {
			$ctrl.selectedSupplier = {
				name : 'Raytheon'
			};

			var result = {
				id : '1'
			};
			
			assemblySvcMock.findAssemblies.and.returnValue($q.when(result));

			$ctrl.searchAssemblies('searchterm');

			expect(assemblySvcMock.findAssemblies).toHaveBeenCalled();
		});

		it('should search for a supplier based on the search term', function() {
			var result = {
				id : '1'
			};

			supplierSvcMock.findSuppliers.and.returnValue($q.when(result));

			$ctrl.searchSuppliers('searchterm');

			expect(supplierSvcMock.findSuppliers).toHaveBeenCalled();
		});

		it('should save the user\'s favorites', function() {
			$ctrl.favorite = {
				id : '1',
				$update : function() {
					return $q.when({});
				}
			};
			
			$ctrl.form = {
					$setPristine : function(){}
			};

			$ctrl.partSelected = true;
			$ctrl.save();

			$rootScope.$digest();
			expect(stateMock.go).toHaveBeenCalledWith('app.favorite-list');
		});
		
		it('attempt to save with no part selected', function() {
			$ctrl.favorite = {
				id : '1',
				$update : function() {
					return $q.when({});
				}
			};

			$ctrl.partSelected = false;
			$ctrl.save();
		});

		it('should cancel saving the user\'s favorites', function() {
			$ctrl.cancelSave();

			expect(stateMock.go).toHaveBeenCalledWith('app.favorite-list');
		});
		
		it('on part selected values should be set', function() {
			var item = {partNumber: '123', partSite : '456', assemblyNumber : '789', assemblySite : '9'};
			var model = {id : '1'};
			var label = {id : '1'};
			
			$ctrl.favorite = {};
			
		    $scope.onSelect(item, model, label);
		    
			expect($ctrl.partSelected).toBe(true);
			expect($ctrl.selectedAssembly).toBe(item);
			expect($ctrl.favorite.partNumber).toBe(item.partNumber);
			expect($ctrl.favorite.partSite).toBe(item.partSite);
			expect($ctrl.favorite.assemblyNumber).toBe(item.assemblyNumber);
			expect($ctrl.favorite.assemblySite).toBe(item.assemblySite);
			expect($scope.$item).toBe(item);
			expect($scope.$model).toBe(model);
			expect($scope.$label).toBe(label);
		});
	});
});