define( ['angular', 'ssv','angular-mocks'], function(angular,ssv,mocks){
	/* global expect inject spyOn*/
	
	describe('Test assembly-parentage-component controller', function() {
		
		var $componentController;
		var $rootScope;
		var $ctrl;
				
		beforeEach( module('ssv') );
		beforeEach( inject(function(_$componentController_, _$rootScope_ ) {
		    $componentController = _$componentController_;
		    $rootScope = _$rootScope_;
		    $ctrl = $componentController( 'assemblyParentage', null );
			$ctrl.$onInit(); // need to manually fire initialization
		  }));
		
		
		it( 'should initialize to material view with an empty parentage', function(){
			expect($ctrl).toBeDefined();
			expect( $ctrl.isMaterialView).toBe(true);
			expect( $ctrl.parenttree).toBeDefined();
			expect( angular.isArray($ctrl.parenttree)).toBe(true);
			expect(0).toEqual( $ctrl.parenttree.length);

		});
		
		it( 'should update the path when the bomTreeNodeSelected event is triggered', function(){
			var pathToRoot = [ {id:2}, {id:1}];
			$rootScope.$broadcast( 'bomTreeNodeSelected', {pathToRoot: pathToRoot} );
			expect( $ctrl.parenttree ).toEqual( pathToRoot.reverse() );			
		});

		it( 'should set material view when bomTreeConfigChanged event is triggered', function(){
			$rootScope.$broadcast( 'bomTreeConfigChanged', {isMaterialView: false} );
			expect( $ctrl.isMaterialView ).toBe( false );			
			$rootScope.$broadcast( 'bomTreeConfigChanged', {isMaterialView: true} );
			expect( $ctrl.isMaterialView ).toBe( true );			
		});
		
		it( 'should broadcast a zoom event', function(){
			spyOn( $rootScope, '$broadcast' );
			$ctrl.zoomToAssembly( null );
			expect( $rootScope.$broadcast ).toHaveBeenCalled();
		});

		
	});
});