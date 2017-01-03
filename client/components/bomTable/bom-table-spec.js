define( ['ssv','angular-mocks'], function(){
	describe('Test bom-table-component controller', function() {
		
		/* global inject pending */
		
		var $componentController;
		var $rootScope;

		beforeEach( module('ssv') );
		beforeEach( inject(function(_$componentController_, _$rootScope_ ) {
		    $componentController = _$componentController_;
		    $rootScope = _$rootScope_;
		  }));
		
		//TODO: write tests
		it( 'should initialize', pending() );
		
	});
});