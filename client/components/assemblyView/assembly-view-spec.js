define([ 'ssv', 'angular-mocks', 'pages/ssv/tests/unit/mocks/AssemblySvcMock', 'pages/ssv/tests/unit/mocks/FavoriteSvcMock' ], function(ssv, mocks, AssemblySvcMock, FavoriteSvcMock) {
	describe('Test assembly-view-component controller', function() {
		/* global inject expect */
		var $componentController;
		var $rootScope;
		var $ctrl;
		var assemblySvcMock;
		var $q;

		beforeEach(module('ssv'));
		beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_) {
			$componentController = _$componentController_;
			$rootScope = _$rootScope_;
			$q = _$q_;

			assemblySvcMock = AssemblySvcMock.Basic;
			favoriteSvcMock = FavoriteSvcMock.Basic;
			alertServiceMock = jasmine.createSpyObj('alertService', [ 'add' ]);

			$ctrl = $componentController('assemblyView', {
				$rootScope : $rootScope,
				alertService : alertServiceMock,
				FavoriteSvc : favoriteSvcMock,
				AssemblySvc : assemblySvcMock
			});

			$ctrl.$onInit(); // need to manually fire
								// initialization
		}));

		it('should initialize properly', function() {
			expect($ctrl).toBeDefined();
			expect($ctrl.isMaterialView).toBe(true);
			expect($ctrl.isSupplierView).toBe(false);
			expect($ctrl.isScheduleView).toBe(true);
			expect($ctrl.isSpcView).toBe(false);
			expect($ctrl.isQnoteView).toBe(false);
		});

		it('should set the assembly when receiving a bomTreeNodeSelected event', function() {
			expect($ctrl.assembly).not.toBeDefined();
			var assembly = {
				id : 1
			};
			$rootScope.$broadcast('bomTreeNodeSelected', { assembly : assembly });
			expect($ctrl.assembly).toEqual(assembly);
		});

		it('should set material view when bomTreeConfigChanged event is triggered', function() {
			$rootScope.$broadcast('bomTreeConfigChanged', { isMaterialView : false });
			expect($ctrl.isMaterialView).toBe(false);
			$rootScope.$broadcast('bomTreeConfigChanged', { isMaterialView : true });
			expect($ctrl.isMaterialView).toBe(true);
		});
		
		it('should set supplier view when bomTreeConfigChanged event is triggered', function() {
			$rootScope.$broadcast('bomTreeConfigChanged', { isSupplierView : false });
			expect($ctrl.isSupplierView).toBe(false);
			$rootScope.$broadcast('bomTreeConfigChanged', { isSupplierView : true });
			expect($ctrl.isSupplierView).toBe(true);
		});
		
		it('should set schedule view when bomTreeConfigChanged event is triggered', function() {
			$rootScope.$broadcast('bomTreeConfigChanged', { isScheduleView : false });
			expect($ctrl.isScheduleView).toBe(false);
			$rootScope.$broadcast('bomTreeConfigChanged', { isScheduleView : true });
			expect($ctrl.isScheduleView).toBe(true);
		});
		
		it('should set spc view when bomTreeConfigChanged event is triggered', function() {
			$rootScope.$broadcast('bomTreeConfigChanged', { isSpcView : false });
			expect($ctrl.isSpcView).toBe(false);
			$rootScope.$broadcast('bomTreeConfigChanged', { isSpcView : true });
			expect($ctrl.isSpcView).toBe(true);
		});
		
		it('should set qnote view when bomTreeConfigChanged event is triggered', function() {
			$rootScope.$broadcast('bomTreeConfigChanged', { isQnoteView : false });
			expect($ctrl.isQnoteView).toBe(false);
			$rootScope.$broadcast('bomTreeConfigChanged', { isQnoteView : true });
			expect($ctrl.isQnoteView).toBe(true);
		});
	});
});