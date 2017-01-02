define( [], function(){ return FavoriteDetailsComponent; } );

var FavoriteDetailsComponent = {
    controller: [ '$state', '$stateParams', 'alertService', 'AssemblySvc', 'FavoriteSvc', FavoriteDetailsCtrl],
    templateUrl: 'pages/ssv/components/favorite/favorite-details-tmpl.html'
};

function FavoriteDetailsCtrl( $state, $stateParams, alertService, AssemblySvc, FavoriteSvc ){
    var ctrl = this;
    
    ctrl.favorite;    
    ctrl.loaded = false;
    ctrl.isAdd = false;
    ctrl.matchingAssemblies = [];
    ctrl.showNoMatchingAssembliesError = false;
    ctrl.selectedAssembly = null;
    
    ctrl.save = save;
    ctrl.cancelSave = cancelSave;
    ctrl.loadFavorite = loadFavorite;
    ctrl.$onInit = onInit;
    
	function cancelSave(){
		$state.go('app.favorite-list');
	};
	
	function save(){
		if(ctrl.selectedAssembly != null){
			ctrl.favorite.assemblyNumber = ctrl.selectedAssembly.assemblyNumber;
			ctrl.favorite.assemblySite = ctrl.selectedAssembly.assemblySite;
			
			ctrl.favorite.$update().then(function(result){
				alertService.add('success', 'Favorite has been sucessfully saved.', 4000);
				ctrl.form.$setPristine(true);
				$state.go('app.favorite-list');
			});
		} else {
			ctrl.matchingAssemblies = [];
			ctrl.showNoMatchingAssembliesError = false;
			AssemblySvc.checkUniquePartAndSite(ctrl.favorite.partNumber, ctrl.favorite.partSite).then(function(results){
				if(results.length == 1){
					ctrl.favorite.assemblyNumber = results[0].assemblyNumber;
					ctrl.favorite.assemblySite = results[0].assemblySite;
					
					ctrl.favorite.$update().then(function(result){
						alertService.add('success', 'Favorite has been sucessfully saved.', 4000);
						ctrl.form.$setPristine(true);
						$state.go('app.favorite-list');
					});
				} else if(results.length == 0){
					ctrl.showNoMatchingAssembliesError = true;
				} else {
					ctrl.matchingAssemblies = results;
				}
			});
		}
	};
    
	function loadFavorite(id){
		ctrl.favorite = null;
    	FavoriteSvc.fetch($stateParams.id).then(function(favorite){
    		ctrl.favorite = favorite;
			if(ctrl.favorite){
				ctrl.loaded = true;
			} else {
				$state.go( 'app.favorite-list', null, {reload: true} );
			}
    	});
	};
	
    function onInit(){
		if($stateParams.id){
			ctrl.loadFavorite($stateParams.id);
		} else {
			ctrl.isAdd = true;
			ctrl.loaded = true;
			ctrl.favorite = null;
			ctrl.favorite = FavoriteSvc.create();
		}
    };
}