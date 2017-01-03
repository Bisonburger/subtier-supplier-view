
define(['ssv', 'angular-mocks'], function() {
	/* global expect inject */

	describe('Test assembly-legend-component controller', function() {

		var $componentController;
		var $rootScope;
		var $ctrl;

		beforeEach(module('ssv'));
		beforeEach(inject(function(_$componentController_, _$rootScope_) {
			$componentController = _$componentController_;
			$rootScope = _$rootScope_;
			$ctrl = $componentController('assemblyLegend', null);
			$ctrl.$onInit(); // need to manually fire initialization
		}));


		it('should initialize to material view', function() {

			expect($ctrl).toBeDefined();
			expect($ctrl.isMaterialView).toBe(true);
			expect($ctrl.isSupplierView).toBe(false);
			expect($ctrl.isScheduleView).toBe(true);
			expect($ctrl.isSpcView).toBe(false);
			expect($ctrl.isQnoteView).toBe(false);
		});

		it('should set material view when bomTreeConfigChanged event is triggered', function() {
			$rootScope.$broadcast('bomTreeConfigChanged', {
				isMaterialView: false
			});
			expect($ctrl.isMaterialView).toBe(false);
			$rootScope.$broadcast('bomTreeConfigChanged', {
				isMaterialView: true
			});
			expect($ctrl.isMaterialView).toBe(true);
		});

	});
});
