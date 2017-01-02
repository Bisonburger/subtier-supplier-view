define( [ 'angular',
          './assembly-service', 
          './favorite-service'
        ],

function( angular, assemblySvc, favoriteSvc ){ 
	var ssvServices = angular.module( 'ssv.services', [] )
		.service('AssemblySvc', assemblySvc )
		.service( 'FavoriteSvc', favoriteSvc );
	
	return ssvServices;
});