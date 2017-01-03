define(['ssv', 'angular-mocks', 'pages/ssv/tests/unit/mocks/AssemblySvcMock'], function(ssv, mocks, AssemblySvcMock) {
	
	describe('Test ssv-view-component controller', function() {
		/* global expect inject jasmine spyOn */

		var $componentController;
		var $rootScope;
		var $ctrl;
		var alertServiceMock;
		var assemblySvcMock;
		var $scope;
		var $q;
		var stateMock;
		var $timeout;

		beforeEach(module('ssv'));

		beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_, _$timeout_) {
			$componentController = _$componentController_;
			$rootScope = _$rootScope_;
			$q = _$q_;
			$timeout = _$timeout_;
			$scope = _$rootScope_.$new();

			assemblySvcMock = AssemblySvcMock.Basic; //jasmine.createSpyObj('assemblySvc', ['query'] );
			alertServiceMock = jasmine.createSpyObj('alertService', ['add']);
			stateMock = jasmine.createSpyObj('$state', ['go']);


			$ctrl = $componentController('ssvView', {
				$scope: $scope,
				$rootScope: $rootScope,
				$stateParams: {},
				AssemblySvc: assemblySvcMock,
				alertService: alertServiceMock,
				$state: stateMock
			});
		}));


		it('should initialize properly', function() {
			var rootAssembly = {
				name: 'Root'
			};
			assemblySvcMock.query.and.returnValue($q.when(rootAssembly));
			spyOn($rootScope, '$broadcast').and.callThrough();
			expect($ctrl.loaded).toBeFalsy();
			$ctrl.$onInit();
			$scope.$apply();


			expect($ctrl.sideBarOpen).toBe(false);
			expect($ctrl.tableOpen).toBe(false);
			expect($ctrl.treeViewType).toEqual("material");
			expect($ctrl.expandAll).toBe(false);
			expect($ctrl.showMinimap).toBe(false);
			expect($ctrl.showTable).toBe(false);
			expect($ctrl.showDetail).toBe(true);

			// flush timeout(s) for all code under test.
			$timeout.flush();
			

			expect($rootScope.$broadcast).toHaveBeenCalledWith('bomTreeRootChanged', {
				"assembly": rootAssembly,
				"replaceTree": true
			});
			expect($ctrl.loaded).toBe(true);

		});

		it('should redirect to the home page on a service error', function() {
			var defer = $q.defer();
			assemblySvcMock.query.and.returnValue(defer.promise);
			defer.reject();
			expect($ctrl.loaded).toBeFalsy();
			$ctrl.$onInit();
			$scope.$apply();

			expect(stateMock.go).toHaveBeenCalledWith('app.favorite-list');
			expect($ctrl.loaded).toBe(true);

		});

		it('should expand/collapse all by firing an event ', function() {
			spyOn($scope, '$broadcast').and.callThrough();
			expect($ctrl.expandAll).toBeFalsy();
			$ctrl.expandCollapseAll();
			$scope.$apply();
			expect($scope.$broadcast).toHaveBeenCalledWith('bomTreeExpandAll');
			expect($ctrl.expandAll).toBeTruthy();
			$ctrl.expandCollapseAll();
			$scope.$apply();
			expect($scope.$broadcast).toHaveBeenCalledWith('bomTreeCollapseAll');
			expect($ctrl.expandAll).toBeFalsy();
		});

		it('should show/hide the sidebar', function() {
			spyOn($scope, '$broadcast').and.callThrough();
			expect($ctrl.sideBarOpen).toBeFalsy();
			$ctrl.openSidebar();
			$scope.$apply();
			expect($scope.$broadcast).toHaveBeenCalledWith('openSidebar');
			expect($ctrl.sideBarOpen).toBeTruthy();
			$ctrl.openSidebar();
			$scope.$apply();
			expect($scope.$broadcast).toHaveBeenCalledWith('closeSidebar');
			expect($ctrl.sideBarOpen).toBeFalsy();
		});

		it('should fire an event when the showTable value changes', function() {
			var rootAssembly = {
				name: 'Root'
			};
			assemblySvcMock.query.and.returnValue($q.when(rootAssembly));
			spyOn($rootScope, '$broadcast').and.callThrough();
			$ctrl.$onInit();
			$scope.$apply();

			$ctrl.showTable = true;
			$scope.$apply();
			expect($rootScope.$broadcast).toHaveBeenCalledWith("openTable");
			$ctrl.showTable = false;
			$scope.$apply();
			expect($rootScope.$broadcast).toHaveBeenCalledWith("closeTable");

		});

	});
});
