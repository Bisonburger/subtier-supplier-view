define( ['ssv','angular-mocks'], function(){
	describe('Test bom-tree-component controller', function() {
		/* global inject pending */
		var $componentController;
		var $rootScope;

		beforeEach( module('ssv') );
		beforeEach( inject(function(_$componentController_, _$rootScope_ ) {
		    $componentController = _$componentController_;
		    $rootScope = _$rootScope_;
		  }));

		describe( 'Test initialization of the bom-tree-component', function(){

			it( 'should initialize to material view', function(){
				//TODO: write test
				pending();
			});

		});
		
		it( 'should update the tree view', function(){
			//TODO: write test
			pending();
		});
		
		it( 'should select an assembly and broadcast the event', function(){
			//TODO: write test
			pending();
		});

		it( 'should expand/collapse an assembly', function(){
			//TODO: write test
			pending();
		});
		
		it( 'should compute a path between nodes', function(){
			//TODO: write test
			pending();
		});
		
        it( 'should respond to the bomTreeRootChanged event', function(){
			//TODO: write test
        	pending();
        });
        
        it('should respond to the bomTreeConfigChanged event', function(){
			//TODO: write test
        	pending();
        });
        it('should respond to the bomFilterChanged event', function(){
			//TODO: write test
        	pending();
        });
        it('should responsd to the bomTreeExpandAll event', function(){ 
			//TODO: write test
        	pending();
        });
        it('should respond to the bomTreeCollapseAll event', function(){
			//TODO: write test
        	pending();
        });
        it('should respond to the bomTreeZoom event', function(){
			//TODO: write test
        	pending();
        } );
	});
});