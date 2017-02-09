/**
 * Configure the local version of SSV;
 *  
 * With RefApp5 this would already be done for you within the angular-app-config.js file, but
 * here we need to do a few things to get the basics to work such as:
 *   - Set up ui-router with the proper states
 *   - Read in the endpoint constants
 *   - Set up the alertService Service from RefApp5 (used to display info, warnings)
 */
define(['angular','ssv','js/ui-router.states', 'js/endpoints', 'js/alert-service'],         
function(angular,ssv,states,endpoints,alertService){
	
    ssv.config(function($stateProvider, $compileProvider, $urlRouterProvider, $qProvider) {
    	
    	$compileProvider.debugInfoEnabled(false);
    	$qProvider.errorOnUnhandledRejections( false );
    	$urlRouterProvider.otherwise(function($injector, $location) { return ($location.$$port == null)? 'favorites' : states.otherwise; });
        $urlRouterProvider.when('', states.when);
        angular.forEach(states.states, function(value, key) { if( key !== 'app' ) $stateProvider.state(key, value); });
        
        $stateProvider.state( 'app', 
        		{
					url : '/',
					views : {
						'content' : '',
						'footer' : {templateUrl : 'footer.html',},
						'header' : {templateUrl : 'header.html',}
					}
        		}); 
        		
    })
     .service('alertService',alertService )
     .constant('ENDPOINTS', endpoints);
});