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
define( [], function(){ return BomFilterComponent; } );

var BomFilterComponent = {
    controller: ['$rootScope', 'SSVConfig', BomFilterCtrl],
    templateUrl: 'pages/ssv/components/bomFilter/bom-filter-tmpl.html'
};

function BomFilterCtrl($rootScope,ssvConfig){
    var ctrl = this;
    
    ctrl.$onInit = onInit;
    ctrl.mapName = mapName;
    ctrl.applyFilterChange = applyFilterChange;
    ctrl.newFilter = newFilter;
    ctrl.removeFilter = removeFilter;    
    ctrl.changeFilterActive = changeFilterActive;
        
    /**
     * Initializer for the BomFilter controller, called as part of the ON-INIT lifecycle hook
     */
    function onInit(){
    	ctrl.filters = [];
    	ctrl.currentFilter = null;
    	newFilter(); // we'll add one filter
    	ctrl.selectedColor = '#7bd148';
    	ctrl.selectType = 'highlight';
    	ctrl.attrValues = {};
    	ctrl.attributes = ssvConfig.attributeList;
    	ctrl.partNumber = null;
    	$rootScope.$on('bomTreeRootChanged', _handleChangedRoot);
    	$rootScope.$on('sideNavShow', _onShow );
    	$rootScope.$on('sideNavHide', _onHide );
    };
    
    function _onShow(){
    	if( !ctrl.filters || ctrl.filters.length < 1 )
    		newFilter(); // make sure we always have a filter ready...
    }
    
    function _onHide(){
    	applyFilterChange(); // apply any changes we may have...
    }
    
    function mapName( name ){
    	return ( ssvConfig.attributeMap[name] )? ssvConfig.attributeMap[name] : name;
    };
    
    function applyFilterChange(){
    	if( ctrl.filterForm && !ctrl.filterForm.$submitted )
    		$rootScope.$broadcast( 'bomFilterChanged', ctrl.filters? ctrl.filters : [] );
    };
    
    function _fetchAllValuesForAttribute( root, attr ){
    	if( !root ) return;
    	
    	if( !ctrl.attrValues[ attr ] )
    		ctrl.attrValues[ attr ] = [];
   		if( root[attr] ){
   			var idx = ctrl.attrValues[ attr ].indexOf( root[attr] );
   			if( idx < 0 )
   				ctrl.attrValues[ attr ].push( root[attr] );
   		}
    	
    	if( root.children && root.children.length > 0 ) 
    		angular.forEach( root.children, function(child){ _fetchAllValuesForAttribute( child, attr ); } );
    	if( root._children && root._children.length > 0 ) 
    		angular.forEach( root._children, function(child){ _fetchAllValuesForAttribute( child, attr ); } );
    };
    
    /**
     * Event handler for the bomTreeRootChanged event
     */
    function _handleChangedRoot( event, opts ){
    	angular.forEach( ctrl.attributes, function(attr){ 
    		_fetchAllValuesForAttribute( opts.assembly, attr );
    	});    	
    };
    
    /**
     * Create a new filter
     */
    function newFilter(){
    	ctrl.filters.push({ name: 'Filter ' + (ctrl.filters.length + 1), 
    			       active: true, 
    			       selected: {}, 
    			       partNumber: null, 
    			       selectedColor: '#7bd148', 
    			       selectType: 'highlight'
    			     });
    	ctrl.currentFilter = ctrl.filters[ ctrl.filters.length - 1 ];
    }
    
    /**
     * Remove the currentFilter (as defined by ctrl.currentFilterIdx)
     */
    function removeFilter(){
    	
    	var idx = -1;
    	angular.forEach( ctrl.filters, function(filter,index){ if( filter === ctrl.currentFilter ) idx = index; })
    	if( idx >=0 ){ 
    		ctrl.filters.splice( idx,1 );    	   
    		ctrl.currentFilter = (ctrl.filters.length >= 0 )? ctrl.filters[0] : null;
    		applyFilterChange();
    	}
    	else{
    		console.log( 'unable to find!')
    	}
    }
    
    function changeFilterActive(){
    	ctrl.currentFilter.active = !ctrl.currentFilter.active;
    	applyFilterChange();
    }
}