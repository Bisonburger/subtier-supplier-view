define(['ssv','js/ui-router.states', 'js/endpoints', 'js/alert-service'],function(ssv,states,endpoints,alertService){ 
                    ssv.config(function($stateProvider, $urlRouterProvider) {
                                $urlRouterProvider.otherwise(function($injector, $location) {
                                       return states.otherwise;
                                });

                                $urlRouterProvider.when('', states.when);

                                angular.forEach(states.states, function(value, key) {
                                        $stateProvider.state(key, value);
                                });
                        })
                .service('alertService',alertService )
                .constant('ENDPOINTS', endpoints);
});