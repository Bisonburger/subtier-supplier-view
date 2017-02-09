define( ['ssv','angular-mocks', 'pages/ssv/tests/unit/mocks/FavoriteSvcMock'], function(ssv, mocks, FavoriteSvcMock){
	describe('Test favorite-list-component controller', function() {
		
		/* global inject pending */
		var $componentController;
		var favoriteSvcMock;
		var $ctrl;
		var $q;
		var $scope;

		beforeEach( module('ssv') );
		
		beforeEach( inject(function(_$componentController_, _$rootScope_, _$q_ ) {
		    $componentController = _$componentController_;
		    $q = _$q_;
		    $scope = _$rootScope_.$new();
		    
		    favoriteSvcMock = FavoriteSvcMock.Basic;
		    
		    $ctrl = $componentController( 'favoriteList', {
		    	FavoriteSvc: favoriteSvcMock
		    });
		  }));

		it( 'should initialize properly', function(){
			var favorites = [{ id: '1' },{ id: '2' }];
			favoriteSvcMock.query.and.returnValue($q.when(favorites));
			expect($ctrl.loaded).toBeFalsy();
			$ctrl.$onInit();
			$scope.$apply();
			
			expect($ctrl).toBeDefined();
			expect($ctrl.deleteFavorite).toBeDefined();
			expect(angular.isArray($ctrl.favorites)).toBe(true);
			expect($ctrl.favorites.length).toBe(2);
			expect($ctrl.loaded).toBe(true);
		});
		
		it( 'should delete favorite', function(){
			var favorites = [{ id: '1' },{ id: '2' }];
			favoriteSvcMock.query.and.returnValue($q.when(favorites));
			expect($ctrl.loaded).toBeFalsy();
			$ctrl.$onInit();
			$scope.$apply();
			
			expect($ctrl.favorites.length).toBe(2);
			
			var favoriteMock = {
					id : '2',
					$delete : function(){
						return $q.when();
					}
			};
			
			$ctrl.deleteFavorite(favoriteMock);
			$scope.$apply();
			
			expect($ctrl.favorites.length).toBe(1);
		});
	});
});