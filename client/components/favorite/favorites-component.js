define( [], function(){ return FavoritesComponent; } );

var FavoritesComponent = {
    controller: [ FavoritesCtrl],
    templateUrl: 'pages/ssv/components/favorite/favorites-tmpl.html'
};

function FavoritesCtrl( ){
    var ctrl = this;
    
    ctrl.$onInit = onInit;
    
    function onInit(){
    	
    };
}