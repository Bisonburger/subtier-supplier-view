define( [], function(){ return FavoriteListComponent; } );

var FavoriteListComponent = {
    controller: [ '$state', 'FavoriteSvc', FavoriteListCtrl],
    templateUrl: 'pages/ssv/components/favorite/favorite-list-tmpl.html'
};

function FavoriteListCtrl( $state, FavoriteSvc ){
    var ctrl = this;
    
    ctrl.loaded = false;
    ctrl.favorites = [];
    
    ctrl.$onInit = onInit;
    ctrl.deleteFavorite = deleteFavorite;
    
    function onInit(){
    	FavoriteSvc.query().then(function(favorites){
    		ctrl.favorites = favorites;
    		ctrl.loaded = true;
    	});
    };
    
    function deleteFavorite(favorite){
    	favorite.$delete().then(function(){
    		ctrl.favorites = [];
        	FavoriteSvc.query().then(function(favorites){
        		ctrl.favorites = favorites;
        		ctrl.loaded = true;
        	});
    	});
    };
}