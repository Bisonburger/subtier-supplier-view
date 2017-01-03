define( ['ssv','angular-mocks'], function(){
	describe('Test favorite-details-component controller', function() {
		
		/* global inject pending */
		var $componentController;
		var $rootScope;

		beforeEach( module('ssv') );
		beforeEach( inject(function(_$componentController_, _$rootScope_ ) {
		    $componentController = _$componentController_;
		    $rootScope = _$rootScope_;
		  }));


		it( 'should initialize properly', function(){
			//TODO: write tests	
			pending();
		});
		
	    it( 'should search for assemblies based on the search term', function(){
			//TODO: write tests
	    	pending();
	    });
	    
	    it( 'should search for a supplier based on the search term', function(){
			//TODO: write tests
	    	pending();
	    });
	    	
	    it( 'should save the user\'s favorites', function(){
			//TODO: write tests
	    	pending();
	    });

	    it( 'should cancel saving the user\'s favorites', function(){
			//TODO: write tests
	    	pending();
	    });
	    
	    it( 'should load the user\'s favorites', function(){
			//TODO: write tests
	    	pending();
	    });
	});
});