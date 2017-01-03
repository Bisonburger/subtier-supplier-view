define( ['ssv','angular-mocks'], function(){
	describe('Test bom-tree-config-component controller', function() {
		
		var $componentController;
		var $rootScope;

		beforeEach( module('ssv') );
		beforeEach( inject(function(_$componentController_, _$rootScope_ ) {
		    $componentController = _$componentController_;
		    $rootScope = _$rootScope_;
		  }));
		
		describe( 'Test initialization of the bom-tree-config-component', function(){
						
			it( 'should set selected material & supplier attributes from the config', function(){
				//TODO: write test
			});

			it( 'should initialize to material view', function(){
				//TODO: write test
			});

		});
		
		it( 'should determine the count selected', function(){
			//TODO: write test
		});
		
		it( 'should show the supplier view', function(){
			//TODO: write test
		});

		it( 'should show the material view', function(){
			//TODO: write test
		});
		
		it( 'should determine if the attribute is disabled', function(){
			//TODO: write test
		});
		
		it( 'should map configuration values for attributes', function(){
			//TODO: write test
		});

	});
});
