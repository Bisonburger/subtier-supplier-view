/*
 * RAYTHEON PROPRIETARY
 * 
 * 
 * Company Name: Raytheon Company Address 1151 E. Hermans Road, Tucson, AZ. 85706
 * 
 * Unpublished work Copyright 2016 Raytheon Company.
 * 
 * Contact Methods: RMS
 * 
 * This document contains proprietary data or information pertaining to items, or components, or processes, or other matter developed or acquired at
 * the private expense of the Raytheon Company and is restricted to use only by persons authorized by Raytheon in writing to use it. Disclosure to
 * unauthorized persons would likely cause substantial competitive harm to Raytheon's business position. Neither said document nor said technical data
 * or information shall be furnished or disclosed to or copied or used by persons outside Raytheon without the express written approval of Raytheon.
 * 
 * This Proprietary Notice Is Not Applicable If Delivered To The US Government
 */

define( [], function(){ return AssemblyParentageComponent; });

var AssemblyParentageComponent = {
	    controller: ['$scope', '$rootScope', AssemblyParentageCtrl],
	    templateUrl: 'pages/ssv/components/assemblyParentage/assembly-parentage-tmpl.html'
	};

function AssemblyParentageCtrl($scope,$rootScope){
    var ctrl = this;
    
    ctrl.$onInit = onInit;
    ctrl.zoomToAssembly = zoomToAssembly;

    function onInit(){
        ctrl.parenttree = [];
        $scope.$on( 'bomTreeNodeSelected', updatePath );
    };
    
    function updatePath(event,opts){
    	ctrl.parenttree = (opts && opts.pathToRoot)? opts.pathToRoot.reverse() : [];    	
    };
    
    function zoomToAssembly(assembly){
    	$rootScope.$broadcast( 'bomTreeZoom', {assembly: assembly} );
    }
};