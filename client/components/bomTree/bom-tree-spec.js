define( ['ssv','angular-mocks', 'pages/ssv/tests/unit/mocks/AssemblySvcMock'], function(ssv, mocks, AssemblySvcMock){
	describe('Test bom-tree-component controller', function() {
		/* global inject pending */
		var $componentController;
		var $scope;
		var $rootScope;
		var $timeout;
		var $window;
		var localStorageMock;
		var ssvConfigMock;
		var assemblySvcMock;

		beforeEach( module('ssv') );
		beforeEach( inject(function(_$componentController_, _$rootScope_, _$timeout_, _$window_ ) {
		    $componentController = _$componentController_;
		    $rootScope = _$rootScope_;
		    $scope = _$rootScope_.$new();
		    $timeout = _$timeout_;
		    $window = _$window_;
		    localStorageMock = jasmine.createSpyObj('$localStorage', ['get','set'] );
		    ssvConfigMock = {};
		    assemblySvcMock = AssemblySvcMock.Basic;
		    
			$ctrl = $componentController('bomTree', {
				$scope : $scope,
				$rootScope : $rootScope,
				$timeout : $timeout,
				$window : $window,
				$localStorage: localStorageMock,
				ssvConfig: ssvConfigMock,
				AssemblySvc : assemblySvcMock
			});
			
			$ctrl.$onInit();
			
			$scope.$apply();
			
			$ctrl.root = {
					id : '1',
					partNumber : '12345',
					scheduleStatus : 'R',
					spcStatus : 'R',
					qnoteStatus : 'R',
					scheduleStatusWorstCase : 'R',
					spcStatusWorstCase : 'R',
					qnoteStatusWorstCase : 'R',
					getColor : function(){return 'red';},
					getWorstCaseColor : function(){return 'red';},
					isDisplayed : function(){return true;},
					children : [{
						id : '2',
						parentId : '1',
						scheduleStatus : 'R',
						spcStatus : 'R',
						qnoteStatus : 'R',
						scheduleStatusWorstCase : 'R',
						spcStatusWorstCase : 'R',
						qnoteStatusWorstCase : 'R',
						getColor : function(){return 'red';},
						getWorstCaseColor : function(){return 'red';},
						isDisplayed : function(){return true;}
					}],
					_children : [{
						id : '3',
						parentId : '1',
						scheduleStatus : 'R',
						spcStatus : 'R',
						qnoteStatus : 'R',
						scheduleStatusWorstCase : 'R',
						spcStatusWorstCase : 'R',
						qnoteStatusWorstCase : 'R',
						getColor : function(){return 'red';},
						getWorstCaseColor : function(){return 'red';},
						isDisplayed : function(){return true;},
						_children : [{
							id : '4',
							parentId : '3',
							scheduleStatus : 'R',
							spcStatus : 'R',
							qnoteStatus : 'R',
							scheduleStatusWorstCase : 'R',
							spcStatusWorstCase : 'R',
							qnoteStatusWorstCase : 'R',
							getColor : function(){return 'red';},
							getWorstCaseColor : function(){return 'red';},
							isDisplayed : function(){return true;}
						}]
					}]
			};
			
			$scope.$apply();
			$timeout.flush();
		}));

		describe( 'Test initialization of the bom-tree-component', function(){

			it( 'should initialize to material view', function(){
				expect($ctrl).toBeDefined();
				expect($ctrl.updateTree).toBeDefined();
				expect($ctrl.selectAssembly).toBeDefined();
				expect($ctrl.expandAssembly ).toBeDefined();
				expect($ctrl.computePath  ).toBeDefined();
				expect($ctrl.isLoaded).toBe(true);
			});
			
			it( 'should initialize to material view with mini map active', function(){
				$ctrl.minimap = true;
				
				$scope.$apply();
				
				$ctrl.$onInit();
				expect($ctrl).toBeDefined();
				expect($ctrl.updateTree).toBeDefined();
				expect($ctrl.selectAssembly).toBeDefined();
				expect($ctrl.expandAssembly ).toBeDefined();
				expect($ctrl.computePath  ).toBeDefined();
				
				expect($ctrl.isLoaded).toBe(true);
			});
		});
		
		it( 'should apply filtering', function(){
			var filterColor = '#FF0000';
			
			//active highlight filter
			$ctrl.filter = [{
				active : true,
				selectType : 'highlight',
				partNumber : '12345',
				selectedColor : filterColor
			}];
			
			$ctrl.updateTree(false);
			$scope.$apply();
			$timeout.flush();
			var filterApplied = false;
	    	angular.forEach( $ctrl.nodes, function(node){
	    		if(node.highlighted){
	    			filterApplied = true;
	    		}
	    	});
			expect(filterApplied).toBe(true);
			
			//active greyed out filter
			$ctrl.filter = [{
				active : true,
				selectType : 'grey',
				partNumber : '12345',
				selectedColor : '#FF0000'
			}];
			
			$ctrl.updateTree(false);
			$scope.$apply();
			$timeout.flush();
			var greyApplied = false;
	    	angular.forEach( $ctrl.nodes, function(node){
	    		if(node.greyed){
	    			greyApplied = true;
	    		}
	    	});
			expect(greyApplied).toBe(true);
			expect($ctrl.isLoaded).toBe(true);
			
			$ctrl.filter = [{
				active : false,
				selectType : 'grey',
				partNumber : '12345',
				selectedColor : '#FF0000'
			}];
			
			//deactivate filter
			$ctrl.updateTree(false);
			$scope.$apply();
			$timeout.flush();
			highlightApplied = false;
			greyApplied = false;
	    	angular.forEach( $ctrl.nodes, function(node){
	    		if(node.greyed){
	    			greyApplied = true;
	    		}
	    		if(node.highlighted){
	    			highlightApplied = true;
	    		}
	    	});
	    	expect(greyApplied).toBe(false);
	    	expect(greyApplied).toBe(false);
			expect($ctrl.isLoaded).toBe(true);
		});
		
        it('should respond to the bomTreeZoom event for a visible node', function(){
        	var opts = {};
        	opts.assembly = {
        			id : '2'
        	};
        	
			spyOn($rootScope, '$broadcast').and.callThrough();
			$rootScope.$broadcast('bomTreeZoom', { assembly: opts.assembly });
			$scope.$apply();
			expect($rootScope.$broadcast).toHaveBeenCalledWith('bomTreeNodeSelected', { assembly: opts.assembly, pathToRoot: [{id : '2'}]});
			expect(angular.equals($ctrl.assembly, opts.assembly)).toBe(true);
        });
        
        it('should respond to the bomTreeZoom event for a hidden node', function(){
        	var opts = {};
        	opts.assembly = {
					id : '4',
					parentId : '3',
					scheduleStatus : 'R',
					spcStatus : 'R',
					qnoteStatus : 'R',
					scheduleStatusWorstCase : 'R',
					spcStatusWorstCase : 'R',
					qnoteStatusWorstCase : 'R',
					getColor : function(){return 'red';},
					getWorstCaseColor : function(){return 'red';},
					isDisplayed : function(){return true;}
        	};
        	
        	$ctrl.originalRoot = $ctrl.root;
        	
			spyOn($rootScope, '$broadcast').and.callThrough();
			$rootScope.$broadcast('bomTreeZoom', { assembly: opts.assembly });
			$scope.$apply();
			expect(angular.equals($ctrl.assembly, opts.assembly)).toBe(true);
        });
        
        it('should compute the SVG path to draw between nodes', function(){
        	$ctrl.config.attributes = [];
        	
        	var path = {
        			source : {
            			x : 250,
            			y : 250
        			},
        			target : {
            			x : 250,
            			y : 250
        			}
        	};
        	
        	$ctrl.computePath(path);
        });
        
		it('should call handleChangedRoot and populate assemblies when bomTreeRootChanged event is triggered', function() {
			$ctrl.initialLoadComplete = true;
			
			var rootAssembly = { name: 'root' };
			$rootScope.$broadcast('bomTreeRootChanged', { assembly: rootAssembly });
			$scope.$apply();
			expect(angular.equals($ctrl.assembly, rootAssembly)).toBe(true);
			
			var originalRootAssembly = { name: 'original root' };
			$ctrl.originalRoot = originalRootAssembly;
			$rootScope.$broadcast('bomTreeRootChanged', { assembly: originalRootAssembly, resetTree : true });
			$scope.$apply();
			expect(angular.equals($ctrl.root, originalRootAssembly)).toBe(true);
			
			$rootScope.$broadcast('bomTreeRootChanged', { assembly: rootAssembly, replaceTree : true });
			$scope.$apply();
			expect(angular.equals($ctrl.root, rootAssembly)).toBe(true);
		});
		
		it('should handle a config change when bomTreeConfigChanged event is triggered', function() {
			var config = {isMaterialView: false};
			
			$rootScope.$broadcast( 'bomTreeConfigChanged', config );
			$scope.$apply();
			expect( $ctrl.config ).toBe(config);
		});
		
		it('should handle a filter change when bomFilterChanged event is triggered', function() {
			var filter = {name : 'filter'};
			
			$rootScope.$broadcast( 'bomFilterChanged', filter );
			$scope.$apply();
			expect( $ctrl.filter ).toBe(filter);
		});
		
		it('should handle expanding all nodes when bomTreeExpandAll event is triggered', function() {
			$rootScope.$broadcast( 'bomTreeExpandAll');
			$scope.$apply();
			$timeout.flush();
			expect($ctrl.isLoaded).toBe(true);
		});
		
		it('should handle collpasing all nodes when bomTreeCollapseAll event is triggered', function() {
			$rootScope.$broadcast( 'bomTreeCollapseAll');
			$scope.$apply();
			$timeout.flush();
			expect($ctrl.isLoaded).toBe(true);
		});
		
		it('should expand assembly and children should change from hidden to visible and vice versa', function() {
			var assembly = {
					id : '1',
					_children : [{
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
						isDisplayed : function(){}
					}]
			};
			
			$ctrl.expandAssembly(assembly);
			
			expect(assembly.children.length == 2);
			expect(assembly._children).toBe(null);
			
			$ctrl.expandAssembly(assembly);
			
			expect(assembly._children.length == 2);
			expect(assembly.children).toBe(null);
		});
		
		it( 'should update node color', function(){
			var nodeHasColor = false;

			// material / schedule view
			$ctrl.config.isScheduleView = true;
			$ctrl.config.isSpcView = false;
			$ctrl.config.isQnoteView = false;
			$ctrl.updateTree(false);
			$scope.$apply();
			$timeout.flush();
	    	angular.forEach( $ctrl.nodes, function(node){
	    		if(node.color == 'red'){
	    			nodeHasColor = true;
	    		}
	    		node.color = null;
	    	});
			expect(nodeHasColor).toBe(true);
			
			// material / spc view
			$ctrl.config.isScheduleView = false;
			$ctrl.config.isSpcView = true;
			$ctrl.config.isQnoteView = false;
			$ctrl.updateTree(false);
			$scope.$apply();
			$timeout.flush();
			nodeHasColor = false;
	    	angular.forEach( $ctrl.nodes, function(node){
	    		if(node.color == 'red'){
	    			nodeHasColor = true;
	    		}
	    		node.color = null;
	    	});
			expect(nodeHasColor).toBe(true);
			
			// material / qnote view
			$ctrl.config.isScheduleView = false;
			$ctrl.config.isSpcView = false;
			$ctrl.config.isQnoteView = true;
			$ctrl.updateTree(false);
			$scope.$apply();
			$timeout.flush();
			nodeHasColor = false;
	    	angular.forEach( $ctrl.nodes, function(node){
	    		if(node.color == 'red'){
	    			nodeHasColor = true;
	    		}
	    		node.color = null;
	    	});
			expect(nodeHasColor).toBe(true);
			
			$ctrl.config.isMaterialView = false;
			$ctrl.config.isSupplierView = true;
			
			// supplier / schedule view
			$ctrl.config.isScheduleView = true;
			$ctrl.config.isSpcView = false;
			$ctrl.config.isQnoteView = false;
			$ctrl.updateTree(false);
			$scope.$apply();
			$timeout.flush();
	    	angular.forEach( $ctrl.nodes, function(node){
	    		if(node.color == 'red'){
	    			nodeHasColor = true;
	    		}
	    		node.color = null;
	    	});
			expect(nodeHasColor).toBe(true);
			
			// supplier / spc view
			$ctrl.config.isScheduleView = false;
			$ctrl.config.isSpcView = true;
			$ctrl.config.isQnoteView = false;
			$ctrl.updateTree(false);
			$scope.$apply();
			$timeout.flush();
	    	angular.forEach( $ctrl.nodes, function(node){
	    		if(node.color == 'red'){
	    			nodeHasColor = true;
	    		}
	    		node.color = null;
	    	});
			expect(nodeHasColor).toBe(true);
			
			// supplier / qnote view
			$ctrl.config.isScheduleView = false;
			$ctrl.config.isSpcView = false;
			$ctrl.config.isQnoteView = true;
			$ctrl.updateTree(false);
			$scope.$apply();
			$timeout.flush();
	    	angular.forEach( $ctrl.nodes, function(node){
	    		if(node.color == 'red'){
	    			nodeHasColor = true;
	    		}
	    		node.color = null;
	    	});
			expect(nodeHasColor).toBe(true);
		});
	});
});