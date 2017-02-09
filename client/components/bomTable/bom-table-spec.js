define( ['ssv','angular-mocks', 'pages/ssv/tests/unit/mocks/AssemblySvcMock'], function(ssv, mocks, AssemblySvcMock){
	describe('Test bom-table-component controller', function() {
		/* global inject pending */
		var $componentController;
		var $scope;
		var $rootScope;
		var assemblySvcMock;

		beforeEach( module('ssv') );
		beforeEach( inject(function(_$componentController_, _$rootScope_ ) {
			$componentController = _$componentController_;
		    $scope = _$rootScope_.$new();
		    $rootScope = _$rootScope_;
		    assemblySvcMock = AssemblySvcMock.Basic;
		    
			$ctrl = $componentController('bomTable', {
				$scope : $scope,
				$rootScope : $rootScope,
				AssemblySvc : assemblySvcMock
			});
			$ctrl.$onInit();
		}));
		
		it( 'should initialize', function(){
			expect($ctrl).toBeDefined();
			expect($ctrl.initialLoadComplete).toBe(false);
			expect($ctrl.assembly).toBe(null);
			expect($ctrl.isScheduleView).toBe(true);
			expect($ctrl.isSpcView).toBe(false);
			expect($ctrl.isQnoteView).toBe(false);
			expect($ctrl.isMaterialView).toBe(true);
			expect($ctrl.isSupplierView).toBe(false);
			expect($ctrl.madeRoot).toBe(false);
			expect($ctrl.changeTreeRoot).toBeDefined();
			expect($ctrl.zoomToAssembly).toBeDefined();
			expect($ctrl.clearSearch).toBeDefined();
			expect($ctrl.resetView).toBeDefined();
			expect(angular.isArray($ctrl.assemblies)).toBe(true);
			
			expect($ctrl.originalAssembly).not.toBeDefined();
			expect($ctrl.search).toEqual({});
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
		
		it('should set supplier view when bomTreeConfigChanged event is triggered', function() {
			$rootScope.$broadcast('bomTreeConfigChanged', {
				isSupplierView: false
			});
			expect($ctrl.isSupplierView).toBe(false);
			$rootScope.$broadcast('bomTreeConfigChanged', {
				isSupplierView: true
			});
			expect($ctrl.isSupplierView).toBe(true);
		});
		
		it('should set schedule view when bomTreeConfigChanged event is triggered', function() {
			$rootScope.$broadcast('bomTreeConfigChanged', {
				isScheduleView: false
			});
			expect($ctrl.isScheduleView).toBe(false);
			$rootScope.$broadcast('bomTreeConfigChanged', {
				isScheduleView: true
			});
			expect($ctrl.isScheduleView).toBe(true);
		});
		
		it('should set spc view when bomTreeConfigChanged event is triggered', function() {
			$rootScope.$broadcast('bomTreeConfigChanged', {
				isSpcView: false
			});
			expect($ctrl.isSpcView).toBe(false);
			$rootScope.$broadcast('bomTreeConfigChanged', {
				isSpcView: true
			});
			expect($ctrl.isSpcView).toBe(true);
		});
		
		it('should set qnote view when bomTreeConfigChanged event is triggered', function() {
			$rootScope.$broadcast('bomTreeConfigChanged', {
				isQnoteView: false
			});
			expect($ctrl.isQnoteView).toBe(false);
			$rootScope.$broadcast('bomTreeConfigChanged', {
				isQnoteView: true
			});
			expect($ctrl.isQnoteView).toBe(true);
		});
		
		it('should clear the search term when bomTreeConfigChanged event is triggered', function() {
			$rootScope.$broadcast('bomTreeConfigChanged', {
				isMaterialView: false
			});
			expect($ctrl.search).toEqual({});
		});
		
		it('should call handleOpenTable when bomTreeConfigChanged event is triggered and assemblies are present', function() {
			$ctrl.assembly = {
					id : '1',
					children : [{
						id : '2',
						children : [{
							id : '4'
						},{
							id : '5'
						}]
					},{
						id : '3',
						children : [{
							id : '6'
						},{
							id : '7'
						}]
					}]
			};
			
			$ctrl.assemblies = [{id : '1'},{id : '2'}];
			
			$rootScope.$digest();
			
			$rootScope.$broadcast('bomTreeConfigChanged', {
				isSupplierView: true
			});
			expect($ctrl.isSupplierView).toBe(true);
			expect($ctrl.assemblies.length).toBe(7);
		});
		
		it('should handle opening the table', function() {
			$ctrl.assembly = {
					id : '1',
					scheduleStatus : 'R',
					spcStatus : 'R',
					qnoteStatus : 'R',
					scheduleStatusWorstCase : 'R',
					spcStatusWorstCase : 'R',
					qnoteStatusWorstCase : 'R',
					children : [{
						id : '2',
						scheduleStatus : 'G',
						spcStatus : 'G',
						qnoteStatus : 'G',
						scheduleStatusWorstCase : 'G',
						spcStatusWorstCase : 'G',
						qnoteStatusWorstCase : 'G',
						children : [{
							id : '4',
							scheduleStatus : 'G',
							spcStatus : 'G',
							qnoteStatus : 'G',
							scheduleStatusWorstCase : 'G',
							spcStatusWorstCase : 'G',
							qnoteStatusWorstCase : 'G'
						},{
							id : '5',
							scheduleStatus : 'R',
							spcStatus : 'R',
							qnoteStatus : 'R',
							scheduleStatusWorstCase : 'R',
							spcStatusWorstCase : 'R',
							qnoteStatusWorstCase : 'R'
						}]
					},{
						id : '3',
						scheduleStatus : 'Y',
						spcStatus : 'Y',
						qnoteStatus : 'Y',
						scheduleStatusWorstCase : 'Y',
						spcStatusWorstCase : 'Y',
						qnoteStatusWorstCase : 'Y',
						children : [{
							id : '6',
							scheduleStatus : 'G',
							spcStatus : 'G',
							qnoteStatus : 'G',
							scheduleStatusWorstCase : 'G',
							spcStatusWorstCase : 'G',
							qnoteStatusWorstCase : 'G'
						},{
							id : '7',
							scheduleStatus : 'R',
							spcStatus : 'Y',
							qnoteStatus : 'G',
							scheduleStatusWorstCase : 'R',
							spcStatusWorstCase : 'Y',
							qnoteStatusWorstCase : 'G'
						},{
							id : '8'
						},{
							id : '9',
							scheduleStatus : 'G',
							spcStatus : 'Y',
							qnoteStatus : 'R',
							scheduleStatusWorstCase : 'G',
							spcStatusWorstCase : 'Y',
							qnoteStatusWorstCase : 'R'
						},{
							id : '10',
							scheduleStatus : 'Y',
							spcStatus : 'R',
							qnoteStatus : 'G',
							scheduleStatusWorstCase : 'Y',
							spcStatusWorstCase : 'R',
							qnoteStatusWorstCase : 'G'
						},{
							id : '11',
							scheduleStatus : 'R',
							spcStatus : 'G',
							qnoteStatus : 'Y',
							scheduleStatusWorstCase : 'R',
							spcStatusWorstCase : 'G',
							qnoteStatusWorstCase : 'Y'
						},{
							id : '12'
						},{
							id : '13',
							scheduleStatus : 'R',
							spcStatus : 'R',
							qnoteStatus : 'R',
							scheduleStatusWorstCase : 'R',
							spcStatusWorstCase : 'R',
							qnoteStatusWorstCase : 'R'
						},{
							id : '14',
							scheduleStatus : 'Y',
							spcStatus : 'Y',
							qnoteStatus : 'Y',
							scheduleStatusWorstCase : 'Y',
							spcStatusWorstCase : 'Y',
							qnoteStatusWorstCase : 'Y'
						},
						{
							id : '15',
							scheduleStatus : 'G',
							spcStatus : 'G',
							qnoteStatus : 'G',
							scheduleStatusWorstCase : 'G',
							spcStatusWorstCase : 'G',
							qnoteStatusWorstCase : 'G'
						},{
							id : '16',
							scheduleStatus : 'G',
							spcStatus : 'G',
							qnoteStatus : 'G',
							scheduleStatusWorstCase : 'G',
							spcStatusWorstCase : 'G',
							qnoteStatusWorstCase : 'G'
						},{
							id : '17',
							scheduleStatus : 'R',
							spcStatus : 'R',
							qnoteStatus : 'G',
							scheduleStatusWorstCase : 'R',
							spcStatusWorstCase : 'R',
							qnoteStatusWorstCase : 'G'
						},{
							id : '18',
							scheduleStatus : 'G',
							spcStatus : 'G',
							qnoteStatus : 'G',
							scheduleStatusWorstCase : 'G',
							spcStatusWorstCase : 'G',
							qnoteStatusWorstCase : 'G'
						}]
					}],
					_children : [{
						id : '19',
						scheduleStatus : 'R',
						spcStatus : 'R',
						qnoteStatus : 'G',
						scheduleStatusWorstCase : 'R',
						spcStatusWorstCase : 'R',
						qnoteStatusWorstCase : 'G'
					},{
						id : '20',
						scheduleStatus : 'G',
						spcStatus : 'G',
						qnoteStatus : 'G',
						scheduleStatusWorstCase : 'G',
						spcStatusWorstCase : 'G',
						qnoteStatusWorstCase : 'G'
					}]
			};
			
			$ctrl.handleOpenTable();
			
			$ctrl.isScheduleView = false;
			$ctrl.isSpcView = true;
			$ctrl.isQnoteView = false;
			$rootScope.$digest();			
			$ctrl.handleOpenTable();

			$ctrl.isScheduleView = false;
			$ctrl.isSpcView = false;
			$ctrl.isQnoteView = true;
			$rootScope.$digest();
			$ctrl.handleOpenTable();
			
			//switch to supplier view
			$ctrl.isMaterialView = false;
			$ctrl.isSupplierView = true;
			
			$ctrl.isScheduleView = true;
			$ctrl.isSpcView = false;
			$ctrl.isQnoteView = false;
			$rootScope.$digest();
			$ctrl.handleOpenTable();
			
			$ctrl.isScheduleView = false;
			$ctrl.isSpcView = true;
			$ctrl.isQnoteView = false;
			$rootScope.$digest();
			$ctrl.handleOpenTable();
			
			$ctrl.isScheduleView = false;
			$ctrl.isSpcView = false;
			$ctrl.isQnoteView = true;
			$rootScope.$digest();
			$ctrl.handleOpenTable();
		});
		
		it('should handle closing the table', function() {
			$ctrl.handleCloseTable();
			
			expect($ctrl.assemblies.length).toBe(0);
		});
		
		it('search values should be the value entered unless blank strings which change to undefined', function() {
			$ctrl.search.bomLevel = '';
			$rootScope.$digest();
			expect($ctrl.search.bomLevel).toBe(undefined);
			
			$ctrl.search.partNumber = '';
			$rootScope.$digest();
			expect($ctrl.search.partNumber).toBe(undefined);
			
			$ctrl.search.partDescription = '';
			$rootScope.$digest();
			expect($ctrl.search.partDescription).toBe(undefined);
			
			$ctrl.search.partSite = '';
			$rootScope.$digest();
			expect($ctrl.search.partSite).toBe(undefined);
			
			$ctrl.search.partSupplier = '';
			$rootScope.$digest();
			expect($ctrl.search.partSupplier).toBe(undefined);
			
			$ctrl.search.scheduleDaysLate = '';
			$rootScope.$digest();
			expect($ctrl.search.scheduleDaysLate).toBe(undefined);
			
			$ctrl.search.scheduleQuantityLate = '';
			$rootScope.$digest();
			expect($ctrl.search.scheduleQuantityLate).toBe(undefined);
			
			$ctrl.search.spcReason = '';
			$rootScope.$digest();
			expect($ctrl.search.spcReason).toBe(undefined);
			
			$ctrl.search.qnoteReason = '';
			$rootScope.$digest();
			expect($ctrl.search.qnoteReason).toBe(undefined);
		});
		
		it('should call handleChangedRoot when bomTreeRootChanged event is triggered', function() {
			var rootAssembly = {
					name: 'Root'
				};
			
			$rootScope.$broadcast('bomTreeRootChanged', {
				assembly: rootAssembly
			});
			
			expect($ctrl.initialLoadComplete).toBe(true);
		});
		
		it('should call handleChangedRoot and populate assemblies when bomTreeRootChanged event is triggered', function() {
			$ctrl.initialLoadComplete = true;
			
			var rootAssembly = {
					name: 'Root'
			};
			
			$rootScope.$broadcast('bomTreeRootChanged', {
				assembly: rootAssembly
			});
			
			expect($ctrl.assemblies.length).toBe(1);
		});
		
		it('should change the tree root', function() {
			var assembly = {
					id : '1'
			};
			
			$ctrl.changeTreeRoot(assembly);
			
			expect($ctrl.madeRoot).toBe(true);
		});
		
		it('should clear the search terms', function() {
			$ctrl.clearSearch();
			
			expect($ctrl.search.bomLevel).toBe(undefined);
			expect($ctrl.search.partNumber).toBe(undefined);
			expect($ctrl.search.partDescription).toBe(undefined);
			expect($ctrl.search.partSite).toBe(undefined);
			expect($ctrl.search.partSupplier).toBe(undefined);
			expect($ctrl.search.scheduleDaysLate).toBe(undefined);
			expect($ctrl.search.scheduleQuantityLate).toBe(undefined);
			expect($ctrl.search.spcReason).toBe(undefined);
			expect($ctrl.search.qnoteReason).toBe(undefined);
		});
		
		it('should scroll to the top of the page and call the bomTreeZoom event', function() {
			var assembly = {
					id : '1'
			};
			
			spyOn($rootScope, '$broadcast').and.callThrough();
			$ctrl.zoomToAssembly(assembly);
			$scope.$apply();
			expect($rootScope.$broadcast).toHaveBeenCalledWith('bomTreeZoom', { "assembly" : assembly });
			
			//TODO should probably test for scrolling to top of the page, but not seeing a way to do this so far
		});
		
		it('should reset the view', function() {
			spyOn($rootScope, '$broadcast').and.callThrough();
			
			$ctrl.resetView();
			
			$scope.$apply();
			expect($rootScope.$broadcast).toHaveBeenCalledWith('bomTreeRootChanged', { "assembly" : $ctrl.assembly, "replaceTree" : true, "resetTree" : true });
			expect($ctrl.madeRoot).toBe(false);
		});
	});
});