define( ['ssv','angular-mocks'], function(){
	describe('Test assembly-view-component controller', function() {
		/* global inject expect */
		
		var $componentController;
		var $rootScope;
		var $ctrl;
				
		beforeEach( module('ssv') );
		beforeEach( inject(function(_$componentController_, _$rootScope_ ) {
		    $componentController = _$componentController_;
		    $rootScope = _$rootScope_;
		    $ctrl = $componentController( 'assemblyView', 
		    		{
		    			'$rootScope': $rootScope, 
		    			'alertService': {}, // TODO: Mock service
		    			'FavoriteSvc': {}, // TODO: Mock service
		    			'AssemblySvc': {} // TODO: Mock service
		    		}	
		    );
		    
			$ctrl.$onInit(); // need to manually fire initialization
		  }));
		
		
		it( 'should initialize properly', function(){			
			expect($ctrl).toBeDefined();
			expect($ctrl.isMaterialView).toBe(true);
	        expect($ctrl.isSupplierView).toBe(false);
	    	expect($ctrl.isScheduleView).toBe(true);
	    	expect($ctrl.isSpcView).toBe(false);
	    	expect($ctrl.isQnoteView).toBe(false);	
		});
		
		it( 'should set the assembly when receiving a bomTreeNodeSelected event', function(){
			expect($ctrl.assembly).not.toBeDefined();
			var assembly = {id:1};
			$rootScope.$broadcast( 'bomTreeNodeSelected', {assembly: assembly} );
			expect($ctrl.assembly).toEqual( assembly );
		});
		
		it( 'should set material view when bomTreeConfigChanged event is triggered', function(){
			$rootScope.$broadcast( 'bomTreeConfigChanged', {isMaterialView: false} );
			expect( $ctrl.isMaterialView ).toBe( false );			
			$rootScope.$broadcast( 'bomTreeConfigChanged', {isMaterialView: true} );
			expect( $ctrl.isMaterialView ).toBe( true );			
		});

	});
});
		
