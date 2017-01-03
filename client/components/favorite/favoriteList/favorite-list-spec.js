define( ['ssv','angular-mocks'], function(){
	describe('Test favorite-list-component controller', function() {
		
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
		
		it( 'should delete favorites', function(){
			//TODO: write tests
			pending();
		});
	});
});